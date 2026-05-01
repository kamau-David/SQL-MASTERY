const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database(":memory:");
db.pragma("foreign_keys = ON"); // SQLite requires this to be turned on explicitly!

db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8"));

const statements = fs
  .readFileSync(path.join(__dirname, "test-constraints.sql"), "utf-8")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

// Each statement run individually with try/catch so we can SEE which
// constraint blocked each bad insert, instead of the script just crashing
for (const stmt of statements) {
  try {
    db.exec(stmt);
    console.log("OK:  ", stmt.split("\n")[0]);
  } catch (err) {
    console.log("FAIL:", stmt.split("\n")[0], "->", err.message);
  }
}

console.log("\nFinal customers table:");
console.table(db.prepare("SELECT * FROM customers").all());
