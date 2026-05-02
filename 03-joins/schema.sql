DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  item TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Note: 'Charlie' has NO orders - deliberately, to demonstrate LEFT JOIN
INSERT INTO customers (name) VALUES ('Alice'), ('Bob'), ('Charlie');
INSERT INTO orders (customer_id, item) VALUES (1, 'Laptop'), (1, 'Mouse'), (2, 'Keyboard');

-- Self-join demo data: employees with a manager_id pointing back to this same table
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  manager_id INTEGER REFERENCES employees(id)
);
INSERT INTO employees VALUES
  (1, 'Grace (CEO)', NULL),
  (2, 'David', 1),
  (3, 'Faith', 1),
  (4, 'John', 2);
