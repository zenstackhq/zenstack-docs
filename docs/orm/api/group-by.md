---
sidebar_position: 8
description: GroupBy API
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# GroupBy

The `groupBy` method allows you to group records by one or more fields and perform aggregations on the grouped records - very useful for generating summary statistics or reports.

Use the `by` field to specify the field(s) to group by, and the following aggregation operators to perform on the grouped records:

- `_count` - count the number of records in each group.
- `_sum` - sum of a numeric field in each group.
- `_avg` - average of a numeric field in each group.
- `_min` - minimum value of a field in each group.
- `_max` - maximum value of a field in each group.

You can also use `where`, `orderBy`, `skip`, and `take` to control what records are included in the aggregation.

The `having` field can be used to filter the aggregated results. Two types of filters can be used in the `having` clause:

- A regular field that's used in the `by` clause, e.g.:

    ```ts
    await db.post.groupBy({ by: 'published', having: { published: true } });
    ```

- An aggregation, e.g.:

    In this case, the fields of aggregation doesn't need to be in the `by` clause.

    ```ts
    await db.post.groupBy({
      by: 'authorId',
      having: { viewCount: { _sum: { gt: 100 }} }
    });
    ```

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="group-by.ts" startScript="generate,group-by" />
