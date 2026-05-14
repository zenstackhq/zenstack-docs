---
sidebar_position: 2
---

import PackageInstall from '../../_components/PackageInstall';
import AvailableSince from '../../_components/AvailableSince';
import PreviewFeature from '../../_components/PreviewFeature';

# Fetch Client

<AvailableSince version="3.7.0" />

<PreviewFeature name="Fetch Client" />

## Overview

`@zenstackhq/fetch-client` is a lightweight, framework-agnostic client for consuming ZenStack's [RPC-style](../api-handler/rpc.md) auto CRUD API. It exposes a fully typed object that mirrors the ORM's `ZenStackClient` API, but every call is dispatched as an HTTP request via the global `fetch` (or a custom one you provide).

Use it when you want strongly typed CRUD access from any JavaScript runtime — a non-React/Vue/Svelte UI, a Node.js script, a worker, etc. — without pulling in a data-fetching library.

:::info
The fetch client only works with the [RPC-style API](../api-handler/rpc.md).
:::

## Installation

<PackageInstall dependencies={['@zenstackhq/fetch-client']} />

## Creating a Client

Call `createClient` with your schema and an `endpoint`:

```ts
import { createClient } from '@zenstackhq/fetch-client';
import { schema } from '~/zenstack/schema-lite';

const client = createClient(schema, {
  endpoint: 'https://example.com/api/model',
});

const users = await client.user.findMany({ include: { posts: true } });
const post = await client.post.create({ data: { title: 'Hello' } });
```

Like with the [TanStack Query](./tanstack-query) integration, you can pass the `--lite` flag to `zen generate` to produce a `schema-lite.ts` that strips sensitive content (e.g., access policies) from the schema object, so it's safe to import into client-side code. See the [CLI Reference](../../reference/cli.md#generate) for details.

### Options

- `endpoint` (required)

    The base URL of the RPC API. **Must be a fully qualified URL** (e.g., `https://example.com/api/model`).

- `fetch`

    A custom fetch function to use instead of the global `fetch`. Useful for attaching authentication headers, instrumenting requests, or routing through a proxy.

    ```ts
    import { createClient, type FetchFn } from '@zenstackhq/fetch-client';

    const myFetch: FetchFn = (url, init) => {
      const headers = { ...init?.headers, authorization: `Bearer ${getToken()}` };
      return fetch(url, { ...init, headers });
    };

    const client = createClient(schema, {
      endpoint: 'https://example.com/api/model',
      fetch: myFetch,
    });
    ```

## Custom Procedures

If your schema defines [custom procedures](../../modeling/custom-proc.md), they are exposed under the `$procs` accessor. Query procedures get a `query` method (issues a `GET`); mutation procedures get a `mutate` method (issues a `POST`):

```ts
// Query procedure
const stats = await client.$procs.getStats.query();

// Mutation procedure
await client.$procs.sendNotification.mutate({ args: { message: 'hello' } });
```

## Sequential Transactions

`$transaction` lets you execute multiple operations atomically in a single request. It mirrors the [sequential transaction](../../orm/api/transaction.md#sequential-transaction) overload on the ORM — all operations are sent together and executed in order; if any fails, the whole transaction is rolled back.

Each operation is `{ model, op, args }`, where `model` is the PascalCase model name, `op` is the operation name (`create`, `findMany`, etc.), and `args` matches the corresponding ORM call. `args` can be omitted for operations whose args are entirely optional (e.g., `findMany`, `count`, `deleteMany`).

```ts
const [user, post] = await client.$transaction([
  { model: 'User', op: 'create', args: { data: { email: 'alice@example.com' } } },
  { model: 'Post', op: 'create', args: { data: { title: 'Hello' } } },
]);
```

The result tuple is typed per-position based on each operation's return type:

```ts
const results = await client.$transaction([
  { model: 'User', op: 'create', args: { data: { email: 'a@b.com' } } },
  { model: 'User', op: 'findMany' },
  { model: 'User', op: 'count' },
]);

results[0].email;   // User
results[1][0]?.id;  // User[]
results[2];         // number
```

:::info
Only sequential transactions are supported on the client. Interactive transactions are intentionally not exposed, since holding a database transaction open across multiple network round-trips would be harmful to server scalability.
:::

## Respecting ORM Client Customization

By default, `createClient(schema, ...)` gives you typed accessors for all models and all CRUD operations, with result types derived from the schema. If your server-side ORM client is customized — with [slicing](../../orm/advanced/slicing.md), [field omission](../../orm/api/omit.md), or [plugin-contributed result fields](../../orm/plugins/extending-orm-client.md#adding-fields-to-query-results) — the fetch client's types won't automatically reflect those customizations.

To keep them in sync, pass the **client type** as a generic parameter:

```ts
import { createClient } from '@zenstackhq/fetch-client';
import { schema } from '~/zenstack/schema-lite';

// Type-only import of your server-side client
import type { DbType } from '~/server/db';

const client = createClient<DbType>(schema, {
  endpoint: 'https://example.com/api/model',
});
```

With the generic in place, slicing trims unavailable models and operations from the client's type, omitted fields are removed from result types, and plugin-contributed fields appear in result types. The runtime behavior itself happens on the server — the generic is purely for type alignment.
