const express = require('express');
const path = require('path');

const app = express();

// Serve HTML folder directly
app.use(express.static(path.join(__dirname, 'Public/HTML')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/HTML/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});