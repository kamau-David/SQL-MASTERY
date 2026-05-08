const Database = require("better-sqlite3");
const db = new Database(":memory:");

db.exec(`
  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount REAL, status TEXT);
  INSERT INTO orders VALUES
    (1, 'Alice', 100, 'completed'),
    (2, 'Bob', 250, 'completed'),
    (3, 'Alice', 50, 'pending'),
    (4, 'Charlie', 300, 'cancelled');
`);

// A VIEW is a saved SELECT statement - it doesn't store data itself, it
// just runs the underlying query fresh every time you query the view.
// Useful for: hiding complexity, enforcing consistent business logic
// (e.g. "completed orders" defined in exactly ONE place), and permissions
// (grant access to a view without exposing the full underlying table).
db.exec(`
  CREATE VIEW completed_orders AS
  SELECT customer, amount FROM orders WHERE status = 'completed';
`);

console.log("Querying the view like a normal table:");
console.table(db.prepare("SELECT * FROM completed_orders").all());

db.exec(`
  CREATE VIEW customer_totals AS
  SELECT customer, SUM(amount) AS total_completed
  FROM orders
  WHERE status = 'completed'
  GROUP BY customer;
`);

console.log("\nA view can encapsulate aggregation too:");
console.table(db.prepare("SELECT * FROM customer_totals").all());

console.log("\nIMPORTANT: if the underlying 'orders' table changes, the view");
console.log("reflects it immediately - it's not a stale snapshot, it re-runs");
console.log("the query every time you SELECT from it.");
db.exec("UPDATE orders SET status = 'completed' WHERE id = 3");
console.log("\nAfter marking Alice's pending order as completed:");
console.table(db.prepare("SELECT * FROM customer_totals").all());
