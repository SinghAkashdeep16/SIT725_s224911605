/**
 * SIT725 – 5.3D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// (matches models/bookModel.js schema rules)
// =============================

const CURRENT_YEAR = new Date().getFullYear();

function makeValidBook(id) {
  return {
    id,
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    year: 2008,
    genre: "Science Fiction",
    summary: "A first-contact story that spans decades and confronts humanity with an alien invasion.",
    price: "18.99"
  };
}

function makeValidUpdate() {
  return {
    title: "The Three-Body Problem (Updated)",
    author: "Liu Cixin",
    year: 2009,
    genre: "Science Fiction",
    summary: "Updated summary text describing the trilogy's opening novel in more detail.",
    price: "21.50"
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =====================================
  // ADDITIONAL COVERAGE TESTS
  // =====================================

  // ---- T06 Missing required field (title) on CREATE ----
  await test({
    id: "T06",
    name: "Missing title on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => { const b = makeValidBook(`b${Date.now()+2}`); delete b.title; return b; })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T07 Missing required field (price) on CREATE ----
  await test({
    id: "T07",
    name: "Missing price on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => { const b = makeValidBook(`b${Date.now()+3}`); delete b.price; return b; })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T08 Wrong type for year ----
  await test({
    id: "T08",
    name: "Non-numeric year on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+4}`), year: "twenty-twenty" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T09 Invalid genre (not in enum) ----
  await test({
    id: "T09",
    name: "Invalid genre on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+5}`), genre: "Horror" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T10 Price at/below boundary (zero) ----
  await test({
    id: "T10",
    name: "Zero price on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+6}`), price: "0.00" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T11 Negative price ----
  await test({
    id: "T11",
    name: "Negative price on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+7}`), price: "-5.00" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T12 Title too short (length violation) ----
  await test({
    id: "T12",
    name: "Title too short on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+8}`), title: "A" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T13 Summary too short (length violation) ----
  await test({
    id: "T13",
    name: "Summary too short on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+9}`), summary: "Too short" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T14 Title too long (length violation) ----
  await test({
    id: "T14",
    name: "Title too long on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+10}`), title: "A".repeat(201) },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T15 Year before earliest allowed (temporal/boundary) ----
  await test({
    id: "T15",
    name: "Year too far in the past",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+11}`), year: 1400 },
    tags: ["CREATE_FAIL", "TEMPORAL", "BOUNDARY"]
  });

  // ---- T16 Year in the future (temporal rule) ----
  await test({
    id: "T16",
    name: "Year in the future",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+12}`), year: CURRENT_YEAR + 5 },
    tags: ["CREATE_FAIL", "TEMPORAL"]
  });

  // ---- T17 Valid UPDATE (positive path) ----
  await test({
    id: "T17",
    name: "Valid update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 200,
    body: makeValidUpdate(),
    tags: []
  });

  // ---- T18 Required field emptied on UPDATE ----
  await test({
    id: "T18",
    name: "Empty title on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), title: "" },
    tags: ["UPDATE_FAIL", "REQUIRED"]
  });

  // ---- T19 Wrong type on UPDATE ----
  await test({
    id: "T19",
    name: "Non-numeric year on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: "not-a-year" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  // ---- T20 Invalid genre on UPDATE ----
  await test({
    id: "T20",
    name: "Invalid genre on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), genre: "Horror" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  // ---- T21 Boundary violation (negative price) on UPDATE ----
  await test({
    id: "T21",
    name: "Negative price on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), price: "-1.00" },
    tags: ["UPDATE_FAIL", "BOUNDARY"]
  });

  // ---- T22 Length violation (summary too short) on UPDATE ----
  await test({
    id: "T22",
    name: "Summary too short on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), summary: "short" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // ---- T23 Temporal violation (future year) on UPDATE ----
  await test({
    id: "T23",
    name: "Future year on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: CURRENT_YEAR + 10 },
    tags: ["UPDATE_FAIL", "TEMPORAL"]
  });

  // ---- T24 Update on non-existent record ----
  await test({
    id: "T24",
    name: "Update non-existent id",
    method: "PUT",
    path: updatePath(`${uniqueId}_nope`),
    expected: 404,
    body: makeValidUpdate(),
    tags: ["UPDATE_FAIL"]
  });

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});