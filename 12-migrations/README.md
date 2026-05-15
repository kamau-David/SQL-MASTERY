# 12 - Migrations

## Concepts covered
- Why raw manual schema edits break teams (everyone's DB drifts out of sync)
- Versioned migrations: numbered, ordered, reproducible schema changes
- Up/down migrations (apply and rollback)

## Files
- `migrations/001_create_users.js`
- `migrations/002_add_users_age.js`
- `migrations/003_create_posts.js`
- `migrate.js` — a minimal migration runner that tracks applied migrations

## Run it
```bash
npm install
node migrate.js up      # apply all pending migrations
node migrate.js down    # roll back the most recent one
```
