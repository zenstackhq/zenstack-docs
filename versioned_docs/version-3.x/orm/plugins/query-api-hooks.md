---
sidebar_position: 1
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';

# Query API Hooks

## Introduction

Query API hooks allow you to intercept ORM queries, like `create`, `findUnique`, etc. You can execute arbitrary code before or after the query operation, modify query args, or even block the operation altogether.

To create a query API hook plugin, call the `$use` method with an object with the `onQuery` key providing a callback. The callback is invoked with an argument containing the following fields:

- The model
- The operation
- The query args
- The ORM client that triggered the query
- A "proceed query" function, which you can call to continue executing the operation

As its name suggests, query API hooks are only triggered by ORM query calls, not by query builder API calls.

## Samples

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm" openFile="plugins/kysely-query-hooks.ts" startScript="generate,kysely-query-hooks" />
