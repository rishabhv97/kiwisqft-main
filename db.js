// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

// Determine which host to use
// If we are in production (on Hostinger), use 'localhost'
// If we are local, use the remote address from .env
const dbHost = process.env.NODE_ENV === 'production' ? 'localhost' : process.env.DB_HOST;

const pool = mysql.createPool({
    host: dbHost,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`🔌 Connected to database at: ${dbHost}`);

export default pool;