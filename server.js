const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'Public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/index.html'));
});

// 🔥 FIX: direct routing for HTML pages
app.get('/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, `Public/HTML/${page}`));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});