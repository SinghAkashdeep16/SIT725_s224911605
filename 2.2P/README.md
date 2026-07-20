# SIT725 - Task 2.2P: Express Web Server

A simple calculator built with Node.js and Express.

## What it does

- Serves a web page from the `public` folder
- Has GET endpoints to add, subtract, multiply, and divide two numbers
- Has one POST endpoint that can do all four operations

## How to run it

1. Clone the repo
   ```
   git clone <your-repo-url>
   cd sit725-task22p
   ```
2. Install packages
   ```
   npm install
   ```
3. Start the server
   ```
   npm start
   ```
4. Open your browser at http://localhost:3000

## Endpoints

**Add**
```
GET /add?a=5&b=10
```

**Subtract**
```
GET /subtract?num1=10&num2=4
```

**Multiply**
```
GET /multiply?num1=3&num2=7
```

**Divide**
```
GET /divide?num1=20&num2=4
```
(Dividing by 0 gives an error message instead of crashing.)

**Calculate (POST)**

Send this as the JSON body:
```json
{
  "num1": 5,
  "num2": 3,
  "operation": "add"
}
```
`operation` can be `add`, `subtract`, `multiply`, or `divide`.

## How to test it

Just open the URLs above in your browser, or use curl:
```
curl "http://localhost:3000/add?a=5&b=10"
curl -X POST http://localhost:3000/calculate -H "Content-Type: application/json" -d "{\"num1\":5,\"num2\":3,\"operation\":\"add\"}"
```


