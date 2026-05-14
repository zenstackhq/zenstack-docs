---
sidebar_position: 1
description: PostgreSQL full-text search
---

import AvailableSince from '../../../_components/AvailableSince';

# Full-Text Search

<AvailableSince version="3.7.0" />

ZenStack supports [PostgreSQL's full-text search](https://www.postgresql.org/docs/current/textsearch.html) via the `fts` operator on `String` fields. To make a field searchable, mark it with the `@fullText` attribute in your schema:

```zmodel
model Article {
  id       Int     @id @default(autoincrement())
  title    String  @fullText
  body     String  @fullText
  subtitle String? @fullText
  notes    String? // not full-text-searchable
}
```

:::info
Full-text search is only supported by PostgreSQL.
:::

## The `fts` operator

Use the `fts` operator on a `@fullText` field to run a `to_tsquery` search against it. The `search` value is passed directly to Postgres, so you can use the full [tsquery syntax](https://www.postgresql.org/docs/current/datatype-textsearch.html#DATATYPE-TSQUERY) including boolean operators:

- `&` — AND (both terms must match)
- `|` — OR (either term matches)
- `!` — NOT (excludes a term)
- `<->` — FOLLOWED BY (adjacent words, in order)

```ts
// single term
await db.article.findMany({
  where: { title: { fts: { search: 'fox' } } },
});

// AND — requires both terms
await db.article.findMany({
  where: { title: { fts: { search: 'cat & dog' } } },
});

// OR — matches either term
await db.article.findMany({
  where: { title: { fts: { search: 'fox | cat' } } },
});

// NOT — excludes a term
await db.article.findMany({
  where: { title: { fts: { search: 'cat & !lazy' } } },
});

// FOLLOWED BY — adjacent words in order
await db.article.findMany({
  where: { body: { fts: { search: 'quick <-> brown' } } },
});
```

A malformed query string (e.g. `'foo &&'`) surfaces the Postgres `syntax error in tsquery` error verbatim — ZenStack does not pre-validate the search string.

## Text search configuration

The optional `config` field selects the [Postgres text-search configuration](https://www.postgresql.org/docs/current/textsearch-controls.html) used to tokenize and stem both the document and the query — common values are `'english'` (applies stemming, so "run" matches "runs" / "running") and `'simple'` (literal tokens, no stemming).

```ts
// 'english' stems "running" → "run", so a search for 'run' matches "running"
await db.article.findMany({
  where: { body: { fts: { search: 'run', config: 'english' } } },
});

// 'simple' does NOT stem — 'run' won't match 'running'
await db.article.findMany({
  where: { body: { fts: { search: 'run', config: 'simple' } } },
});
```

If `config` is omitted, Postgres falls back to the cluster's `default_text_search_config` setting.

## Sorting with `_ftsRelevance`

You can also use full-text search to sort query results with the special `_ftsRelevance` key in `orderBy`. It compiles to a `ts_rank` expression and accepts:

- `fields` — one or more `@fullText` field names to rank against
- `search` — the tsquery string (uses the same syntax as `fts`)
- `sort` — `'asc'` or `'desc'`
- `config` — optional text-search configuration (same as on `fts`)

```ts
// best match first
await db.article.findMany({
  orderBy: {
    _ftsRelevance: { fields: ['body'], search: 'cat & dog', sort: 'desc' },
  },
});
```

When `fields` contains multiple columns, ZenStack ranks against the concatenated document (via `concat_ws`).

## Recommended database indexes

By default, Postgres has to compute `to_tsvector(...)` for every row on every query, which becomes expensive as the table grows. For production workloads you should add a GIN index on field(s) used for full-text search.

ZenStack does not (yet) emit these indexes from the schema, so add them via a raw SQL migration (using the CLI [`migrate dev --create-only`](../../migration.md#migrate-dev) command). The expression in the index must match the query expression exactly — same text-search configuration, same column list, same `concat_ws` form for multi-field searches.

```sql
-- Single field — matches `where: { title: { fts: { search: 'fox', config: 'english' } } }`
CREATE INDEX article_title_fts_idx
  ON "Article"
  USING GIN (to_tsvector('english', "title"));

-- Multi-field — matches `_ftsRelevance: { fields: ['title', 'body'], config: 'english', ... }`
CREATE INDEX article_title_body_fts_idx
  ON "Article"
  USING GIN (to_tsvector('english', concat_ws(' ', "title", "body")));
```

See the Postgres docs on [creating indexes for full-text search](https://www.postgresql.org/docs/current/textsearch-tables.html#TEXTSEARCH-TABLES-INDEX) for details.
