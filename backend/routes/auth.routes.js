import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await getDb();

        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'fallback_secret_aerialpm_key_2026',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const db = await getDb();

        // Check if user already exists
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert new user
        const result = await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'operator']
        );

        // Generate token and log them in
        const token = jwt.sign(
            { id: result.lastID, email, role: 'operator', name },
            process.env.JWT_SECRET || 'fallback_secret_aerialpm_key_2026',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: result.lastID,
                name,
                email,
                role: 'operator'
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

router.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

export default router;
