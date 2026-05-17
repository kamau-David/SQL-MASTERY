// node-postgres (the 'pg' package) is the standard PostgreSQL driver for Node.
// Unlike SQLite, Postgres runs as a SEPARATE server process, so every query
// is a real network call - hence everything here is Promise-based/async.
const { Pool } = require("pg");

// A POOL manages a set of reusable connections instead of opening a brand
// new TCP connection for every single query (expensive) or sharing ONE
// connection across all requests (a bottleneck under concurrent load).
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "mydb",
  max: 10, // max simultaneous connections in the pool
});

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, text TEXT)
  `);

  // $1, $2... are Postgres's placeholder syntax (SQLite/MySQL use ?)
  await pool.query("INSERT INTO notes (text) VALUES ($1)", ["Hello from pg"]);

  const result = await pool.query("SELECT * FROM notes");
  console.log("Notes:", result.rows);

  await pool.end(); // release all connections when your app shuts down
}

main().catch((err) => {
  console.error("Connection failed - is PostgreSQL running? See folder 14 for Docker setup.");
  console.error(err.message);
});
