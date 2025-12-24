---
sidebar_position: 2
description: Find API
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import SelectIncludeOmit from './_select-include-omit.md';

# Find

The `find` series of APIs are used to query records from the database. It has the following methods:

- `findMany`
    
    Find multiple records that match the query criteria.

- `findUnique`
    
    Find a single record with a unique criteria.

- `findFirst`
    
    Find the first record that matches the query criteria.

- `findUniqueOrThrow`
    
    Similar to `findUnique`, but throws an error if no record is found.

- `findFirstOrThrow`
    
    Similar to `findFirst`, but throws an error if no record is found.

## Basic usage

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="find/basic.ts" startScript="generate,find:basic" />

## Filtering

The API provides a very flexible set of filtering options. We've put it into a [dedicated document](./filter.md).

## Sorting

Use the `orderBy` field to control the sort field, direction, and null field placement. Sorting is not supported for `findUnique` and `findUniqueOrThrow`.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="find/sort.ts" startScript="generate,find:sort" />

## Pagination

You can use two strategies for pagination: offset-based or cursor-based. Pagination is not supported for `findUnique` and `findUniqueOrThrow`.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="find/pagination.ts" startScript="generate,find:pagination" />

## Field selection

You can use the following fields to control what fields are returned in the result:

<SelectIncludeOmit />

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="find/selection.ts" startScript="generate,find:selection" />

## Finding distinct rows

You can use the `distinct` field to find distinct rows based on specific fields. One row for each unique combination of the specified fields will be returned. The implementation relies on SQL `DISTINCT ON`, so it's not available for SQLite provider.

```ts
// returns one Post for each unique authorId
await db.post.findMany({ distinct: ['authorId'] });
```    
