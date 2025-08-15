---
sidebar_position: 4
description: Update API
---

import StackBlitzGithubEmbed from '@site/src/components/StackBlitzGithubEmbed';

# Update

Update to records can be done with the following methods:

- `update` - Update a single, unique record.
- `updateMany` - Update multiple records that match the query criteria.
- `updateManyAndReturn` - Similar to `updateMany`, but returns the updated records
- `upsert` - Update a single, unique record, or create it if it does not exist.

## Updating scalar fields

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-update" openFile="scalar.ts" startScript="generate,scalar" />

In additional to the standard way of updating fields, list fields support the following operators:

- `push`: Append a value or a list of values to the end of the list.
- `set`: Replace the entire list with a new list (equivalent to setting the field directly).

```ts
await db.post.update({
  where: { id: '1' },
  data: {
    topics: { push: 'webdev'},
  },
});

await db.post.update({
  where: { id: '1' },
  data: {
    topics: { set: ['orm', 'typescript'] },
  },
});
```

## Manipulating relations

THe `update` and `upsert` methods are very powerful in that they allow you to freely manipulate relations. You can create, connect, disconnect, update, and delete relations in a single operation. You can also reach deeply into indirect relations.

`updateMany` and `updateManyAndReturn` only support updating scalar fields.

<StackBlitzGithubEmbed repoPath="zenstackhq/v3-doc-orm-update" openFile="relation.ts" startScript="generate,relation" />
