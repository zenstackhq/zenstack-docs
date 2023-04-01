---
description: How does ZenStack work under the hood?
sidebar_position: 1
---

# How Does ZenStack Work Under the Hood?

ZenStack extends Prisma ORM in several aspects. First, it provides a modeling DSL (ZModel) - a superset of Prisma schema. Second, it allows to create enhancement wrappers to Prisma client at runtime for injecting extra behaviors. Third, it provides server adapters for installing automatic CRUD services into popular Node.js-based frameworks.

This document explains how each of these aspects works, so that you can make a more informed judgement on whether ZenStack is the right choice for you.

## ZModel Language

ZenStack implemented the ZModel DSL from scratch, including the CLI and the VSCode extension, using the awesome language toolkit [Langium](https://langium.org/). The DLS includes a plugin system, allowing a modular and extensible way to generate different artifacts from the schema. The core functionality of the toolkit is supported by the following three built-in plugins:

-   Prisma

    The Prisma plugin generates the Prisma schema and Prisma client from the ZModel schema. The Prisma schema can then be used for common Prisma tasks, like `db push`, `migrate dev`, etc.

-   Model-meta

    The model-meta plugin generates the model metadata, which provides basic information about models and fields at runtime. The metadata is much more lightweighted than the full ZModel AST and is much cheaper to load.

    The default output location is `node_modules/.zenstack/model-meta.ts`.

-   Policy

    The policy plugin converts access policy rules (expressed with `@@allow` and `@@deny` attributes) into checker functions. The functions takes a context object as input and returns partial Prisma query objects, which will be injected into Prisma query arguments at runtime. The context object contains the following properties:

    -   `user`: the current user, which serves as the return value of [`auth()`](/docs/guides/understanding-access-policy#accessing-user-data) in the policy rules.
    -   `prevValue`: the previous value of an entity before update, for supporting the [`future()`](/docs/guides/understanding-access-policy#update) function in the policy rules.

    The default output location is `node_modules/.zenstack/policy.ts`.

    For example, for the following `Post` model

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

    , the following checker functions are generated for "read" and "updated" respectively:

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

The main responsibility of ZenStack's runtime is to create _enhanced_ Prisma client instances:

-   `withPassword` creates an enhanced client that automatically hash fields marked with the `@password` attribute before storing to the database.
-   `withOmit` creates an enhanced client that automatically strips fields marked with the `@omit` attribute before returning to the caller.
-   `withPolicy` creates an enhanced client that enforces access policies expressed with `@@allow` and `@@deny` attributes.

### Proxies

Runtime enhancements are achieved by creating transparent proxies around raw Prisma clients. The proxies intercepts all Prisma client methods, injects into query arguments, and manipulates the query results returned by the client. The proxies work independently from each other, so they can be freely combined. In fact, the `withPresets` helper is a direct combination of `withPassword`, `withOmit`, and `withPolicy`.

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

### The `auth` Function

### The `future` Function

### Auxiliary Fields

## RESTful Services
