const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const app = require("../server");
const { calculatePriceWithGST } = require("../services/priceCalculator");

describe("Price Calculator Function", function () {
  it("should correctly add 10% GST to a valid price", function () {
    expect(calculatePriceWithGST(100)).to.equal(110);
  });

  it("should throw an error for a negative price (invalid input)", function () {
    expect(() => calculatePriceWithGST(-5)).to.throw("Price cannot be negative");
  });
});

describe("Books REST API", function () {
  it("GET /api/books should return 200 and an array (valid case)", function (done) {
    chai.request(app)
      .get("/api/books")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("GET /api/books/:id should return 404 for a non-existent id (edge case)", function (done) {
    chai.request(app)
      .get("/api/books/does-not-exist-999")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});