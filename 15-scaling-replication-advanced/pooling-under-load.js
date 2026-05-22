// Simulates many concurrent "requests" hitting the database, showing why
// pool size is a real tuning knob, not just a number you set and forget.
const Database = require("better-sqlite3");
const db = new Database(":memory:");
db.exec(`CREATE TABLE items (id INTEGER PRIMARY KEY, value TEXT)`);

// Note: better-sqlite3 is synchronous/single-connection by nature, so this
// demo simulates the CONCEPT of concurrent load and queuing rather than
// literally exercising a connection pool (that's better shown against real
// Postgres with the 'pg' Pool from folder 13 under real concurrent traffic).

function simulateSlowQuery(id) {
  const start = Date.now();
  // Simulate a query that takes some time (e.g. a complex join)
  for (let i = 0; i < 1_000_000; i++) {} // busy-wait to simulate work
  db.prepare("INSERT INTO items (value) VALUES (?)").run(`item-${id}`);
  return Date.now() - start;
}

console.log("Simulating 20 'concurrent' requests hitting the database...");
const durations = [];
for (let i = 0; i < 20; i++) {
  durations.push(simulateSlowQuery(i));
}
console.log(`Average per-request time: ${(durations.reduce((a, b) => a + b) / durations.length).toFixed(2)}ms`);
console.log("\nIn a REAL system with a connection pool sized too small, requests");
console.log("beyond the pool's capacity QUEUE UP waiting for a free connection -");
console.log("this shows up as rising response times under load, even though the");
console.log("database itself isn't necessarily overloaded. Monitor pool wait");
console.log("time as a metric, not just query time.");
