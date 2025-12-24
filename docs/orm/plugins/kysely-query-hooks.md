---
sidebar_position: 3
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import PreviewFeature from '../../_components/PreviewFeature';

# Kysely Query Hooks

<PreviewFeature name="Plugin feature" />

## Introduction

Kysely query hooks are the lowest level of interceptors in the plugin system. Since ZenStack eventually delegates all database access to Kysely, these hooks allow you to inspect and modify all SQL queries before they are sent to the database, regardless of whether they originate from the ORM query API or the query builder API.

This mechanism gives you great power to control the ORM's behavior entirely. One good example is the [Access Control](../access-control/) plugin - the access policy enforcement is entirely achieved via intercepting the Kysely queries.

To create a Kysely query hook plugin, call the `$use` method with an object containing a `onKyselyQuery` callback. The callback is triggered before each Kysely query is executed. It receives a context object containing:

- The Kysely instance
- The Kysely query node (SQL AST)
- The ORM client that triggered the query
- A "proceed query" function, which you can call to send the query to the database

## Samples

:::info
Kysely's `OperationNode` objects are low-level and not easy to process. [Kysely Plugin System](https://kysely.dev/docs/plugins) is a good information source for learning it. ZenStack will provide helpers to facilitate common tasks in the future.
:::

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="plugins/kysely-query-hooks.ts" startScript="generate,kysely-query-hooks" />
