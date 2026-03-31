const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// ✅ PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ✅ Create table automatically
pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name TEXT,
        phone TEXT,
        email TEXT,
        date TEXT,
        time TEXT,
        message TEXT
    )
`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'Public')));

// ✅ POST route (save to DB)
app.post('/appointment', async (req, res) => {
    const { name, phone, email, date, time, message } = req.body;

    try {
        await pool.query(
            'INSERT INTO appointments(name, phone, email, date, time, message) VALUES($1, $2, $3, $4, $5, $6)',
            [name, phone, email, date, time, message]
        );

        console.log("Saved to DB");
        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.get('/appointments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

app.delete('/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM appointments WHERE id = $1', [id]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting appointment");
    }
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});