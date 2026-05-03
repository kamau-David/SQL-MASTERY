const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const db = new Database(":memory:");
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8"));
const queries = fs.readFileSync(path.join(__dirname, "queries.sql"), "utf-8")
  .split(";").map((s) => s.trim()).filter((s) => s && s.toUpperCase().includes("SELECT"));
queries.forEach((q, i) => { console.log(`\n--- Query ${i + 1} ---\n${q}`); console.table(db.prepare(q).all()); });
