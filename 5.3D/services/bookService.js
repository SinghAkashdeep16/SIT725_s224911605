const books = require('../models/bookModel');

async function getAllBooks() {
  return books.find({}).lean({ getters: true });
}

async function getBookById(id) {
  return books.findOne({ id }).lean({ getters: true });
}
async function createBook(payload) {
  const doc = await books.create(payload);
  return doc.toJSON();
}

async function updateBook(id, payload) {
  const doc = await books.findOneAndUpdate(
    { id },
    payload,
    { new: true, runValidators: true, context: 'query' }
  );
  return doc ? doc.toJSON() : null;
}

module.exports = { getAllBooks, getBookById, createBook, updateBook };
