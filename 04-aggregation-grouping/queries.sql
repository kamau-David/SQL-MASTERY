-- Aggregate functions collapse many rows into ONE summary value
SELECT COUNT(*) AS total_sales FROM sales;
SELECT SUM(amount) AS total_revenue FROM sales;
SELECT AVG(amount) AS avg_sale FROM sales;
SELECT MIN(amount) AS cheapest, MAX(amount) AS priciest FROM sales;

-- GROUP BY: collapses rows into groups (one row PER unique region here),
-- then applies the aggregate function to EACH group separately
SELECT region, SUM(amount) AS revenue, COUNT(*) AS num_sales
FROM sales
GROUP BY region;

-- Group by multiple columns: one row per unique (region, product) pair
SELECT region, product, SUM(amount) AS revenue
FROM sales
GROUP BY region, product
ORDER BY region, revenue DESC;

-- HAVING vs WHERE: WHERE filters rows BEFORE grouping. HAVING filters
-- GROUPS after aggregation. You cannot use an aggregate function in WHERE.
SELECT region, SUM(amount) AS revenue
FROM sales
GROUP BY region
HAVING SUM(amount) > 1000;

-- Combining both: WHERE narrows the raw rows first, HAVING then filters the groups
SELECT region, COUNT(*) AS mouse_sales
FROM sales
WHERE product = 'Mouse'
GROUP BY region
HAVING COUNT(*) >= 2;
