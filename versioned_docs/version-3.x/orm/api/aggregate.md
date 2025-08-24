---
sidebar_position: 7
description: Aggregate API
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Aggregate

The `aggregate` method allows you to conduct multiple aggregations on a set of records with one operation. The supported aggregations are:

- `_count` - equivalent to the [Count API](./count.md).
- `_sum` - sum of a numeric field.
- `_avg` - average of a numeric field.
- `_min` - minimum value of a field.
- `_max` - maximum value of a field.

You can also use `where`, `orderBy`, `skip`, and `take` to control what records are included in the aggregation.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="aggregate.ts" startScript="generate,aggregate" />
