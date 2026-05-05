-- BAD: everything crammed into one table. Looks simple, but has real problems.
DROP TABLE IF EXISTS orders_bad;
CREATE TABLE orders_bad (
  id INTEGER PRIMARY KEY,
  customer_name TEXT,
  customer_email TEXT,
  customer_address TEXT,
  product_name TEXT,
  product_price REAL,
  quantity INTEGER
);

-- Problem 1: if "Alice" orders 3 different products, her name/email/address
-- get repeated 3 times - if she changes her email, you must update 3 rows
-- (miss one, and now her data is INCONSISTENT across her own orders).
INSERT INTO orders_bad VALUES
  (1, 'Alice', 'alice@mail.com', 'Nairobi', 'Laptop', 1200, 1),
  (2, 'Alice', 'alice@mail.com', 'Nairobi', 'Mouse', 20, 2),
  (3, 'Alice', 'alice@mail.com', 'Nairobi', 'Keyboard', 45, 1);

-- Problem 2: if the Laptop's price changes, you'd need to update it
-- everywhere it appears - the price isn't a single source of truth.
