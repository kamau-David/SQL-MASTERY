# PostgreSQL Backup & Restore Commands

## Full database dump
```bash
pg_dump -U postgres -h localhost -d mydb -F c -f mydb_backup.dump
```
- `-F c` = custom format (compressed, supports selective restore)

## Restore from a dump
```bash
pg_restore -U postgres -h localhost -d mydb --clean mydb_backup.dump
```
- `--clean` drops existing objects before recreating them

## Plain SQL dump (human-readable, good for version control of schema)
```bash
pg_dump -U postgres -h localhost -d mydb --schema-only -f schema.sql
```

## Automated daily backups (cron example)
```bash
0 2 * * * pg_dump -U postgres -d mydb -F c -f /backups/mydb_$(date +\%Y\%m\%d).dump
```

## Disaster recovery basics
- Test your restores regularly - a backup you've never restored is not a
  verified backup.
- Keep backups in a DIFFERENT location than the database server itself.
- For zero-downtime production systems, look into PostgreSQL's Write-Ahead
  Log (WAL) archiving and point-in-time recovery (PITR), which allow
  restoring to any specific moment, not just the last full dump.
