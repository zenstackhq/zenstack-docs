---
sidebar_position: 2
description: Find API
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';
import GithubCodeBlock from '@site/src/components/GithubCodeBlock';
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

Throughout this section all samples are based on the following ZModel schema:

<GithubCodeBlock repoPath="zenstackhq/v3-doc-orm-find" file="zenstack/schema.zmodel" />

## Basic usage

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-find" openFile="basic.ts" startScript="generate,basic" />

## Filtering

The API provides a very flexible set of filtering options. We've put it into a [dedicated section](./filter.md).

## Sorting

Use the `sort` field to control the sort field, direction, and null field placement. Sorting is not supported for `findUnique` and `findUniqueOrThrow`.

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-find" openFile="sort.ts" startScript="generate,sort" clickToLoad={true} />

## Pagination

You can use two strategies for pagination: offset-based or cursor-based. Pagination is not supported for `findUnique` and `findUniqueOrThrow`.

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-find" openFile="pagination.ts" startScript="generate,pagination" clickToLoad={true} />

## Field selection

You can use the following fields to control what fields are returned in the result:

<SelectIncludeOmit />

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-find" openFile="selection.ts" startScript="generate,selection" clickToLoad={true} />

## Finding distinct rows

You can use the `distinct` field to find distinct rows based on specific fields. One row for each unique combination of the specified fields will be returned. The implementation uses SQL `DISTINCT ON` if it's supported by the dialect, otherwise falls back to in-memory deduplication.

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-find" openFile="distinct.ts" startScript="generate,distinct" clickToLoad={true} />
