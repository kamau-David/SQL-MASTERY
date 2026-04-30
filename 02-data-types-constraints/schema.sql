DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,        -- UNIQUE: no two customers share an email
  name TEXT NOT NULL,                -- NOT NULL: every customer must have a name
  age INTEGER CHECK (age >= 18),     -- CHECK: enforces a business rule at the DB level
  created_at TEXT DEFAULT (datetime('now'))  -- DEFAULT: auto-filled if not provided
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  total REAL NOT NULL CHECK (total >= 0),
  status TEXT DEFAULT 'pending',
  -- FOREIGN KEY: this order MUST reference a real customer - the database
  -- refuses to create an "orphan" order pointing at a non-existent customer
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
