module.exports = {
  up: (db) => db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE
    );
  `),
  down: (db) => db.exec(`DROP TABLE users;`),
};
