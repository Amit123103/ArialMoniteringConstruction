import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export const initDatabase = async () => {
    // Open the database with promise wrapper
    db = await open({
        filename: path.join(__dirname, 'aerialpm.db'),
        driver: sqlite3.Database
    });

    // Enable WAL mode for better performance
    await db.exec('PRAGMA journal_mode = WAL');

    // Create Tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'manager',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            location TEXT,
            status TEXT DEFAULT 'active',
            progress INTEGER DEFAULT 0,
            start_date DATE,
            end_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS captures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            phase TEXT,
            image_url TEXT NOT NULL,
            thumbnail_url TEXT,
            notes TEXT,
            cv_data JSON,
            captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS cv_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            capture_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            worker_count INTEGER DEFAULT 0,
            machinery_count INTEGER DEFAULT 0,
            material_count INTEGER DEFAULT 0,
            scene_label TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (capture_id) REFERENCES captures (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            read BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        );
    `);

    // Seed initial users if none exist
    const userCountRow = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCountRow.count === 0) {
        const hash = bcrypt.hashSync('Admin@123', 10);
        const managerHash = bcrypt.hashSync('Manager@123', 10);
        await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin User', 'admin@aerialpm.com', hash, 'admin']);
        await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Manager User', 'manager@aerialpm.com', managerHash, 'manager']);
        console.log('Seed users created.');
    }

    // Seed test project if none
    const projectCountRow = await db.get('SELECT COUNT(*) as count FROM projects');
    if (projectCountRow.count === 0) {
        await db.run('INSERT INTO projects (name, description, location, status, progress, start_date) VALUES (?, ?, ?, ?, ?, ?)', ['Downtown Tower', '50-story commercial building', 'Downtown District', 'active', 15, '2025-01-01']);
        console.log('Seed project created.');
    }

    return db;
};

export const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
