import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { getIO } from '../websocket.js'; // Added for WebSocket functionality
import fs from 'fs'; // Added as it was in the provided diff, though not directly used in the snippet

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const db = await getDb();
        const { project_id } = req.query;
        let query = 'SELECT * FROM captures';
        const params = [];

        if (project_id) {
            query += ' WHERE project_id = ?';
            params.push(project_id);
        }

        query += ' ORDER BY captured_at DESC';
        const captures = await db.all(query, params);

        // Parse cv_data JSON string
        const parsedCaptures = captures.map(c => ({
            ...c,
            cv_data: c.cv_data ? JSON.parse(c.cv_data) : null
        }));

        res.json(parsedCaptures);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { project_id, phase, notes, cv_data } = req.body;
        const db = await getDb();

        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const originalUrl = `/uploads/originals/${req.file.filename}`;

        // Generate thumbnail
        const thumbFilename = `thumb_${req.file.filename}`;
        // Since __dirname is in `routes/`, we need to go up one level to reach the backend root
        const thumbPath = path.join(__dirname, '../uploads/thumbnails', thumbFilename);

        await sharp(req.file.path)
            .resize(400, null, { withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbPath);

        const thumbnailUrl = `/uploads/thumbnails/${thumbFilename}`;

        const result = await db.run(
            'INSERT INTO captures (project_id, phase, image_url, thumbnail_url, notes, cv_data) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, phase, originalUrl, thumbnailUrl, notes, cv_data || null]
        );

        const captureId = result.lastID;
        let cvDataObj = null;

        // If high cv_data score is passed, update project progress
        if (cv_data) {
            try {
                cvDataObj = typeof cv_data === 'string' ? JSON.parse(cv_data) : cv_data;
                if (cvDataObj && cvDataObj.score) {
                    await db.run(
                        'INSERT INTO cv_history (project_id, capture_id, score, worker_count, machinery_count, scene_label) VALUES (?, ?, ?, ?, ?, ?)',
                        [project_id, captureId, cvDataObj.score, cvDataObj.workerCount || 0, cvDataObj.machineCount || 0, cvDataObj.label || 'Unknown']
                    );
                }
            } catch (e) { console.error("Error parsing cv_data", e) }
        }

        // Fetch the newly saved capture to return it
        const savedCapture = await db.get('SELECT * FROM captures WHERE id = ?', [captureId]);

        // Broadcast live update to all connected dashboards
        const io = getIO();
        if (io) {
            io.emit('live_cv_update', {
                projectId: project_id,
                captureId: captureId,
                phase,
                cvData: cvDataObj,
                thumbnail: thumbnailUrl, // Use the generated thumbnailUrl directly
                timestamp: new Date().toISOString()
            });
        }

        res.status(201).json({
            id: captureId,
            message: 'Capture saved successfully',
            originalUrl,
            thumbnailUrl,
            capture: savedCapture // Return the full capture object
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
