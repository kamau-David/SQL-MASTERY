-- GOOD: normalized into three related tables. Each fact lives in exactly ONE place.
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  address TEXT
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Junction table: links orders <-> products, since one order can have MANY
-- products and one product can appear in MANY orders (a many-to-many relationship)
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO customers (name, email, address) VALUES ('Alice', 'alice@mail.com', 'Nairobi');
INSERT INTO products (name, price) VALUES ('Laptop', 1200), ('Mouse', 20), ('Keyboard', 45);
INSERT INTO orders (customer_id) VALUES (1);
INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 1, 1), (1, 2, 2), (1, 3, 1);

-- Now: change Alice's email ONCE, in ONE row. Change the Laptop's price
-- ONCE, in ONE row. Both are automatically correct everywhere they're used.
UPDATE customers SET email = 'alice.new@mail.com' WHERE id = 1;
UPDATE products SET price = 1150 WHERE name = 'Laptop';
