const mongoose = require('mongoose');

const CURRENT_YEAR = new Date().getFullYear();
const GENRES = ['Fiction', 'Non-fiction', 'Science Fiction', 'Fantasy', 'Classic', 'Historical Fiction', 'Mystery', 'Other'];

const BookSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'id is required'],
    unique: true,
    index: true,
    immutable: true
  },
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
    minlength: [2, 'title must be at least 2 characters'],
    maxlength: [200, 'title must be at most 200 characters']
  },
  author: {
    type: String,
    required: [true, 'author is required'],
    trim: true,
    minlength: [2, 'author must be at least 2 characters'],
    maxlength: [100, 'author must be at most 100 characters']
  },
  year: {
    type: Number,
    required: [true, 'year is required'],
    min: [1450, 'year must be 1450 or later'],
    max: [CURRENT_YEAR, `year cannot be later than ${CURRENT_YEAR}`],
    validate: { validator: Number.isInteger, message: 'year must be an integer' }
  },
  genre: {
    type: String,
    required: [true, 'genre is required'],
    enum: { values: GENRES, message: 'genre must be one of: ' + GENRES.join(', ') }
  },
  summary: {
    type: String,
    required: [true, 'summary is required'],
    trim: true,
    minlength: [10, 'summary must be at least 10 characters'],
    maxlength: [1000, 'summary must be at most 1000 characters']
  },
  price: {
    type: mongoose.Decimal128,
    required: [true, 'price is required'],
    get: v => (v ? `${v.toString()}AUD` : v),
    validate: {
      validator: function (v) {
        const num = parseFloat(v.toString());
        return !isNaN(num) && num > 0 && num <= 9999.99;
      },
      message: 'price must be greater than 0 and at most 9999.99'
    }
  }
}, {
  toJSON: { getters: true, virtuals: false, transform(_doc, ret) { delete ret.__v; return ret; } },
  toObject: { getters: true, virtuals: false }
});

module.exports = mongoose.model('Book', BookSchema);