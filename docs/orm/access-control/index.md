---
sidebar_position: 6
---

# Access Control

ZenStack's intuitive schema and type-safe API make it a good choice of ORM, and its built-in access control makes it a great one.

## Overview

Most applications are designed around three interconnected essential aspects: authentication, data query, and access control (aka authorization). We've covered data query in the previous parts, and this part is dedicated to access control and its relation to authentication.

Traditional wisdom considers access control to be "business logic" and thus should be implemented in the service or API layer. On the contrary, ZenStack views it as an integral part of the data model, because most of the time, "business-oriented" rules boil down to "who can CRUD which piece of data". Having them colocated with the data model reduces redundancy, ensures consistency, and improves maintainability. As a result, you have a lower chance of "leaking permissions" when the application grows in complexity.

ZenStack's access control approach is straightforward:

1. You define whitelist or blacklist policies on your models for CRUD operations.
2. When querying data, the engine converts the policies into SQL filters and injects them into the generated queries.

If you're familiar with PostgreSQL's [Row-Level Security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), ZenStack's idea is similar, but as the enforcement happens on the application side, it's database agnostic, doesn't involve schema migrations, and surprisingly, [performs better](https://supabase.com/docs/guides/database/postgres/row-level-security#add-filters-to-every-query) than RLS.
