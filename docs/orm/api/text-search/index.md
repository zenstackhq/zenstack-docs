---
description: Full-text and fuzzy text search
sidebar_position: 10
---

# Text Search

Beyond exact matching and the `LIKE`-style `contains` / `startsWith` / `endsWith` [filters](../filter.md#basic-filters), ZenStack ships with two text-search features for richer querying over `String` fields:

- **[Full-Text Search](./full-text-search.md)** — language-aware, tokenized search powered by [PostgreSQL's full-text search](https://www.postgresql.org/docs/current/textsearch.html).
- **[Fuzzy Search](./fuzzy-search.md)** — approximate, typo-tolerant matching powered by the [`pg_trgm`](https://www.postgresql.org/docs/current/pgtrgm.html) trigram-similarity extension.

:::info
Both features are only supported by PostgreSQL for now.
:::

## Which one should I use?

The two features solve different problems. Choosing the right one depends on the kind of text you're searching and what counts as "a match" for your use case.

### Full-text search

Full-text search tokenizes text into *lexemes*, applies language-aware stemming and stop-word removal, and matches against structured queries. Reach for it when:

- You're searching **natural-language content** — article bodies, descriptions, comments, documentation.
- You want **stemming**, so that "running" matches "run", "mice" matches "mouse", etc.
- You want results ranked by **relevance** to a multi-term query.
- The search terms are **whole words**, correctly spelled.

Full-text search does *not* tolerate typos — a misspelled term simply won't match.

### Fuzzy search

Fuzzy search compares strings by **trigram similarity** (overlapping three-character sequences), so it matches even when the input and the stored value don't line up exactly. Reach for it when:

- You're searching **short, identifier-like fields** — names, titles, tags, product labels, cities.
- The input may contain **typos** — missing, transposed, or extra letters.
- You want **approximate substring** matching — finding a fragment inside a longer value.
- You're building **autocomplete** or "did you mean…" experiences.
- You want results ranked by **closeness** to the input string.

Fuzzy search is purely character-based — it has no notion of language, word meaning, or stemming.

### At a glance

|                                       | Full-text search           | Fuzzy search                   |
| ------------------------------------- | -------------------------- | ------------------------------ |
| Backed by                             | `to_tsvector` / `to_tsquery` | `pg_trgm` extension          |
| Schema attribute                      | `@fullText`                | `@fuzzy`                       |
| Filter operator                       | `fts`                      | `fuzzy`                        |
| Relevance sorting key                 | `_ftsRelevance`            | `_fuzzyRelevance`              |
| Best for                              | natural-language text      | short, identifier-like fields  |
| Typo tolerance                        | ✗                          | ✓                              |
| Language-aware (stemming, stop words) | ✓                          | ✗                              |
