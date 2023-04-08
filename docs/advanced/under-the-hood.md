---
description: An explanation of the inner workings of ZenStack
sidebar_position: 1
---

# How Does ZenStack Work Under the Hood?

ZenStack extends Prisma ORM mainly at two levels. First, it provides a modeling DSL (ZModel) - a superset of Prisma schema. Second, it allows the creation of enhanced wrappers for Prisma clients at runtime for injecting extra behaviors.

This document explains how these extensions work so that you can make a more informed judgment on whether ZenStack is the right choice for you.

## ZModel Language

ZenStack implemented the ZModel DSL from scratch, including the CLI and the VSCode extension, using the fantastic language toolkit [Langium](https://langium.org/). The DLS includes a plugin system, allowing a modular and extensible way to generate different artifacts from the schema. The core functionality of the toolkit is supported by the following three built-in plugins:

-   Prisma: `@core/prisma`

    The Prisma plugin generates the Prisma schema and Prisma client from the ZModel schema. The Prisma schema can then be used for common Prisma tasks like `db push`, `migrate dev`, etc.

-   Model-meta: `@core/model-meta`

    The model-meta plugin generates the model metadata, which provides basic information about models and fields at runtime. The metadata is much more lightweighted than the full ZModel AST and is much cheaper to load.

    The default output location is `node_modules/.zenstack/model-meta.ts`.

-   Policy: `@core/policy`

    The policy plugin converts access policy rules (expressed with `@@allow` and `@@deny` attributes) into checker functions. The functions take a context object as input and return partial Prisma query objects, which will be injected into Prisma query arguments at runtime. The context object contains the following properties:

    -   `user`: the current user, which serves as the return value of [`auth()`](/docs/guides/understanding-access-policy#accessing-user-data) in the policy rules.
    -   `preValue`: the previous value of an entity before update (for supporting the [`future()`](/docs/guides/understanding-access-policy#update) function in the policy rules).

    The default output location is `node_modules/.zenstack/policy.ts`.

    For example, for the following `Post` model:

    ```prisma
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
                    ? { zenstack_guard: false }
                    : {
                          author: {
                              is: {
                                  id: user.id,
                              },
                          },
                      },
                {
                    AND: [
                        {
                            zenstack_guard: user != null,
                        },
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
            ? { zenstack_guard: false }
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

The primary responsibility of ZenStack's runtime is to create _enhanced_ Prisma client instances:

-   `withPassword` creates an enhanced client that automatically hashes fields marked with the `@password` attribute before storing them in the database.
-   `withOmit` creates an enhanced client that automatically strips fields marked with the `@omit` attribute before returning to the caller.
-   `withPolicy` creates an enhanced client that enforces access policies expressed with `@@allow` and `@@deny` attributes.

### Proxies

Runtime enhancements are achieved by creating transparent proxies around raw Prisma clients. The proxies intercept all Prisma client methods, inject into query arguments, and manipulate the query results returned by the client. The proxies work independently from each other so that they can be freely combined. In fact, the `withPresets` helper is a direct combination of `withPassword`, `withOmit`, and `withPolicy`.

```ts
export function withPresets<DbClient extends object>(
    prisma: DbClient,
    context?: WithPolicyContext,
    policy?: PolicyDef,
    modelMeta?: ModelMeta
) {
    return withPolicy(withOmit(withPassword(prisma, modelMeta), modelMeta), context, policy, modelMeta);
}
```

### Access Policies

Access policies, enabled by the `withPolicy` or `withPresets` enhancer, are the most complex parts of the system. Part of the complexity comes from the great flexibility Prisma offers in querying and mutating data. For example, to enforce "read" rules on a `Post` model, we need to consider several possibilities:

```ts
prisma.post.findMany({
    where: {...}
});

prisma.user.findUnique({
    where: {id: ...},
    include: { posts: true }
});

prisma.user.update({
    where: {id: ...},
    data: { ... },
    select: { id: true, email: true, posts: true }
});
```

We need the following four measures to enforce access policies systematically:

1. **Inject filter conditions into the "where" clause in the context of "find many"**

    This covers cases like a direct `findMany`/`findUnique`/`findFirst`/... calls:

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

1. **Inject filter conditions into the "where" clause of "mutate many"**

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

1. **Post-read check for entities fetched as a to-one relation**

    To-one relation is a special case for reading because there's no way to do filtering at the read time: you either include it or not. So we need to do a post-read check to ensure the fetched entity can be read.

    ```ts
    const user = prisma.user.findUnique({ where: { id: ... }, include: { profile: true } });

    // to

    const user = prisma.user.findUnique({ where: { id: ... }, include: { profile: true } });
    if (profile && !readable(user.profile)) {
       // throw rejected error
    }
    ```

1. **Transaction-protected mutations**

    Policies that do "post-mutation" checks, including "create" and "post-update" ("update" rule calling `future()` function) rules, are protected by a transaction. The mutation is conducted first, and then post-mutation checks are performed. If any of the checks fail, the transaction is rolled back.

    Although, for simple cases, we can enforce policies by checking the mutation arguments, there're many cases where we can't safely rely on that. Instead, employing a transaction is the most reliable way to achieve a consistent result. In the future, we may add arguments checking as an optimization where possible.

    ```ts
    prisma.user.create({ data: { ... } });

    // to

    prisma.$transaction((tx) => {
        const user = prisma.user.create({ data: { ... } });
        if (!createable(user)) {
            // throw rejected error
        }
    }
    ```

### The `auth` function

The `auth` function connects authentication with access control. It's typed as the `User` model in ZModel and represents the current authenticated user. The most common way of setup is to read the `User` entity from the database after authentication is completed and pass the result to the `withPolicy` or `withPresets` function as context.

Although `auth` resolves to `User` model, since it's provided by the user, there's no way to guarantee its value fully conforms to the `User` model: non-nullable fields can be passed as `null` or `undefined`. We employ some simple rules to deal with such cases:

-   If `auth()` is `undefined`, it's normalized to `null` when evaluating access policies.
-   If `auth()` itself is `null`, any member access (or chained member access) is `null`.
-   `expression == null` evaluates to `true` if `expression` is `null`.
-   Otherwise, a boolean expression evaluates to `false` if a `null` value is involved.

### The `future` function

An "update" policy rule is treated as a "post-update" rule if it involves a `future()` function call. `future()` represents the value of the model entity after the update is completed. In a "post-update" policy rule, any member accesses that are not prefixed with `future().` is treated as referencing the entity's value before the update. To support the evaluation of such rules, the entity value before the update is captured and passed as the `preValue` field in the context object passed to the checker function.

### Auxiliary Fields

When ZModel is transpiled to Prisma schema, two auxiliary fields are added to each model:

-   `zenstack_guard`: Boolean, defaults to `true`

    This field facilitates the evaluation of boolean expressions that don't involve a model field. E.g.,

    ```ts
    auth().role == 'admin';
    ```

    is (conceptually) translated to the following Prisma condition:

    ```ts
    {
        where: {
            zenstack_guard: {
                user.role == 'admin';
            }
        }
    }
    ```

-   `zenstack_transaction`: String, nullable

    This field facilitates "create" and "post-update" rule checks. When conducting mutation with Prisma, it's not always straightforward to determine which entities are affected. For example, you can do a deeply nested update from a top-level entity; or an `upsert` with which there's no direct way to tell if an entity is updated or created.

    To support such cases, we use a transaction to wrap the mutation and set the `zenstack_transaction` field to a unique value containing a CUID and the operation (e.g., "create:clg4szzhq000008jf6ppybhb6"). Then, when checking rules, we can query the database (inside the transaction) to find out which entities are affected by the mutation.

The auxiliary fields add some storage and computation overheads to the database, and we can consider optimizing their usage or even removing them in the future.
