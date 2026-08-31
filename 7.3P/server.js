const express = require('express');
const app = express();

app.use(express.static('public'));

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// In-memory "store" — shared stock across all connected clients
let products = [
  { id: 1, name: 'Wireless Mouse', stock: 8 },
  { id: 2, name: 'Mechanical Keyboard', stock: 5 },
  { id: 3, name: 'USB-C Hub', stock: 12 },
  { id: 4, name: 'Webcam 1080p', stock: 3 }
];

io.on('connection', (socket) => {
  console.log('a user connected');

  // send current stock to the newly connected client
  socket.emit('stockUpdate', products);

  // handle a purchase from any client
  socket.on('purchase', (productId) => {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    if (product.stock <= 0) {
      socket.emit('purchaseError', `${product.name} is out of stock`);
      return;
    }

    product.stock -= 1;

    // broadcast the updated stock list to EVERY connected client
    io.emit('stockUpdate', products);
    io.emit('orderPlaced', { name: product.name, remaining: product.stock });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));