---
sidebar_label: "Extra: Under The Hood"
---

#  How Does ZenStack Work Under the Hood?

:::warning Advanced Topic

This document is for advanced users who want to understand how ZenStack works under the hood. It's not required for using ZenStack.

:::

ZenStack extends Prisma ORM mainly at two levels. First, it provides a modeling DSL (ZModel) - a superset of Prisma schema. Second, it allows the creation of enhanced wrappers for Prisma clients at runtime for injecting extra behaviors.

This document explains how these extensions work so that you can make a more informed judgment on whether ZenStack is the right choice for you.

## ZModel Language

ZenStack implemented the ZModel DSL from scratch, including the CLI and the VSCode extension, using the fantastic language toolkit [Langium](https://langium.org/). The DLS includes a plugin system, allowing a modular and extensible way to generate different artifacts from the schema. The core functionality of the toolkit is supported by the following core plugins:

-   Prisma: `@core/prisma`

    The `@core/prisma` plugin generates the Prisma schema and Prisma client from the ZModel schema. The Prisma schema can then be used for common Prisma tasks like `db push`, `migrate dev`, etc.

-   Enhancer: `@core/enhancer`

    The `@core/enhancer` plugin generates several Javascript modules to support ZenStack's runtime enhancements to Prisma clients. The modules include:

    - Model metadata
    
        Provides basic information about models and fields at runtime. The metadata is much more lightweight than the whole ZModel AST and is much cheaper to load.

        The default output location is `node_modules/.zenstack/model-meta.js`.

    - Access policies

        Javascript function representation of access policy rules (expressed with `@@allow` and `@@deny` attributes). The functions take a context object as input and return partial Prisma query objects, which will be injected into Prisma query arguments at runtime. The context object contains the following properties:

        -   `user`: the current user, which serves as the return value of [`auth()`](./access-policy/current-user) in the policy rules.
        -   `preValue`: the previous value of an entity before update (for supporting the [`future()`](./access-policy/post-update) function in the policy rules).

        The default output location is `node_modules/.zenstack/policy.js`.

        For example, for the following `Post` model:

        ```zmodel
        model Post {
            id        String @id @default(cuid())
            createdAt DateTime @default(now())
            updatedAt DateTime @updatedAt
            title     String
            published Boolean @default(false)
            author    User @relation(fields: [authorId], references: [id])
            authorId  String

            // author has full access
            @@allow('all', auth() == author)

            // logged-in users can view published posts
            @@allow('read', auth() != null && published)
        }
        ```

        , the following checker functions are generated for "read" and "update" respectively:

        ```ts
        function Post_read(context: QueryContext) {
            const user = hasAllFields(context.user, ['id']) ? context.user : null;
            return {
                OR: [
                    user == null
                        ? { OR: [] } // false condition
                        : {
                              author: {
                                  is: {
                                      id: user.id,
                                  },
                              },
                          },
                    {
                        AND: [
                            user == null ? { OR: [] } : { AND: [] },
                            {
                                published: true,
                            },
                        ],
                    },
                ],
            };
        }

        function Post_update(context: QueryContext) {
            const user = hasAllFields(context.user, ['id']) ? context.user : null;
            return user == null
                ? { OR: [] } // false condition
                : {
                      author: {
                          is: {
                              id: user.id,
                          },
                      },
                  };
        }
        ```

## Runtime Enhancements

The primary responsibility of ZenStack's runtime is to create _enhanced_ Prisma client instances. Runtime enhancements are achieved by creating transparent proxies around raw Prisma clients. The proxies intercept all Prisma client methods, inject into query arguments, and manipulate the query results returned by the client.

### Access Policy

Access policy is the most complex part of the system. Part of the complexity comes from the great flexibility Prisma offers in querying and mutating data. For example, to enforce "read" rules on a `Post` model, we need to consider several possibilities:

```ts
// a direct where condition
prisma.post.findMany({
    where: {...}
});

// nested fetch for relations
prisma.user.findUnique({
    where: {id: ...},
    include: { posts: true }
});

// nested fetch during mutation
prisma.user.update({
    where: {id: ...},
    data: { ... },
    select: { id: true, email: true, posts: true }
});

// ...
```

We need the following measures to enforce access policies systematically:

1. **Inject filter conditions into the "where" clause in the context of "find many"**

    This covers cases like direct `findMany`/`findUnique`/`findFirst`/... calls:

    ```ts
    prisma.user.findMany({ where: { ... } });

    // to

    prisma.user.findMany({
        where: {
            AND: [
                { /* original conditions */ },
                { /* read conditions */ },
            ],
        },
    });
    ```

    Or nested "find" for a to-many relation:

    ```ts
    prisma.user.findMany({ include: { posts: true } });

    // to

    prisma.user.findMany({
        include: {
            posts: {
                where: {
                    /* read conditions */
                },
            },
        },
    });
    ```

    Or an implicit "find" carried with a mutation:

    ```ts
    prisma.user.update({ data: { ... }, include: { posts: true } });

    // to

    prisma.user.update({ data: { ... }, include: { posts: { where: { /* read conditions */ } } } });
    ```

2. **Inject filter conditions into the "where" clause of "mutate many"**

    This covers cases like `updateMany` and `deleteMany`:

    ```ts
    prisma.user.updateMany({ where: { ... }, data: { ... } });

    // to

    prisma.user.updateMany({
        where: {
            AND: [ { /* original conditions */ }, { /* update conditions */ } ]
        },
        data: { ... }
    });
    ```

    Or nested usage of them:

    ```ts
    prisma.user.update({ where: { ... }, data: { posts: { deleteMany: { where: { ... } } } } });

    // to

    prisma.user.update({ where: { ... },
        data: {
            posts: {
                deleteMany: {
                    AND: [ { /* original conditions */ }, { /* delete conditions */ } ]
                }
            }
        }
    });
    ```

3. **Post-read check for entities fetched as a to-one relation**

    To-one relation is a special case for reading because there's no way to do filtering at the read time: you either include it or not. So, we need to do a post-read check to ensure the fetched entity can be read.

    ```ts
    const user = prisma.user.findUnique({ where: { id: ... }, include: { profile: true } });

    // to

    const user = prisma.user.findUnique({ where: { id: ... }, include: { profile: true } });
    if (profile && !readable(user.profile)) {
       // throw rejected error
    }
    ```

4. **Transaction-protected mutations**

    Policies that do "post-mutation" checks, including "create" and "post-update" ("update" rule calling [`future()`](#the-future-function) function) rules, are protected by a transaction. The mutation is conducted first, and then post-mutation checks are performed. If any of the checks fail, the transaction rolls back.

    Although, for simple cases, we can enforce policies by checking the mutation input, there are many cases where we can't safely rely on that. Instead, employing a transaction is the most reliable way to achieve a consistent result. In the future, we may add input checking as an optimization where possible.

    ```ts
    prisma.user.create({ data: { ... } });

    // to

    prisma.$transaction((tx) => {
        const user = prisma.user.create({ data: { ... } });
        if (!createable(user)) {
            // throw rejected error
        }
    })
    ```

### The `auth()` function

The `auth()` function connects authentication with access control. It's typed as the auth model (the model named "User" by default) in ZModel and represents the current authenticated user. The most common way of setup is to read the auth model entity from the database after authentication is completed and pass the result to the `enhance` function as context.

Although `auth()` resolves to the auth model, since it's provided by the user, there's no way to guarantee its value fully conforms to the model' typing: e.g., non-nullable fields can be passed as `null` or `undefined`. We employ some simple rules to deal with such cases:

-   If `auth()` is `undefined`, it's normalized to `null` when evaluating access policies.
-   If `auth()` itself is `null`, any member access (or chained member access) is `null`.
-   `expression == null` evaluates to `true` if `expression` is `null`.
-   Otherwise, a boolean expression evaluates to `false` if a `null` value is involved.

Here are a few examples (assuming `auth()` is `null`):

1. `auth() == null` -> `true`
2. `auth() != null` -> `false`
3. `auth().name == null` -> `true`
4. `auth().age > 0` -> `false`
5. `auth().age < 0` -> `false`

### The `future()` function

An "update" policy rule is treated as a "post-update" rule if it involves a `future()` function call. `future()` represents the value of the model entity after the update is completed. In a "post-update" policy rule, any member accesses that are not prefixed with `future().` is treated as referencing the entity's value before the update. To support the evaluation of such rules, the entity value before the update is captured and passed as the `preValue` field in the context object passed to the checker function.
