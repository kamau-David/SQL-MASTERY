const Database = require("better-sqlite3");
const db = new Database(":memory:");

db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, is_admin INTEGER);
  INSERT INTO users VALUES (1, 'david', 'hashed_pw_123', 0);
  INSERT INTO users VALUES (2, 'admin', 'super_secret_hash', 1);
`);

console.log("--- VULNERABLE: building SQL with string concatenation ---");
function vulnerableLogin(username, password) {
  // NEVER DO THIS - directly inserting user input into a SQL string
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log("Actual query executed:", query);
  return db.prepare(query).all();
}

console.log("\nNormal login attempt:");
console.log(vulnerableLogin("david", "hashed_pw_123"));

console.log("\nMALICIOUS input - the classic comment-based bypass attack:");
// Using just ' OR '1'='1 without a comment does NOT reliably bypass a query
// that ANDs in a password check, because AND binds tighter than OR in SQL:
//   username = '' OR '1'='1' AND password = 'anything'
// is evaluated as: username = '' OR ('1'='1' AND password = 'anything')
// which is FALSE unless the real password matches too. The classic real-world
// attack instead comments out the rest of the query with -- :
const maliciousUsername = "admin' -- ";
const result = vulnerableLogin(maliciousUsername, "anything");
console.log("Result: attacker got the admin user back with zero valid credentials:");
console.log(result);
// WHY: everything after -- is treated as a SQL comment, so the actual query
// becomes: SELECT * FROM users WHERE username = 'admin' -- ' AND password = 'anything'
// The password check is entirely commented out.

console.log("\n\n--- FIXED: parameterized queries ---");
function safeLogin(username, password) {
  // The ? placeholders are filled in by the DRIVER, not string concatenation.
  // User input is NEVER interpreted as SQL syntax, no matter what it contains.
  return db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").all(username, password);
}

console.log("\nSame malicious input against the SAFE version:");
const safeResult = safeLogin(maliciousUsername, "anything");
console.log("Result: empty - the attack completely fails:", safeResult);

console.log("\n--- RULE ---");
console.log("ALWAYS use parameterized queries / prepared statements for ANY");
console.log("value that came from user input - forms, URL params, headers,");
console.log("even values from your own API that originated from a client.");
console.log("This applies identically in Postgres (pg library), MySQL, etc.");
console.log("\nOther defenses worth knowing:");
console.log("- Least privilege: your app's DB user should NOT be a superuser -");
console.log("  it should only have permissions for the tables/operations it needs.");
console.log("- Never expose raw DB error messages to end users (can leak schema info).");
