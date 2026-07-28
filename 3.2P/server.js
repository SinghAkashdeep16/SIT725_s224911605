const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend (Materialize UI, css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// GET REST endpoint - returns plant data as JSON
app.get('/api/plants', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'plants.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading plants.json:', err);
      return res.status(500).json({ error: 'Failed to load plant data' });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Plant Catalog app running at http://localhost:${PORT}`);
});