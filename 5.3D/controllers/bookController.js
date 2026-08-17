const bookService = require('../services/bookService');

const ALLOWED_CREATE_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];
const ALLOWED_UPDATE_FIELDS = ['title', 'author', 'year', 'genre', 'summary', 'price'];

function unknownFields(body, allowed) {
  return Object.keys(body).filter(k => !allowed.includes(k));
}

// Controller uses the service to get data
exports.getAllBooks = async (_req, res, next) => {
  try {
    const items = await bookService.getAllBooks();
    res.status(200).json({
      statusCode: 200,
      data: items,
      message: 'Books retrieved using service'
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        message: `Book with id ${req.params.id} not found`
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: book,
      message: 'Book retrieved using service'
    });
  } catch (err) {
    next(err);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const unknown = unknownFields(req.body, ALLOWED_CREATE_FIELDS);
    if (unknown.length) {
      return res.status(400).json({ statusCode: 400, data: null, message: `Unexpected field(s): ${unknown.join(', ')}` });
    }

    const created = await bookService.createBook(req.body);
    res.status(201).json({ statusCode: 201, data: created, developedBy: 's224911605', message: 'Book created' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ statusCode: 409, data: null, message: `Book with id ${req.body.id} already exists` });
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ statusCode: 400, data: null, message: err.message });
    }
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, 'id')) {
      return res.status(400).json({ statusCode: 400, data: null, message: 'id is immutable and cannot be changed via update' });
    }

    const unknown = unknownFields(req.body, ALLOWED_UPDATE_FIELDS);
    if (unknown.length) {
      return res.status(400).json({ statusCode: 400, data: null, message: `Unexpected field(s): ${unknown.join(', ')}` });
    }

    const updated = await bookService.updateBook(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ statusCode: 404, data: null, message: `Book with id ${req.params.id} not found` });
    }

    res.status(200).json({ statusCode: 200, data: updated, developedBy: 's224911605', message: 'Book updated' });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ statusCode: 400, data: null, message: err.message });
    }
    next(err);
  }
};

exports.integrityCheck = (_req, res) => res.status(204).send();