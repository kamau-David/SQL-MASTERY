# 07 - Indexes & Performance

## Concepts covered
- How an index works (like a book's index vs reading every page)
- Creating indexes, and measuring the difference with EXPLAIN QUERY PLAN
- When indexes HURT (write-heavy tables, low-cardinality columns)

## Files
- `run.js` — builds a 100k-row table, times a query with and without an index

## Run it
```bash
npm install
node run.js
```
