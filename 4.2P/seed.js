const mongoose = require('mongoose');
const Plant = require('./models/Plant');

mongoose.connect('mongodb://127.0.0.1:27017/plantCatalogDB').then(async () => {
  await Plant.deleteMany({});
  await Plant.insertMany([
    { name: "Monstera Deliciosa", category: "Tropical", description: "Large split leaves, loves bright indirect light.", image: "images/monstera.jpg" },
    { name: "Snake Plant", category: "Succulent", description: "Nearly indestructible, tolerates low light and neglect.", image: "images/snake-plant.jpg" },
    { name: "Fiddle Leaf Fig", category: "Tropical", description: "Statement plant with large violin-shaped leaves.", image: "images/fiddle-leaf-fig.jpg" },
    { name: "Lavender", category: "Herb", description: "Fragrant purple blooms, needs full sun.", image: "images/lavender.jpg" },
    { name: "Aloe Vera", category: "Succulent", description: "Medicinal succulent, thrives on neglect.", image: "images/aloe-vera.jpg" },
    { name: "Basil", category: "Herb", description: "Kitchen herb, needs regular watering and sun.", image: "images/basil.jpg" }
  ]);
  console.log("Seeded plants");
  mongoose.connection.close();
});