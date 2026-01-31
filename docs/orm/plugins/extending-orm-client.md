---
sidebar_position: 4
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import PreviewFeature from '../../_components/PreviewFeature';

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

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="plugins/extend-orm-client.ts" startScript="generate,extend-orm-client" />
