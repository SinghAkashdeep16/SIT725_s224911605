const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies (for POST requests)
app.use(express.json());

// GET endpoint: add two numbers
// Example: http://localhost:3000/add?a=5&b=10
app.get('/add', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: "Please provide valid numbers using query parameters 'a' and 'b'" });
  }

  res.json({ a, b, operation: 'add', result: a + b });
});

// GET endpoint: subtract two numbers
// Example: http://localhost:3000/subtract?num1=10&num2=4
app.get('/subtract', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Please provide valid numbers for num1 and num2' });
  }

  res.json({ num1, num2, operation: 'subtract', result: num1 - num2 });
});

// GET endpoint: multiply two numbers
// Example: http://localhost:3000/multiply?num1=3&num2=7
app.get('/multiply', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Please provide valid numbers for num1 and num2' });
  }

  res.json({ num1, num2, operation: 'multiply', result: num1 * num2 });
});

// GET endpoint: divide two numbers
// Example: http://localhost:3000/divide?num1=20&num2=4
app.get('/divide', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Please provide valid numbers for num1 and num2' });
  }
  if (num2 === 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }

  res.json({ num1, num2, operation: 'divide', result: num1 / num2 });
});

// POST endpoint: calculate using an operation passed in the JSON body
// Example body: { "num1": 5, "num2": 3, "operation": "add" }
app.post('/calculate', (req, res) => {
  const { num1, num2, operation } = req.body;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).json({ error: 'Please provide valid numbers for num1 and num2' });
  }

  let result;
  switch (operation) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      if (n2 === 0) {
        return res.status(400).json({ error: 'Cannot divide by zero' });
      }
      result = n1 / n2;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, or divide' });
  }

  res.json({ num1: n1, num2: n2, operation, result });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
