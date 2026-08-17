const express = require('express');
const router = express.Router();

const Controllers = require('../controllers');

router.get('/', Controllers.bookController.getAllBooks);
router.get('/:id', Controllers.bookController.getBookById);
router.post('/', Controllers.bookController.createBook);
router.put('/:id', Controllers.bookController.updateBook);

module.exports = router;