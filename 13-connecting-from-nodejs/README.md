# 13 - Connecting from Node.js

## Concepts covered
- Connecting to SQLite (better-sqlite3) vs PostgreSQL (node-postgres / pg)
- Connection pooling (why you don't open a new connection per request)
- Parameterized queries from real app code (ties back to folder 11's security lesson)

## Files
- `sqlite-example.js` — works with zero setup
- `postgres-example.js` — requires a running PostgreSQL (see folder 14 for Docker)
- `package.json`

## Run it
```bash
npm install
node sqlite-example.js
# postgres-example.js needs POSTGRES connection details set as env vars first
```
