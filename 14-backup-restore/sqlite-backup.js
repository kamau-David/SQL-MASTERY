const Database = require("better-sqlite3");
const fs = require("fs");

const db = new Database("app.db");
db.exec(`CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT)`);
db.prepare("INSERT INTO notes (text) VALUES (?)").run(`Backed up at ${new Date().toISOString()}`);

// SQLite's built-in backup API creates a consistent snapshot even while
// the database is being written to - safer than just copying the file
// with fs.copyFile while writes might be happening.
async function backup() {
  await db.backup("app-backup.db");
  console.log("Backup created: app-backup.db");
}

backup().then(() => {
  console.log("\nRestoring is just as simple - since SQLite is a single file,");
  console.log("'restoring' is literally: cp app-backup.db app.db");
  db.close();
});
