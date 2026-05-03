DROP TABLE IF EXISTS sales;
CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region TEXT NOT NULL,
  product TEXT NOT NULL,
  amount REAL NOT NULL
);
INSERT INTO sales (region, product, amount) VALUES
  ('Nairobi', 'Laptop', 1200), ('Nairobi', 'Mouse', 20), ('Nairobi', 'Laptop', 1100),
  ('Mombasa', 'Laptop', 1150), ('Mombasa', 'Keyboard', 45),
  ('Kisumu', 'Mouse', 18), ('Kisumu', 'Mouse', 22), ('Kisumu', 'Keyboard', 40);
