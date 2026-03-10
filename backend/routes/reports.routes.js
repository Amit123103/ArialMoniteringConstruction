import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/summary', requireAuth, async (req, res) => {
    try {
        const db = await getDb();
        const projectCountRow = await db.get('SELECT COUNT(*) as count FROM projects');
        const captureCountRow = await db.get('SELECT COUNT(*) as count FROM captures');
        const avgProgressRow = await db.get('SELECT AVG(progress) as avg FROM projects WHERE status="active"');

        res.json({
            totalProjects: projectCountRow ? projectCountRow.count : 0,
            totalCaptures: captureCountRow ? captureCountRow.count : 0,
            averageProgress: avgProgressRow && avgProgressRow.avg ? Math.round(avgProgressRow.avg) : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
