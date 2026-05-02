-- INNER JOIN: only returns rows where the join condition matches on BOTH sides.
-- Charlie (no orders) disappears entirely from this result.
SELECT customers.name, orders.item
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;

-- LEFT JOIN: returns ALL rows from the left table (customers), filling in
-- NULL for columns from the right table when there's no match. Charlie
-- appears here with NULL for item - useful for "find customers with no orders."
SELECT customers.name, orders.item
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;

-- Using LEFT JOIN + WHERE IS NULL to find exactly that: customers with zero orders
SELECT customers.name
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
WHERE orders.id IS NULL;

-- SQLite has no RIGHT JOIN - swap table order in a LEFT JOIN to get the
-- equivalent result (Postgres/MySQL support RIGHT JOIN directly)
SELECT customers.name, orders.item
FROM orders
LEFT JOIN customers ON customers.id = orders.customer_id;

-- SELF JOIN: joining employees to itself to look up each person's manager NAME
-- (the raw table only stores manager_id, a number, not the manager's name)
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
