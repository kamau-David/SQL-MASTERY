const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database(path.join(__dirname, "app.db"));

// Track which migrations have already run - THIS is the core idea of a
// migration system: never apply the same migration twice, and always know
// the exact current state of the schema.
db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT DEFAULT (datetime('now'))
  );
`);

function getMigrationFiles() {
  return fs.readdirSync(path.join(__dirname, "migrations"))
    .filter((f) => f.endsWith(".js"))
    .sort(); // numeric prefixes (001, 002...) guarantee correct ordering
}

function getAppliedMigrations() {
  return new Set(db.prepare("SELECT name FROM schema_migrations").all().map((r) => r.name));
}

function up() {
  const applied = getAppliedMigrations();
  const files = getMigrationFiles();
  let ranAny = false;
  for (const file of files) {
    if (applied.has(file)) continue;
    const migration = require(path.join(__dirname, "migrations", file));
    console.log(`Applying ${file}...`);
    migration.up(db);
    db.prepare("INSERT INTO schema_migrations (name) VALUES (?)").run(file);
    ranAny = true;
  }
  if (!ranAny) console.log("Nothing to apply - schema is up to date.");
}

function down() {
  const applied = [...getAppliedMigrations()].sort();
  const last = applied[applied.length - 1];
  if (!last) return console.log("No migrations to roll back.");
  const migration = require(path.join(__dirname, "migrations", last));
  console.log(`Rolling back ${last}...`);
  migration.down(db);
  db.prepare("DELETE FROM schema_migrations WHERE name = ?").run(last);
}

const command = process.argv[2];
if (command === "up") up();
else if (command === "down") down();
else console.log("Usage: node migrate.js [up|down]");
