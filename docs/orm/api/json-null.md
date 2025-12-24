---
sidebar_position: 11
description: JSON Value
---

# Json Null Values

When working with JSON fields, care needs to be taken to distinguish between two types of nulls:

- Column value not set (database-level NULL)
- JSON `null` value

When creating or updating records, use the following global values (instead of JavaScript `null`) for different intentions:

- `DbNull` - sets the column value to database NULL
- `JsonNull` - sets the column value to JSON `null`

```ts
import { DbNull, JsonNull } from '@zenstackhq/orm';

// sets jsonField to database NULL, only valid if `jsonField` is optional
await db.foo.create({ data: { jsonField: DbNull } });

// sets jsonField to JSON null
await db.foo.create({ data: { jsonField: JsonNull } });
```

When filtering with JSON fields, use the following global values to match different nulls:

- `DbNull` - matches database NULL
- `JsonNull` - matches JSON `null`
- `AnyNull` - matches either database NULL or JSON `null`

```ts
import { DbNull, JsonNull, AnyNull } from '@zenstackhq/orm';

// find records where jsonField is database NULL
await db.foo.findMany({ where: { jsonField: DbNull } });

// find records where jsonField is JSON null
await db.foo.findMany({ where: { jsonField: JsonNull } });

// find records where jsonField is either database NULL or JSON null
await db.foo.findMany({ where: { jsonField: AnyNull } });
```

The query results will return JavaScript `null` for both database NULL and JSON `null` values.
