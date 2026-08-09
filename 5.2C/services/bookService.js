const books = require('../models/bookModel');

async function getAllBooks() {
  return books.find({}).lean({ getters: true });
}

async function getBookById(id) {
  return books.findOne({ id }).lean({ getters: true });
}

module.exports = {
  getAllBooks,
  getBookById
};
