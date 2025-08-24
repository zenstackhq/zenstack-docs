---
sidebar_position: 3
description: how to filter entities
---

import ZenStackVsPrisma from '../../_components/ZenStackVsPrisma';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Filter

Filtering is an important topic because it's involved in many ORM operations, for example when you find records, selecting relations, and updating or deleting multiple records.

## Basic filters

You can filter on scalar fields with values or operators as supported by the field type. The following filter operators are available.

- `equals` `not`: all scalar fields.
- `in` `notIn`: all scalar fields
- `contains` `startsWith` `endsWith`: String fields
- `lt` `lte` `gt` `gte`: String, Int, BigInt, Float, Decimal, and Date fields

A filter object can contain multiple field filters, and they are combined with `AND` semantic. You can also use the `AND`, `OR`, and `NOT` logical operators to combine filter objects to form a complex filter.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="filter/basic.ts" startScript="generate,filter:basic" />

## Relation filters

Filters can be defined on conditions over relations. For one-to-one relations, you can filter on their fields directly. For one-to-many relations, use the "some", "every", or "none" operators to build a condition over a list of records.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="filter/relation.ts" startScript="generate,filter:relation" />

## List filters

List fields allow extra filter operators to filter on the list content:

- `has`: checks if the list contains a specific value.
- `hasEvery`: checks if the list contains all values in a given array.
- `hasSome`: checks if the list contains at least one value in a given array.
- `isEmpty`: checks if the list is empty.

:::info
List type is only supported for PostgreSQL.
:::

```zmodel
model Post {
  ...
  topics String[]
}
```

```ts
await db.post.findMany({ 
  where: { topics: { has: 'webdev' } } 
});

await db.post.findMany({
  where: { topics: { hasSome: ['webdev', 'typescript'] } } 
});

await db.post.findMany({
  where: { topics: { hasEvery: ['webdev', 'typescript'] } } 
});

await db.post.findMany({
  where: { topics: { isEmpty: true } } 
});
```

## Json filters

:::info WORK IN PROGRESS
Filtering on Json fields is work in progress and will be available soon.
:::

## Query builder filters

<ZenStackVsPrisma>
The ability to mix SQL query builder into ORM filters is a major improvement over Prisma.
</ZenStackVsPrisma>

ZenStack v3 is implemented on top of [Kysely](https://kysely.dev/), and it leverages Kysely's powerful query builder API to extend the filtering capabilities. You can use the `$expr` operator to define a boolean expression that can express almost everything that can be expressed in SQL.

The `$expr` operator can be used together with other filter operators, so you can keep most of your filters simple and only reach to the query builder level for complicated components.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="filter/query-builder.ts" startScript="generate,filter:query-builder" />
