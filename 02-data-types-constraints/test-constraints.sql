-- This works fine
INSERT INTO customers (email, name, age) VALUES ('david@example.com', 'David', 25);

-- This FAILS: duplicate email (UNIQUE constraint)
INSERT INTO customers (email, name, age) VALUES ('david@example.com', 'David Two', 30);

-- This FAILS: age below 18 (CHECK constraint)
INSERT INTO customers (email, name, age) VALUES ('young@example.com', 'Young Person', 15);

-- This FAILS: name is required (NOT NULL constraint)
INSERT INTO customers (email, age) VALUES ('noname@example.com', 22);

-- This FAILS: customer_id 999 doesn't exist (FOREIGN KEY constraint)
INSERT INTO orders (customer_id, total) VALUES (999, 50.00);

-- This works: references the real customer created above (id 1)
INSERT INTO orders (customer_id, total) VALUES (1, 50.00);
