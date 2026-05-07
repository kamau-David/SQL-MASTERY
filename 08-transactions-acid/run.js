const Database = require("better-sqlite3");
const db = new Database(":memory:");

db.exec(`
  CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance REAL);
  INSERT INTO accounts VALUES (1, 'Alice', 100), (2, 'Bob', 50);
`);

console.log("--- ATOMICITY: a transfer is TWO operations that must BOTH succeed ---");
// A money transfer = subtract from one account + add to another. If your
// app crashes between these two steps WITHOUT a transaction, money can
// vanish (subtracted but never added) or duplicate. A transaction makes
// both operations ATOMIC: they either BOTH happen, or NEITHER does.
function transfer(fromId, toId, amount) {
  const tx = db.transaction((fromId, toId, amount) => {
    const from = db.prepare("SELECT balance FROM accounts WHERE id = ?").get(fromId);
    if (from.balance < amount) {
      throw new Error("Insufficient funds - transaction will ROLL BACK entirely");
    }
    db.prepare("UPDATE accounts SET balance = balance - ? WHERE id = ?").run(amount, fromId);
    db.prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?").run(amount, toId);
  });
  tx(fromId, toId, amount);
}

console.log("Before:", db.prepare("SELECT * FROM accounts").all());
transfer(1, 2, 30);
console.log("After successful $30 transfer:", db.prepare("SELECT * FROM accounts").all());

try {
  transfer(1, 2, 10000); // more than Alice has
} catch (err) {
  console.log("\nTransfer failed as expected:", err.message);
}
// CRUCIAL: because it was wrapped in db.transaction(), the failed attempt
// changed NOTHING - not even the first UPDATE that technically ran before
// the check failed. better-sqlite3's transaction() wrapper auto-rolls-back
// on any thrown error.
console.log("After FAILED transfer (unchanged, proving rollback worked):", db.prepare("SELECT * FROM accounts").all());

console.log("\n--- Manual BEGIN/COMMIT/ROLLBACK (what's happening under the hood) ---");
db.exec("BEGIN");
db.exec("UPDATE accounts SET balance = balance + 1000 WHERE id = 1");
console.log("Mid-transaction (uncommitted) balance:", db.prepare("SELECT balance FROM accounts WHERE id=1").get());
db.exec("ROLLBACK"); // undo everything since BEGIN
console.log("After ROLLBACK, balance is back to normal:", db.prepare("SELECT balance FROM accounts WHERE id=1").get());

console.log("\n--- ISOLATION (conceptual) ---");
console.log("Isolation controls whether one transaction can see another's");
console.log("uncommitted changes. Real databases offer levels like READ");
console.log("COMMITTED, REPEATABLE READ, SERIALIZABLE - stricter levels prevent");
console.log("more anomalies (dirty reads, non-repeatable reads) at the cost of");
console.log("more locking/contention. SQLite is simpler (single-writer at a time);");
console.log("PostgreSQL lets you choose the isolation level per transaction:");
console.log("  BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;");
