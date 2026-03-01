---
sidebar_position: 10
description: Computed fields in ZModel
---

import ZenStackVsPrisma from '../_components/ZenStackVsPrisma';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Computed Fields

<ZenStackVsPrisma>
Prisma client extensions allow you to define computed fields. ZenStack's approach is very different in two aspects:
1. Computed fields are evaluated on the database side, not in the client.
2. Computed fields are defined in the schema and can be used in most places where regular fields are used.
</ZenStackVsPrisma>

Computed fields are "virtual" fields that do not physically exist in the database. They are computed on the fly, but other than that, they behave like regular fields. They are returned as part of the query results, can be used for filtering, sorting, etc., and can be used to define access policies.

## Defining Computed Fields

Defining a computed field involves two steps. First, add the field in the ZModel schema to a model and annotate it with the `@computed` attribute.

```zmodel
model User {
    ...
    postCount Int @computed
}
```

Then, when creating a `ZenStackClient`, provide the implementation of the field using the Kysely query builder.

```ts
const db = new ZenStackClient(schema, {
  ...
  computedFields: {
    User: {
      // equivalent SQL:
      // `(SELECT COUNT(*) AS "count" FROM "Post" WHERE "Post"."authorId" = "User"."id")`
      postCount: (eb) => 
        eb.selectFrom('Post')
          .whereRef('Post.authorId', '=', 'id')
          // the `as('count')` part is required because every Kysely selection 
          // needs to have a name
          .select(({fn}) => fn.countAll<number>().as('count')),
    },
  },
});
```

The computed field callback is also passed with a second `context` argument containing other useful information related to the current query. For example, you can use the `modelAlias` property to refer to the containing model and use it to qualify field names in case of conflicts.

```ts
import { sql } from '@zenstackhq/orm/helpers';

const db = new ZenStackClient(schema, {
  ...
  computedFields: {
    User: {
      postCount: (eb, { modelAlias }) => 
        eb.selectFrom('Post')
          // the `modelAlias` context property gives you a name that you can
          // use to address the containing model (here `User`) at runtime
          .whereRef('Post.authorId', '=', sql.ref(`${modelAlias}.id`))
          .select(({fn}) => fn.countAll<number>().as('count')),
    },
  },
});
```

The full signature of the computed field implementation is as follows:

```ts
import { OperandExpression, ExpressionBuilder } from 'kysely';

type ComputedFieldCallback = (
  eb: ExpressionBuilder<...>,
  context: {
    modelAlias: string
  }
) => OperandExpression<...>;
```

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm-computed-fields" />
