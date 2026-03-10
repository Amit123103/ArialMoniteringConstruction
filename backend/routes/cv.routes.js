import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { analyzeImageWithOpenCV } from '../cv/imageAnalyzer.js';
import { detectChanges } from '../cv/changeDetector.js';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/analyze', requireAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image provided' });

        // Preprocess image with sharp before passing to OpenCV
        const buffer = await sharp(req.file.path)
            .resize(1024, null, { withoutEnlargement: true })
            .toBuffer();

        const cvAnalysisResult = await analyzeImageWithOpenCV(buffer, 1024, 768);

        // Gen thumbnail for return
        const thumbFilename = `req_thumb_${Date.now()}.jpg`;
        const thumbPath = path.join(__dirname, '../../uploads/thumbnails', thumbFilename);
        await sharp(req.file.path).resize(400).jpeg({ quality: 80 }).toFile(thumbPath);

        res.json({
            analysis: {
                ...cvAnalysisResult,
                thumbnailUrl: `/uploads/thumbnails/${thumbFilename}`
            }
        });
    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/compare', requireAuth, async (req, res) => {
    try {
        const { beforeCaptureId, afterCaptureId } = req.body;
        const db = await getDb();

        const before = await db.get('SELECT image_url FROM captures WHERE id = ?', [beforeCaptureId]);
        const after = await db.get('SELECT image_url FROM captures WHERE id = ?', [afterCaptureId]);

        if (!before || !after) return res.status(404).json({ error: 'Capture not found' });

        const beforePath = path.join(__dirname, '..', before.image_url);
        const afterPath = path.join(__dirname, '..', after.image_url);

        const changeResult = await detectChanges(beforePath, afterPath);
        res.json(changeResult);
    } catch (error) {
        console.error("Compare Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/save-analysis', requireAuth, async (req, res) => {
    try {
        const { captureId, analysisData } = req.body;
        const db = await getDb();

        await db.run(
            'UPDATE captures SET cv_data = ? WHERE id = ?',
            [JSON.stringify(analysisData), captureId]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/history', requireAuth, async (req, res) => {
    try {
        const db = await getDb();
        const { project_id } = req.query;

        if (!project_id) return res.status(400).json({ error: 'project_id required' });

        const history = await db.all(`
            SELECT c.id, c.captured_at, c.cv_data, h.score, h.worker_count 
            FROM captures c
            LEFT JOIN cv_history h ON c.id = h.capture_id
            WHERE c.project_id = ? AND c.cv_data IS NOT NULL
            ORDER BY c.captured_at DESC
        `, [project_id]);

        // Return average score
        const totalScore = history.reduce((sum, item) => sum + (item.score || 0), 0);
        const averageScore = history.length > 0 ? totalScore / history.length : 0;

        res.json({ history, averageScore: Math.round(averageScore), trend: 'stable' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
