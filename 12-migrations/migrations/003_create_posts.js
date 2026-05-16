module.exports = {
  up: (db) => db.exec(`
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `),
  down: (db) => db.exec(`DROP TABLE posts;`),
};
