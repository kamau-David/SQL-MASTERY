-- PostgreSQL functions/stored procedures - SQLite has no equivalent (no
-- procedural language). Run these against a real Postgres instance.

-- FUNCTION: reusable logic that returns a value, callable from within a query
CREATE OR REPLACE FUNCTION get_customer_total(cust_name TEXT)
RETURNS NUMERIC AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT SUM(amount) INTO total FROM orders
  WHERE customer = cust_name AND status = 'completed';
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- Use it just like a built-in function:
-- SELECT get_customer_total('Alice');

-- PROCEDURE (Postgres 11+): unlike a function, a procedure can manage its
-- own transactions (COMMIT/ROLLBACK inside it) and doesn't have to return a value.
CREATE OR REPLACE PROCEDURE apply_discount(order_id INT, percent NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE orders SET amount = amount * (1 - percent / 100.0) WHERE id = order_id;
  COMMIT;
END;
$$;

-- Call it with CALL, not SELECT:
-- CALL apply_discount(1, 10);

-- WHEN TO USE: functions/procedures push logic INTO the database, which can
-- reduce round-trips for complex operations, but also spreads business logic
-- across two languages (SQL + your app code) - many teams deliberately keep
-- logic in the application layer instead and use these sparingly.
