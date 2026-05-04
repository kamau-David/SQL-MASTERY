DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL);
INSERT INTO customers VALUES (1,'Alice'), (2,'Bob'), (3,'Charlie');
INSERT INTO orders VALUES (1,1,100), (2,1,250), (3,2,50), (4,3,300), (5,3,80);

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (id INTEGER PRIMARY KEY, name TEXT, parent_id INTEGER);
INSERT INTO categories VALUES
  (1, 'Electronics', NULL),
  (2, 'Laptops', 1),
  (3, 'Gaming Laptops', 2),
  (4, 'Clothing', NULL);
