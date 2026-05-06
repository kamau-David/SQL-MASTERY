# Why Normalize? A Walkthrough

## 1NF (First Normal Form): atomic values, no repeating groups
Each column holds a single value (not a comma-separated list), and each row is unique.
`bad-schema.sql` actually satisfies 1NF already - the deeper problems start at 2NF/3NF.

## 2NF: no partial dependency on part of a composite key
Every non-key column must depend on the WHOLE primary key, not just part of it.
This mostly matters once you have composite (multi-column) primary keys - not
the focus of `bad-schema.sql`, but relevant once you add junction tables like `order_items`.

## 3NF: no transitive dependency
Non-key columns shouldn't depend on OTHER non-key columns. In `bad-schema.sql`,
`customer_email` and `customer_address` depend on `customer_name`/identity, NOT
directly on the order - that's a transitive dependency, and the tell-tale sign
you need a separate `customers` table.

## The practical payoff
- **No update anomalies**: change a fact once, it's correct everywhere
- **No insertion anomalies**: you can add a product before anyone orders it
- **No deletion anomalies**: deleting an order doesn't accidentally delete the
  only record that a customer exists

## When to break the rules (denormalize on purpose)
Real systems sometimes denormalize deliberately for READ performance (e.g. a
reporting table that duplicates data to avoid expensive joins). That's a valid
tradeoff - but it should be a conscious choice, not the accidental result of
not knowing normalization exists.
