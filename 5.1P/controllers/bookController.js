// Import the service
const bookService = require('../services/bookService');

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
