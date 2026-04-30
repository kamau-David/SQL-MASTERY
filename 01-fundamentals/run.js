const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database(":memory:"); // in-memory - resets every run, safe to experiment

function runSqlFile(filename) {
  const sql = fs.readFileSync(path.join(__dirname, filename), "utf-8");
  // Split on semicolons to run each statement separately so we can log each result
  const statements = sql.split(";").map((s) => s.trim()).filter(Boolean);
  for (const statement of statements) {
    // Strip comment lines before checking the statement type - otherwise a
    // SELECT preceded by an explanatory "-- comment" line on its own line
    // gets misclassified, since the whole trimmed chunk then starts with "--".
    const codeOnly = statement
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim();
    if (codeOnly.toUpperCase().startsWith("SELECT")) {
      console.log(`\n> ${statement}`);
      console.table(db.prepare(statement).all());
    } else if (codeOnly) {
      db.exec(statement);
    }
  }
}

runSqlFile("schema.sql");
runSqlFile("queries.sql");
