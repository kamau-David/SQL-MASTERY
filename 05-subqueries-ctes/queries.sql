-- SUBQUERY IN WHERE: find customers whose total orders exceed the overall average
SELECT name FROM customers WHERE id IN (
  SELECT customer_id FROM orders GROUP BY customer_id HAVING SUM(amount) > (
    SELECT AVG(amount) FROM orders
  )
);

-- CORRELATED SUBQUERY: runs ONCE PER outer row (references the outer query) -
-- here, get each customer's largest single order
SELECT name, (
  SELECT MAX(amount) FROM orders WHERE orders.customer_id = customers.id
) AS biggest_order
FROM customers;

-- CTE (WITH clause): same logic as the first query, but far more readable -
-- name the intermediate result, then query it like a normal table
WITH customer_totals AS (
  SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id
)
SELECT customers.name, customer_totals.total
FROM customer_totals
JOIN customers ON customers.id = customer_totals.customer_id
WHERE customer_totals.total > (SELECT AVG(total) FROM customer_totals);

-- RECURSIVE CTE: walks a hierarchy (category -> subcategory -> subsubcategory)
-- Essential for org charts, comment threads, folder structures, category trees.
WITH RECURSIVE category_tree AS (
  -- base case: top-level categories (no parent)
  SELECT id, name, parent_id, 0 AS depth FROM categories WHERE parent_id IS NULL
  UNION ALL
  -- recursive case: find children of what we found so far
  SELECT c.id, c.name, c.parent_id, category_tree.depth + 1
  FROM categories c
  JOIN category_tree ON c.parent_id = category_tree.id
)
SELECT id, name, depth FROM category_tree ORDER BY depth, id;
