import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// --- ROUTES ---

// 1. GET Single Property by ID (For Details Page)
app.get('/api/properties/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// 2. GET Properties (For Listings Page)
app.get('/api/properties', async (req, res) => {
    try {
        const { type, search, minPrice, maxPrice } = req.query;
        let sql = 'SELECT * FROM properties WHERE status = "Approved"';
        const params = [];

        if (type) {
            sql += ' AND listing_type = ?';
            params.push(type);
        }
        // ... (Include other filters from previous step if needed)
        
        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch properties" });
    }
});

// 3. POST Property (For PostProperty Page)
app.post('/api/properties', upload.array('images', 6), async (req, res) => {
    try {
        const files = req.files;
        const data = req.body;
        const imageUrls = files.map(file => `/uploads/${file.filename}`);

        const sql = `
            INSERT INTO properties (
                owner_id, title, description, price, location, city, type, listing_type, 
                images, bedrooms, bathrooms, balconies, carpet_area, built_up_area, super_built_up_area,
                furnished_status, construction_status, year_built, floor_no, total_floors,
                facing_entry, facing_exit, parking_type, status, listed_by, amenities, available_documents
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.owner_id || 'guest',
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
            JSON.stringify(data.amenities ? data.amenities.split(',') : []),
            JSON.stringify(data.available_documents ? data.available_documents.split(',') : [])
        ];

        await pool.query(sql, values);
        res.json({ message: "Property posted successfully!" });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. POST Lead (For Contact Form)
app.post('/api/leads', async (req, res) => {
    try {
        const { property_id, seller_id, buyer_name, buyer_phone, message } = req.body;
        
        // Note: Make sure you have a 'leads' table in your MySQL DB
        const sql = `INSERT INTO leads (property_id, seller_id, buyer_name, buyer_phone, message) VALUES (?, ?, ?, ?, ?)`;
        
        await pool.query(sql, [property_id, seller_id, buyer_name, buyer_phone, message]);
        res.json({ message: "Lead submitted successfully" });
    } catch (error) {
        console.error("Lead Error:", error);
        res.status(500).json({ error: "Failed to submit enquiry" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});