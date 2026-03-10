import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all projects
router.get('/', requireAuth, async (req, res) => {
    try {
        const db = await getDb();
        const projects = await db.all('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single project details
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const db = await getDb();
        const project = await db.get('SELECT * FROM projects WHERE id = ?', [req.params.id]);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Get recent captures
        const captures = await db.all('SELECT * FROM captures WHERE project_id = ? ORDER BY captured_at DESC LIMIT 5', [req.params.id]);

        res.json({ ...project, recentCaptures: captures });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create project
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, description, location, start_date } = req.body;
        const db = await getDb();

        const result = await db.run(
            'INSERT INTO projects (name, description, location, start_date) VALUES (?, ?, ?, ?)',
            [name, description, location, start_date]
        );

        res.status(201).json({ id: result.lastID, message: 'Project created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
