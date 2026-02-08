import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- AUTH ROUTES ---

// 1. REGISTER
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, role || 'User']
        );

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = users[0];

        // Check Password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: 'Invalid password' });

        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        // Return User Info (exclude password)
        const { password: _, ...userInfo } = user;
        res.json({ token, user: userInfo });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// --- PROPERTY ROUTES ---

// 3. POST PROPERTY (With Images)
app.post('/api/properties', upload.array('images', 6), async (req, res) => {
    try {
        const files = req.files;
        const data = req.body;
        const imageUrls = files.map(file => `/uploads/${file.filename}`);

        // Handle Array Fields
        const amenities = data.amenities ? data.amenities.split(',') : [];
        const documents = data.available_documents ? data.available_documents.split(',') : [];
        const additionalRooms = data.additional_rooms ? data.additional_rooms.split(',') : [];
        const views = data.views ? data.views.split(',') : [];

        const sql = `
            INSERT INTO properties (
                owner_id, title, description, price, location, city, type, listing_type, 
                images, bedrooms, bathrooms, balconies, carpet_area, built_up_area, super_built_up_area,
                furnished_status, construction_status, year_built, floor_no, total_floors,
                facing_entry, facing_exit, parking_type, status, listed_by, amenities, available_documents,
                additional_rooms, views, price_per_sqft, brokerage_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.owner_id,
            data.title,
            data.description,
            data.price,
            data.location,
            data.city,
            data.type,
            data.listing_type,
            JSON.stringify(imageUrls),
            data.bedrooms,
            data.bathrooms,
            data.balconies,
            data.carpet_area || 0,
            data.built_up_area || 0,
            data.super_built_up_area || 0,
            data.furnished_status,
            data.construction_status,
            data.year_built || 0,
            data.floor_no || 0,
            data.total_floors || 0,
            data.facing_entry,
            data.facing_exit,
            data.parking_type,
            'Pending',
            data.listed_by,
            JSON.stringify(amenities),
            JSON.stringify(documents),
            JSON.stringify(additionalRooms),
            JSON.stringify(views),
            data.price_per_sqft || 0,
            data.brokerage_amount || 0
        ];

        await pool.query(sql, values);
        res.json({ message: "Property posted successfully!" });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. GET ALL PROPERTIES
app.get('/api/properties', async (req, res) => {
    try {
        // ... (Keep your existing filter logic here from previous steps) ...
        const [rows] = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch" });
    }
});

// 5. GET SINGLE PROPERTY
app.get('/api/properties/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
        if(rows.length === 0) return res.status(404).json({error: "Not Found"});
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});