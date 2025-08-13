---
sidebar_position: 1
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';

# Query API Hooks

## Introduction

Query API hooks allow you to intercept ORM queries, like `create`, `findUnique`, etc. You can execute arbitrary code before or after the query operation, modify query args, or even block the operation altogether.

To create a query API hook plugin, call the `$use` method with an object containing the `onQuery` key. The `onQuery` object allows you to define hooks in a per-model and per-operation manner. You can also use the special `$allModels` and `$allOperations` keys to apply hooks to all models or operations, respectively.

At the operation level, you provide a callback function that receives a context object containing:
- The model
- The operation
- The query args
- The ORM client that triggered the query
- A "proceed query" function, which you can call to continue executing the operation

:::info
The `onQuery` hook's configuration structure is compatible with Prisma Client Extensions' [query extension](https://www.prisma.io/docs/orm/prisma-client/client-extensions/query).
:::

As its name suggests, query API hooks are only triggered by ORM query calls, not by query builder API calls.

## Samples

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm" openFile="plugins/kysely-query-hooks.ts" startScript="generate,kysely-query-hooks" />
