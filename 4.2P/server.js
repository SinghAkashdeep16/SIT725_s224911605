var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Plant = require('./models/Plant');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://127.0.0.1:27017/plantCatalogDB');
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));

// GET all plants
app.get('/api/plants', async (req, res) => {
  const plants = await Plant.find({});
  res.json(plants);
});

// POST new plant — allowlisted + schema validated (safe write)
app.post('/api/plants', async (req, res) => {
  try {
    const { name, category, description, image } = req.body;
    const plant = new Plant({ name, category, description, image });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));