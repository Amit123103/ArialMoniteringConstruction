import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:projectId', requireAuth, async (req, res) => {
    try {
        const db = await getDb();
        const projectId = req.params.projectId;

        // Get generic progress info
        const project = await db.get('SELECT progress FROM projects WHERE id = ?', [projectId]);

        // Get History of CV Scores
        const history = await db.all('SELECT score, created_at, worker_count, machinery_count FROM cv_history WHERE project_id = ? ORDER BY created_at ASC', [projectId]);

        res.json({
            currentProgress: project ? project.progress : 0,
            cvHistory: history
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
