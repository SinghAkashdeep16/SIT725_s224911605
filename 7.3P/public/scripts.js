const socket = io();

const productsDiv = document.getElementById('products');
const log = document.getElementById('log');

socket.on('stockUpdate', (products) => {
  productsDiv.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <span>${p.name} — Stock: ${p.stock}</span>
      <button ${p.stock <= 0 ? 'disabled' : ''} data-id="${p.id}">Buy</button>
    `;
    productsDiv.appendChild(div);
  });

  document.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      socket.emit('purchase', parseInt(btn.dataset.id));
    });
  });
});

socket.on('orderPlaced', (data) => {
  const p = document.createElement('p');
  p.textContent = `Order placed: ${data.name} (${data.remaining} left)`;
  log.prepend(p);
});

socket.on('purchaseError', (msg) => {
  alert(msg);
});