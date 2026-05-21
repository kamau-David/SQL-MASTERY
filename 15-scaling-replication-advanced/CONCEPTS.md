# Scaling a Relational Database - Core Concepts

## 1. Read Replicas
As traffic grows, most apps read far more than they write (browsing >> checkout).
A **read replica** is a live copy of your primary database that only serves
reads. Your app routes:
- Writes -> primary database
- Reads -> one or more replicas

Tradeoff: replicas usually lag behind the primary by a small amount
("replication lag"), so a replica read right after a write might not see
that write yet. Design around this (e.g. read-your-own-writes from the
primary right after a write, then switch to replicas afterward).

## 2. Sharding
When ONE database server can't hold all your data or handle all your
traffic even with replicas, you split data ACROSS multiple database servers
("shards") - e.g. users A-M on shard 1, N-Z on shard 2. This solves scale
but adds real complexity: cross-shard queries and joins become hard or
impossible, and you need a strategy for choosing which shard new data
goes to (a "shard key").

Most teams should exhaust simpler options (indexing, read replicas,
caching, better queries, vertical scaling/bigger hardware) LONG before
reaching for sharding - it's a genuinely complex operational commitment.

## 3. Caching (e.g. Redis) in front of the database
For data that's read often and changes rarely (e.g. a product catalog),
put a cache in front of the database:
```
Request -> Check Redis cache -> if HIT, return cached data (fast, no DB hit)
                              -> if MISS, query DB, store result in cache, return it
```
The hard part isn't the caching itself, it's CACHE INVALIDATION - making
sure the cache doesn't serve stale data after the underlying row changes.

## 4. Connection Pooling at Scale
Every open database connection uses real server memory. With many app server
instances each running their own naive connection pool, you can accidentally
exhaust the database's max connection limit. Solutions:
- Keep individual pool sizes modest (folder 13's pool used `max: 10`)
- Use an external connection pooler (e.g. PgBouncer) that sits between your
  many app instances and the database, multiplexing many app connections
  onto fewer real database connections.

## 5. Vertical vs Horizontal Scaling
- **Vertical**: bigger server (more CPU/RAM) - simple, but has a hard ceiling
  and doesn't help with availability (still one server = one point of failure)
- **Horizontal**: more servers (replicas, shards) - more complex, but scales
  further and can improve availability

For a project at your current stage (KES Tracker, Dr. Marurui Pharmacy),
you're nowhere near needing sharding - a well-indexed single Postgres/Supabase
instance with maybe a read replica later will comfortably handle a lot of
real-world traffic. These concepts matter more once you're operating at a
much larger scale.
