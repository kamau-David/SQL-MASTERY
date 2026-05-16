module.exports = {
  up: (db) => db.exec(`ALTER TABLE users ADD COLUMN age INTEGER;`),
  // SQLite can't drop a column pre-3.35 easily, so down() here rebuilds the table -
  // this is realistic: some migrations are genuinely harder to reverse than others.
  down: (db) => db.exec(`
    CREATE TABLE users_old AS SELECT id, username FROM users;
    DROP TABLE users;
    ALTER TABLE users_old RENAME TO users;
  `),
};
