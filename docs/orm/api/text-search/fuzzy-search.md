---
sidebar_position: 2
description: PostgreSQL fuzzy (trigram) search
---

import AvailableSince from '../../../_components/AvailableSince';

# Fuzzy Search

<AvailableSince version="3.7.0" />

ZenStack supports approximate, typo-tolerant string matching via the `fuzzy` operator on `String` fields, backed by PostgreSQL's [`pg_trgm`](https://www.postgresql.org/docs/current/pgtrgm.html) extension. To make a field fuzzy-searchable, mark it with the `@fuzzy` attribute in your schema:

```zmodel
model Flavor {
  id          Int     @id @default(autoincrement())
  name        String? @fuzzy
  description String  @fuzzy
  notes       String? // not fuzzy-searchable
}
```

:::info
Fuzzy search is only supported by PostgreSQL. The `pg_trgm` extension must be enabled in your database, and additionally the `unaccent` extension is required if you use the [`unaccent` option](#unaccented-search):

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent; -- optional
```
:::

## The `fuzzy` operator

Use the `fuzzy` operator on a `@fuzzy` field to perform a trigram-similarity search. It tolerates missing letters, transposed letters, and truncations:

```ts
// finds "Apple" despite a missing letter
await db.flavor.findMany({
  where: { name: { fuzzy: { search: 'Aple' } } },
});

// finds "Apple" with transposed letters
await db.flavor.findMany({
  where: { name: { fuzzy: { search: 'Appel' } } },
});

// finds "Banana" with truncation
await db.flavor.findMany({
  where: { name: { fuzzy: { search: 'Banan' } } },
});
```

The `fuzzy` body accepts the following fields:

- `search` (required) — the query string
- `mode` — `'simple'` (default), `'word'`, or `'strictWord'`
- `threshold` — similarity cutoff in the range `[0, 1]`
- `unaccent` — opt-in accent-insensitive matching (default `false`)

### `mode`

The `mode` option controls how the search string is compared against the field:

- `'simple'` (default) — compares the search term against the whole field value using [`similarity()`](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-FUNCS-OPS). Best for short fields like names.
- `'word'` — approximate substring matching using [`word_similarity()`](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-FUNCS-OPS); finds the search term inside a longer field even when it appears as a fragment.
- `'strictWord'` — like `'word'` but uses [`strict_word_similarity()`](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-FUNCS-OPS), which favors matches at word boundaries, so embedded substrings score lower than standalone words.

```ts
// mode 'word' — finds 'choco' inside 'Éclair au chocolat'
await db.flavor.findMany({
  where: { name: { fuzzy: { mode: 'word', search: 'choco' } } },
});

// mode 'word' — tolerates typos inside a longer description
await db.flavor.findMany({
  where: { description: { fuzzy: { mode: 'word', search: 'pastryy' } } },
});

// mode 'strictWord' — prefers word-boundary matches
await db.flavor.findMany({
  where: { name: { fuzzy: { mode: 'strictWord', search: 'chocolat' } } },
});
```

## Matching threshold

The `threshold` option sets the minimum similarity (strictly greater than) required for a row to match. It accepts a number in `[0, 1]`. Higher values are stricter; lower values are more permissive. When omitted, Postgres's default settings apply.

```ts
// high threshold — only near-exact matches
await db.flavor.findMany({
  where: { name: { fuzzy: { search: 'Apple', threshold: 0.9 } } },
});

// low threshold — much more permissive
await db.flavor.findMany({
  where: { name: { fuzzy: { search: 'App', threshold: 0.05 } } },
});
```

## Unaccented search

By default, fuzzy search is accent-sensitive — searching for `'creme'` will **not** match `'Crème brûlée'`. Set `unaccent: true` to perform an accent-insensitive comparison via Postgres's `unaccent()` function:

```ts
// without unaccent: 'creme' does NOT match accented names
await db.flavor.findMany({
  where: { name: { fuzzy: { search: 'creme' } } },
});

// with unaccent: matches 'Crème brûlée' and 'Crème fraîche'
await db.flavor.findMany({
  where: { name: { fuzzy: { search: 'creme', unaccent: true } } },
});
```

:::info
`unaccent: true` requires the `unaccent` extension to be enabled in your database.
:::

## Sorting with `_fuzzyRelevance`

You can also use trigram similarity to sort query results, with the special `_fuzzyRelevance` key in `orderBy`. It compiles to a `similarity()` (or `word_similarity()` / `strict_word_similarity()`) expression and accepts:

- `fields` — one or more `@fuzzy` field names to rank against
- `search` — the query string
- `sort` — `'asc'` or `'desc'`
- `mode` — optional; same values as on `fuzzy` (defaults to `'simple'`)
- `unaccent` — optional; same as on `fuzzy`

```ts
// best fuzzy match first
await db.flavor.findMany({
  orderBy: {
    _fuzzyRelevance: { fields: ['name'], search: 'Apple', sort: 'desc' },
  },
});
```

When multiple fields are specified, ZenStack ranks against the best-matching field (via `GREATEST(similarity(...), similarity(...))`).

## Recommended database indexes

Without an index, Postgres has to compute trigram similarity for every row on every query, which becomes expensive as the table grows. For production workloads, add a GIN index using the `gin_trgm_ops` operator class on each `@fuzzy` column.

ZenStack does not (yet) emit these indexes from the schema, so add them via a raw SQL migration (using the CLI [`migrate dev --create-only`](../../migration.md#migrate-dev) command).

```sql
-- accent-sensitive fuzzy search (default)
CREATE INDEX flavor_name_trgm_idx
  ON "Flavor"
  USING GIN ("name" gin_trgm_ops);

-- if you use `unaccent: true`, index the unaccent() expression
-- so Postgres can still use the index
CREATE INDEX flavor_name_unaccent_trgm_idx
  ON "Flavor"
  USING GIN (unaccent("name") gin_trgm_ops);
```

See the Postgres docs on [`pg_trgm` indexes](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-INDEX) for details.
