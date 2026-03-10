import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer } from 'http';
import { initWebSocketServer } from './websocket.js';
import { initDatabase } from './database.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/projects.routes.js';
import captureRoutes from './routes/captures.routes.js';
import progressRoutes from './routes/progress.routes.js';
import alertRoutes from './routes/alerts.routes.js';
import reportRoutes from './routes/reports.routes.js';
import cvRoutes from './routes/cv.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Initialize WebSockets
initWebSocketServer(server);

// Ensure upload directories exist
const uploadDirs = ['uploads/originals', 'uploads/thumbnails'];
uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/captures', captureRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/cv', cvRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;

// Initialize Database before starting
try {
    initDatabase();
    console.log('Database initialized successfully');
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`WebSocket server initialized`);
    });
} catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
}
