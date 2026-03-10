import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const db = await getDb();
        const alerts = await db.all(`
            SELECT a.*, p.name as project_name 
            FROM alerts a 
            LEFT JOIN projects p ON a.project_id = p.id 
            ORDER BY a.created_at DESC 
            LIMIT 50
        `);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
