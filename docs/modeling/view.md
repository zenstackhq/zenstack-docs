---
sidebar_position: 10
description: Views in ZModel
---

import PreviewFeature from '../_components/PreviewFeature.tsx'

# View

<PreviewFeature name="View support" />

The `view` construct is used to define a SQL view. Defining a `view` is pretty much the same as defining a `model`, with the exception that views cannot have index or id fields (designated with `@id`, `@@id`, or `@@index` attributes).

## Defining views

A typical view looks like this:

```zmodel
view UserInfo {
    id        Int
    email     String @unique
    postCount Int
}
```

## Migration support

The migration engine doesn't support views, so it's your responsibility to either manually create them in the database, or use the `--create-only` to create an empty migration record and manually add view creation DDL in it. See [Database Migration](../orm/migration#migrate-dev) for more details.
