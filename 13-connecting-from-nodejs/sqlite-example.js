const Database = require("better-sqlite3");
const db = new Database("app.db"); // file-based - persists between runs, unlike ":memory:"

db.exec(`CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT)`);

// better-sqlite3 is SYNCHRONOUS - no async/await needed, since SQLite runs
// in-process (no network round-trip like a real database server).
const insert = db.prepare("INSERT INTO notes (text) VALUES (?)");
insert.run("Learning SQL with Node.js");

const notes = db.prepare("SELECT * FROM notes").all();
console.log("Notes:", notes);

db.close();
