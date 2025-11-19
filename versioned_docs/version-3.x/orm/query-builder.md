---
sidebar_position: 5
description: Query Builder API
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Query Builder API

<ZenStackVsPrisma>
Query builder API is a major feature that sets ZenStack apart from Prisma.
</ZenStackVsPrisma>

The [Query API](./api/) introduced in the previous sections provide a powerful and intuitive way to query databases. However, complex applications usually have use cases that outgrow its capabilities. For typical ORMs, this is where you leave the comfort zone and resort to writing SQL.

The unique advantage of ZenStack is that it's built above [Kysely](https://kysely.dev) - a highly popular, well-designed and type-safe SQL query builder. This means we can easily expose the full power of Kysely to you as a much better alternative to writing raw SQL.

No extra setup is needed to use the query builder API. The ORM client has a `$qb` property that provides the Kysely query builder, and it's typing is inferred from the ZModel schema.

Besides building full queries, the query builder API can also be embedded inside the ORM query API with a `$expr` key inside a `where` clause. See [Filter](./api/filter.md) section for details.

## Samples

The samples assume you have a basic understanding of Kysely.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="query-builder.ts" startScript="generate,query-builder" />
