# 15 - Scaling, Replication & Advanced Concepts

## Concepts covered (conceptual + diagrams-in-comments, since these need real infra)
- Connection pooling recap and why it matters at scale
- Read replicas: splitting read traffic off the primary database
- Sharding: splitting data ACROSS multiple databases
- Caching layer (Redis) in front of the database

## Files
- `CONCEPTS.md` — the core ideas, explained with concrete examples
- `pooling-under-load.js` — demonstrates why pool size matters under concurrent load
