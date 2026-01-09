---
sidebar_position: 13
description: ORM custom procedures
---

import PreviewFeature from '../_components/PreviewFeature';
import AvailableSince from '../_components/AvailableSince';

# Custom Procedures

<PreviewFeature name="Custom procedure" />

<AvailableSince version="v3.2.0" />

:::info
Please refer to the [Modeling](../modeling/custom-proc.md) part for how to define custom procedures in ZModel.
:::

The ORM's CRUD API is very flexible and powerful, but in real-world applications you'll often find the need to encapsulate complex logic into more high-level and reusable operations. For example, in a collaborative app, after creating new users, you may want to automatically create a default workspace for them and assign some initial roles.

A conventional approach is to implement a `signUp` API route that orchestrates these steps. However, since the operation is still very much database-centric, it's more natural to have the encapsulation at the ORM level. This is where custom procedures come in. They are type-safe procedures defined in ZModel and implemented with TypeScript, and can be invoked via the ORM client just like the built-in CRUD methods.

## Implementing custom procedures

Suppose you have the following custom procedures defined in ZModel:

```zmodel title="schema.zmodel"
// get blog post feeds for a given user
procedure getUserFeeds(userId: Int, limit: Int?) : Post[] 

// sign up a new user
mutation procedure signUp(email: String) : User
```

:::info
Query procedures and mutation procedures currently don't have any semantic differences at the ORM level. However, in the future they may behave differently, for example, when features like cached queries are introduced.
:::

When you construct a `ZenStackClient`, you must provide an implementation for each procedure:

```ts title="db.ts"
const db = new ZenStackClient({
  ...
  procedures: {
    getUserFeeds: ({ client, args }) => {
      return client.post.findMany({
        where: { authorId: args.userId },
        orderBy: { createdAt: 'desc' },
        take: args.limit,
      });
    },

    signUp: ({ client, args }) => {
      return client.user.create({
        data: {
          email: args.email,
          memberships: {
            create: {
              role: 'OWNER',
              workspace: {
                create: { name: 'Default Workspace' },
              },
            },
          }
        }
      });
    },
  },
});
```

The implementation callbacks are provided with a context argument with the following fields:

    - `client`: an instance of `ZenStackClient` used to invoke the procedure.
    - `args`: an object that contains the procedure arguments.

At runtime, before passing the args to the callbacks, ZenStack verifies that they conform to the types defined in ZModel. You can implement additional validations in the implementation if needed. ZenStack doesn't verify the return values. It's your responsibility to ensure they match the declared return types.

## Calling custom procedures

The custom procedures methods are grouped under the `$procs` property of the client instance. You must provide arguments as an object under the `args` key:

```ts
const user = await db.$procs.signUp({
  args: { email: 'alice@example.com' } 
});

const feeds = await db.$procs.getUserFeeds({
  args: { userId: user.id, limit: 20 } 
});
```

## Error handling

The `ZenStackClient` always throws an `ORMError` to the caller when an error occurs. To follow this protocol, custom procedure implementations should ensure other types of errors are caught and wrapped into `ORMError` and re-thrown. See [Error Handling](./errors.md) for more details.
