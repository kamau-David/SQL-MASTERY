-- SELECT * means "all columns" - fine for exploring, avoid in real app code
-- (explicit columns are faster and don't break if the schema changes)
SELECT * FROM books;

-- WHERE filters rows BEFORE they're returned
SELECT title, author FROM books WHERE year > 2010;

-- ORDER BY sorts results. DESC = descending (default is ASC)
SELECT title, price FROM books ORDER BY price DESC;

-- LIMIT caps how many rows come back - essential for pagination
SELECT title FROM books ORDER BY year ASC LIMIT 2;

-- Combining conditions with AND / OR
SELECT title FROM books WHERE year > 2000 AND price < 40;

-- LIKE for pattern matching ('%' = any characters)
SELECT title FROM books WHERE author LIKE '%Martin%';

-- UPDATE changes existing rows - ALWAYS use WHERE, or you'll update EVERY row
UPDATE books SET price = 29.99 WHERE title = 'You Dont Know JS';

-- DELETE removes rows - same warning: no WHERE means the whole table empties
DELETE FROM books WHERE year < 2000;

-- Verify the changes
SELECT * FROM books;
