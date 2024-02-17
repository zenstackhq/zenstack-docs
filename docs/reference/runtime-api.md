---
description: Runtime API references
sidebar_position: 3
sidebar_label: Runtime API
---

# Runtime API Reference

This document provides references for runtime APIs exported from the `@zenstackhq/runtime` package.

### enhance

#### Description

Creates an enhanced wrapper for a `PrismaClient`. The return value has the same APIs as the original `PrismaClient`.

#### Signature

```ts
function enhance<DbClient extends object>(
    prisma: DbClient,
    context?: WithPolicyContext,
    options?: EnhancementOptions
): DbClient;
```

##### Parameter `prisma`

The PrismaClient instance to enhance.

##### Parameter `context`

The context to for evaluating access policies with the following typing.

```ts
type EnhancementContext = {
    user?: Record<string, unknown>
};
```

| Field | Description |
| ----- | ----------- |
| user  | The user object that provides value for the `auth()` function call in access policies. If provided. Its shape should be consistent with the `User` model in your ZModel, with all fields optional except for id field(s). Pass `undefined` to represent an anonymous user, and the `auth()` function call will evaluate to `null` in that case. |

##### Parameter `options`

Options with the following typing.

```ts
type TransactionIsolationLevel =
    | 'ReadUncommitted'
    | 'ReadCommitted'
    | 'RepeatableRead'
    | 'Snapshot'
    | 'Serializable';

type EnhancementOptions = {
    kinds?: EnhancementKind[];
    logPrismaQuery?: boolean;
    errorTransformer?: ErrorTransformer;
    transactionMaxWait?: number;
    transactionTimeout?: number;
    transactionIsolationLevel?: TransactionIsolationLevel;
};
```

| Field                     | Description                                                                                      | Default                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| kinds                     | The kinds of enhancements to apply. By default all enhancements are applied. Supported values: "policy", "password", "omit", "delegate". | All enhancement kinds                                                          |
| logPrismaQuery            | Whether to log queries sent to Prisma client. Log will be emitted with "info" level, so please make sure you [turn that level on](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging#log-to-stdout) when creating Prisma client | false                        |
| errorTransformer          | A function for transforming error thrown by the enhanced `PrismaClient` into a custom one. |                         |
| transactionMaxWait        | The `maxWait` option (in ms) passed to `prisma.$transaction()` call for transactions initiated by ZenStack. |  Database default                       |
| transactionTimeout        | The `timeout` option (in ms) passed to `prisma.$transaction()` call for transactions initiated by ZenStack. |  Database default                       |
| transactionIsolationLevel | The `isolationLevel` option passed to `prisma.$transaction()` call for transactions initiated by ZenStack. |  Database default                       |


#### Example

```ts
const session = getSession();
const enhancedClient = enhance(prisma,
  { user: session.user },
  { kinds: ['policy', 'password']}
);
```
