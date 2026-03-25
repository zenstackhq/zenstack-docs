---
sidebar_position: 4
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import PreviewFeature from '../../_components/PreviewFeature';
import AvailableSince from '../../_components/AvailableSince';

# Extending ORM Client API

<PreviewFeature name="Plugin feature" />

## Introduction

ORM plugins can contribute new methods and properties to the ORM client, as well as introduce new properties to the query arguments of existing query APIs. These capabilities, combined with the lifecycle hooks introduced previously, allow you to implement powerful use cases like caching, soft delete, etc.

## Adding new members to the ORM client

You can add arbitrary methods and properties to the ORM client by including them under the `client` key of the plugin object. Extended member names must be prefixed with `$` so that they don't accidentally shadow model names.

```ts
definePlugin({
  ...
  client: {
    $myNewMethod() { ... },
  }
});
```

If your plugin adds multiple members, it's recommended to group them under one top-level property:

```ts
definePlugin({
  ...
  client: {
    $myPlugin: {
      myMethod() { ... },
      get myProperty() { ... }
    }
  }
});
```

## Extending query args

Extending query args involve providing the following two pieces of information:

**1. What query APIs to add the new property to**

    You have the following granularity options to choose from:

    - Use `$all` to denote all query APIs.
    - Use `$create`, `$read`, `$update`, `$delete` to denote groups of query APIs.
    - Use specific API names like `findUnique`, `deleteMany`, etc.

**2. Compile-time typing and runtime validation for the new property**

    Provide zod schemas (must use zod v4 to avoid version mismatch) that serve both purposes. The schema must be an `ZodObject` and will be merged with ZenStack's built-in query args validation schemas when checking the query args at runtime.

A simple configuration looks like this:

```ts
import { z } from 'zod';

definePlugin({
  queryArgs: {
    // inferred type is `{ myArg?: boolean }`
    $read: z.object({
      myArg: z.boolean().optional(),
    }),
  },
});
```

## Adding fields to query results

<AvailableSince version="v3.5.0" />

You can add extra fields to query results using the `result` key of the plugin object. These fields don't exist in the database — they are computed on-the-fly from other fields in the query result, after rows are fetched from the database.

:::info
This feature is different from [Computed Fields](../computed-fields.md) defined in ZModel. ZModel computed fields are evaluated at the **database level** as part of SQL queries, so they can be used in filters, sorting, and access policies. Plugin result fields, on the other hand, are computed in **application code** after query results are returned — they cannot be used in `where`, `orderBy`, or policy rules, but they can perform arbitrary logic that isn't expressible in SQL.
:::

Each result field definition has two parts:

- **`needs`** — declares which non-relation fields from the model are required to compute the value. These fields are automatically included in the database query even if the user didn't explicitly select them.
- **`compute`** — a function that receives an object containing the needed fields and returns the computed value.

```ts
const myPlugin = definePlugin(schema, {
  id: 'full-name',
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute: (user) => `${user.firstName} ${user.lastName}`,
      },
    },
  },
});

const db = new ZenStackClient(...).$use(myPlugin);

const user = await db.user.findFirst();
console.log(user.fullName); // "John Doe"
```

### How it works with `select` and `omit`

Fields contributed by plugins are included in the query result by default. You can customize this with `select` and `omit` the same way as regular model fields.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="plugins/extend-orm-client.ts" startScript="generate,extend-orm-client" />
