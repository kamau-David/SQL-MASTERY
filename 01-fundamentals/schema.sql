-- DROP first so this script is safely re-runnable
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  price REAL
);

INSERT INTO books (title, author, year, price) VALUES
  ('Clean Code', 'Robert Martin', 2008, 34.99),
  ('The Pragmatic Programmer', 'Andy Hunt', 1999, 39.99),
  ('Designing Data-Intensive Applications', 'Martin Kleppmann', 2017, 44.99),
  ('You Dont Know JS', 'Kyle Simpson', 2014, 19.99),
  ('Refactoring', 'Martin Fowler', 2018, 42.50);
