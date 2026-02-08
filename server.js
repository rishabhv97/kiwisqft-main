// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- API ROUTES ---

// Test Route to check connection
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ message: "Database connection successful!", result: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Example: Get Properties (Replacing Supabase)
app.get('/api/properties', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch properties" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});