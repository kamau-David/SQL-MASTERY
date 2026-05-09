const Database = require("better-sqlite3");
const db = new Database(":memory:");

db.exec(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    updated_at TEXT
  );

  CREATE TABLE price_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    old_price REAL,
    new_price REAL,
    changed_at TEXT
  );
`);

// TRIGGER: runs AUTOMATICALLY whenever a matching event happens - your
// application code doesn't need to remember to do this manually every time.
db.exec(`
  CREATE TRIGGER update_timestamp
  AFTER UPDATE ON products
  BEGIN
    UPDATE products SET updated_at = datetime('now') WHERE id = NEW.id;
  END;
`);

db.exec(`
  CREATE TRIGGER log_price_change
  AFTER UPDATE OF price ON products
  WHEN OLD.price != NEW.price
  BEGIN
    INSERT INTO price_audit (product_id, old_price, new_price, changed_at)
    VALUES (OLD.id, OLD.price, NEW.price, datetime('now'));
  END;
`);

db.prepare("INSERT INTO products (name, price) VALUES (?, ?)").run("Laptop", 1200);
console.log("Initial product:", db.prepare("SELECT * FROM products").all());

console.log("\nUpdating price - triggers fire automatically...");
db.prepare("UPDATE products SET price = ? WHERE name = ?").run(1100, "Laptop");

console.log("\nProduct now has an auto-updated timestamp:");
console.table(db.prepare("SELECT * FROM products").all());

console.log("\nAn audit row was created automatically - the app code never");
console.log("explicitly wrote to price_audit, the trigger did it:");
console.table(db.prepare("SELECT * FROM price_audit").all());

console.log("\nCAUTION: triggers are 'invisible' logic - powerful, but they can");
console.log("make debugging harder since behavior isn't visible in your app code.");
console.log("Use them for cross-cutting concerns (audit trails, timestamps),");
console.log("not core business logic that developers need to see and reason about.");
