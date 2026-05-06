const Database = require("better-sqlite3");
const db = new Database(":memory:");

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    country TEXT
  );
`);

console.log("Seeding 100,000 rows (this proves the difference at real scale)...");
const insert = db.prepare("INSERT INTO users (email, country) VALUES (?, ?)");
const insertMany = db.transaction((rows) => {
  for (const row of rows) insert.run(row.email, row.country);
});
const countries = ["Kenya", "Nigeria", "USA", "UK", "India"];
const rows = Array.from({ length: 100000 }, (_, i) => ({
  email: `user${i}@example.com`,
  country: countries[i % countries.length],
}));
insertMany(rows);

function timeQuery(label, query, param) {
  const start = process.hrtime.bigint();
  const result = db.prepare(query).all(param);
  const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
  console.log(`${label}: ${ms.toFixed(2)}ms (${result.length} rows)`);
}

console.log("\n--- WITHOUT an index on email ---");
// WITHOUT an index, SQLite must check EVERY row (a "full table scan") -
// literally scanning all 100,000 rows to find the one match.
timeQuery("Lookup by email (no index)", "SELECT * FROM users WHERE email = ?", "user99999@example.com");

console.log(db.prepare("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?").all("x"));

console.log("\nCreating an index on email...");
db.exec("CREATE INDEX idx_users_email ON users(email)");

console.log("\n--- WITH an index on email ---");
// WITH an index, SQLite uses a B-tree lookup - roughly O(log n) instead of
// O(n). At 100k rows the difference is already noticeable; at millions of
// rows, an unindexed lookup becomes genuinely unusable.
timeQuery("Lookup by email (indexed)", "SELECT * FROM users WHERE email = ?", "user99999@example.com");

console.log(db.prepare("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?").all("x"));

console.log("\n--- The tradeoff: indexes slow down WRITES ---");
// Every INSERT/UPDATE/DELETE must now also update the index's B-tree
// structure. For tables with heavy write traffic and rare reads on a
// column, an index can do more harm than good. Also avoid indexing
// low-cardinality columns (like a boolean or a column with only 3 possible
// values) - the index barely narrows anything down, so it's not worth the
// write overhead and storage cost.
console.log("(No column with only a few distinct values - e.g. 'country' with 5");
console.log("options - benefits much from indexing the way 'email' just did.)");
