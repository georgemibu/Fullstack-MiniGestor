import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());
app.use(express.json());

//Abrimos base de datos - Crea database.db si no existe
const dbPromise = open({
    filename: './database.db',
    driver: sqlite3.Database,
});

//Crear tablas si no existen
(async () => {
    const db = await dbPromise;
    await db.exec(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL
);
`);


    await db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
user_id INTEGER,
FOREIGN KEY(user_id) REFERENCES users(id)
);
`);
})();

//Endpoints 
app.post('/users', async (req, res) =>{
    const db = await dbPromise;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await db.run('INSERT INTO users (name) VALUES (?)', name);
    res.status(201).json({ id: result.lastID, name });
})
app.get('/users', async (req, res) =>{
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM users');
    res.json(users);
})
app.post('/tasks', async (req, res) =>{
    const db = await dbPromise;
    const { title, user_id } = req.body;
    if (!title || !user_id) return res.status(400).json({ error: 'Title and user_id are required' });
    const result = await db.run('INSERT INTO tasks (title, user_id) VALUES (?, ?)', [title, user_id || null]);    
    res.status(201).json({ id: result.lastID, title, user_id });
})
app.get('/tasks', async (req, res) => {
    const db = await dbPromise;
    const tasks = await db.all('SELECT * FROM tasks');
    res.json(tasks);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});