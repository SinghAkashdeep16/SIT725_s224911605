// Adds GST (10%) to a book price
function calculatePriceWithGST(price) {
  if (typeof price !== 'number' || isNaN(price)) {
    throw new Error('Price must be a valid number');
  }
  if (price < 0) {
    throw new Error('Price cannot be negative');
  }
  return Math.round(price * 1.1 * 100) / 100;
}

module.exports = { calculatePriceWithGST };