const express = require('express');
const app = express();
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'Public')));

// Default route (IMPORTANT)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});