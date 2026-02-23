---
sidebar_position: 3
description: how to filter entities
---

import ZenStackVsPrisma from '../../_components/ZenStackVsPrisma';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import PreviewFeature from '../../_components/PreviewFeature';

# Filter

Filtering is an important topic because it's involved in many ORM operations, for example when you find records, selecting relations, and updating or deleting multiple records.

## Basic filters

You can filter on scalar fields with values or operators as supported by the field type. The following filter operators are available.

- `equals` `not`: all scalar fields
- `in` `notIn`: all scalar fields
- `contains` `startsWith` `endsWith`: `String` fields
- `lt` `lte` `gt` `gte` `between`: `String`, `Int`, `BigInt`, `Float`, `Decimal`, and `Date` fields

A filter object can contain multiple field filters, and they are combined with `AND` semantic. You can also use the `AND`, `OR`, and `NOT` logical operators to combine filter objects to form a complex filter.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="filter/basic.ts" startScript="generate,filter:basic" />

## List filters

List fields allow extra filter operators to filter on the list content:

- `has`: checks if the list contains a specific value.
- `hasEvery`: checks if the list contains all values in a given array.
- `hasSome`: checks if the list contains at least one value in a given array.
- `isEmpty`: checks if the list is empty.

:::info
List type is only supported by PostgreSQL.
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

<PreviewFeature name="Json filter" />

The query API supports flexible filtering on `Json` fields and allows you to reach into nested structures in the JSON data.

### Generic Json filters

Generic Json filters doesn't assume a predefined structure of the JSON data, and allows you to use JSON path to specify the location of the data you want to filter on. Such filters can be used on both plain `Json` and [Typed Json](../../modeling/typed-json) fields. The following fields can be used in the filter body (all fields are optional):

- `path`

    [JSON Path](https://datatracker.ietf.org/doc/rfc9535/) string for selecting data to filter on. If not provided, the root of the JSON data is used.

    <ZenStackVsPrisma>
    While for Prisma the "path" field's format depends on the database type, ZenStack unified it to a JSON path string.
    </ZenStackVsPrisma>

- `equals`

    Checks if the selected data equals the given value. The value can be primitive types, arrays, or objects.

- `not`

    Checks if the selected data does not equal the given value. The value can be primitive types, arrays, or objects.

- `string_contains`, `string_starts_with`, `string_ends_with`

    String matching operators. If the selected data is not a string, the filter evaluates to false.

- `mode`

    Specifies if the string matching should be case sensitive or insensitive. Possible values are "default" (use default database behavior) and "insensitive" (case insensitive). Default is "default". Case insensitive matching is only supported on databases that support it natively (e.g., PostgreSQL).

- `array_contains`, `array_starts_with`, `array_ends_with`

    Array matching operators. If the selected data is not an array, the filter evaluates to false.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="filter/json.ts" startScript="generate,filter:json" />

### Typed Json filters

[Strongly Typed Json](../../modeling/typed-json) fields, with their structure well defined in the schema, allow for a more convenient way to filter. Instead of using JSON path, you can directly use fields to build-up the filter, similar to how you would filter with relations.

:::tip
You can still use generic Json filters on Typed Json fields if needed.
:::

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm-typed-json" openFile="filter.ts" startScript="generate,filter" />

## Relation filters

Filters can be defined on conditions over relations. For one-to-one relations, you can filter on their fields directly. For one-to-many relations, use the "some", "every", or "none" operators to build a condition over a list of records.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="filter/relation.ts" startScript="generate,filter:relation" />

## Query builder filters

<ZenStackVsPrisma>
The ability to mix SQL query builder into ORM filters is a major improvement over Prisma.
</ZenStackVsPrisma>

ZenStack v3 is implemented on top of [Kysely](https://kysely.dev/), and it leverages Kysely's powerful query builder API to extend the filtering capabilities. You can use the `$expr` operator to define a boolean expression that can express almost everything that can be expressed in SQL.

The `$expr` operator can be used together with other filter operators, so you can keep most of your filters simple and only reach down to the query builder level for complicated components.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="filter/query-builder.ts" startScript="generate,filter:query-builder" />
