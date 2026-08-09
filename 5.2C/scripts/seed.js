const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/bookDB');

const books = require('../models/bookModel');

const sampleData = [
  { 
    id: "b1",
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    year: 2008,
    genre: "Science Fiction",
    summary: "The Three-Body Problem is the first novel in the Remembrance of Earth's Past trilogy...",
    price: "18.99"
  },
  {
    id: "b2",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    year: 1847,
    genre: "Classic",
    summary: "An orphaned governess confronts class, morality, and love at Thornfield Hall...",
    price: "12.50"
  },
  {
    id: "b3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    genre: "Classic",
    summary: "Elizabeth Bennet and Mr. Darcy navigate pride, misjudgement, and social expectations...",
    price: "11.25"
  },
  {
    id: "b4",
    title: "The English Patient",
    author: "Michael Ondaatje",
    year: 1992,
    genre: "Historical Fiction",
    summary: "In a ruined Italian villa at the end of WWII, four strangers with intersecting pasts...",
    price: "15.75"
  },
  {
    id: "b5",
    title: "Small Gods",
    author: "Terry Pratchett",
    year: 1992,
    genre: "Fantasy",
    summary: "In Omnia, the god Om returns as a tortoise, and novice Brutha must confront dogma...",
    price: "14.00"
  }
];

(async () => {
  try {
    // ensure unique on id (good practice)
    await books.collection.createIndex({ id: 1 }, { unique: true });

    // clear and insert
    await books.deleteMany({});
    await books.insertMany(sampleData);

    console.log('Seeded 5 books.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
