const express = require('express');
const path = require('path');

const app = express();

// Serve entire Public folder
app.use(express.static(path.join(__dirname, 'Public')));

// Explicit routes (IMPORTANT FIX)
app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/about.html'));
});

app.get('/services.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/services.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/contact.html'));
});

app.get('/appointment.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/Appointment.html'));
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});