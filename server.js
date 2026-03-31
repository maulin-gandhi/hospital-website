const express = require('express');
const session = require('express-session');
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

pool.query(`
    ALTER TABLE appointments 
    ADD COLUMN IF NOT EXISTS appointment_id TEXT;
`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'clinic_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'Public')));

// ✅ POST route (save to DB)
app.post('/appointment', async (req, res) => {
    const { name, phone, email, date, time, message } = req.body;

    try {
        // Get count
        const countResult = await pool.query('SELECT COUNT(*) FROM appointments');
        const count = parseInt(countResult.rows[0].count) + 1;

        // Generate ID like APT-001
        const appointmentId = `APT-${String(count).padStart(3, '0')}`;

        await pool.query(
            `INSERT INTO appointments(appointment_id, name, phone, email, date, time, message)
             VALUES($1, $2, $3, $4, $5, $6, $7)`,
            [appointmentId, name, phone, email, date, time, message]
        );

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

app.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, date, time, message } = req.body;

    try {
        await pool.query(
            `UPDATE appointments 
             SET name=$1, phone=$2, email=$3, date=$4, time=$5, message=$6 
             WHERE id=$7`,
            [name, phone, email, date, time, message, id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating appointment");
    }
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/index.html'));
});

//login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("ENV USER:", process.env.ADMIN_USER_1);
    console.log("ENV PASS:", process.env.ADMIN_PASS_1);

    const users = [
        {
            username: process.env.ADMIN_USER_1,
            password: process.env.ADMIN_PASS_1
        },
        {
            username: process.env.ADMIN_USER_2,
            password: process.env.ADMIN_PASS_2
        }
    ];

    const validUser = users.find(
        u => u.username === username && u.password === password
    );

    if (validUser) {
        req.session.loggedIn = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// 🔐 ADD THIS HERE (AUTH MIDDLEWARE)
function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login.html');
    }
}


// 🔐 PROTECT ADMIN PAGE
app.get('/admin.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/admin.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});