---
title: ZenStack - The Next Chapter (Part III. New Plugin System)
description: This post explores the new plugin system of ZenStack v3.
tags: [zenstack, v3]
authors: yiming
image: ../next-chapter-1/cover.png
date: 2025-04-11
---

# ZenStack - The Next Chapter (Part III. New Plugin System)

![Cover Image](../next-chapter-1/cover.png)

In the [previous post](../next-chapter-2/index.md), we discussed the new extensibility opportunities of the core ORM by adopting Kysely. In this post, we'll continue exploring the plan for v3's new plugin system that allows you to deeply customize ZenStack's behavior in a clean and maintainable way.

<!-- truncate -->

## Plugin Composition

ZenStack v2 provided a rudimentary [plugin system](../../docs/the-complete-guide/part2/index.md) that allows you to participate in the process of `zenstack generate`. It's sufficient for use cases like generating OpenAPI specs or TanStack Query hooks. However, there's no well-defined way to extend the ORM's runtime behavior in a pluggable way.

V3 aims to provide a more complete plugin system that allows you to contribute at the schema, generation, and runtime levels. A plugin can include the following parts:

1. A `plugin.zmodel` file that can define attributes, functions, procedures, etc.
  V2 already offers this. When running `zenstack generate`, all ZModel contributions from plugins will be merged with the user ZModel files.

1. A generator function that's called during generation
  V2 already offers this. The function will be called at `zenstack generate` time and given the ZModel AST (and potentially the Prisma DMMF too, TBD) as input. The generator can interpret attributes, functions, etc. defined in `plugin.zmodel`.

1. A runtime plugin class that implements various callbacks
  This provides great flexibility for a plugin to hook into the ORM's lifecycle at various levels - more about this in the next section.

## Runtime Plugin

A runtime plugin is an object satisfying the following interface. It may look a bit complex because it contains callbacks for different purposes. Don't worry, we'll dissect them shortly.

```ts
interface RuntimePlugin {
  /**
   * Plugin ID.
   */
  id: string;

  /**
   * Intercepts an ORM query.
   */
  onQuery?: (
    args: PluginContext,
    proceed: ProceedQueryFunction
  ) => Promise<unknown>;

  /**
   * Kysely query transformation.
   */
  transformKyselyQuery?: (
    args: PluginTransformKyselyQueryArgs
  ) => RootOperationNode;

  /**
   * Kysely query result transformation.
   */
  transformKyselyResult?: (
    args: PluginTransformKyselyResultArgs
  ) => Promise<QueryResult<UnknownRow>>;

  /**
   * This callback determines whether a mutation should be intercepted, and if so,
   * what data should be loaded before and after the mutation.
   */
  mutationInterceptionFilter?: (
    args: MutationHooksArgs
  ) => MaybePromise<MutationInterceptionFilterResult>;

  /**
   * Called before an entity is mutated.
   */
  beforeEntityMutation?: (
    args: PluginBeforeEntityMutationArgs
  ) => MaybePromise<void>;

  /**
   * Called after an entity is mutated.
   */
  afterEntityMutation?: (
    args: PluginAfterEntityMutationArgs
  ) => MaybePromise<void>;
}
```

To install a plugin, simply call the client's `$use` method to pass in its definition.

```ts
const client = new ZenStackClient(schema)
  .$use({
    id: 'my-plugin',
    onQuery: (args, proceed) => ...
  });
```

### ORM Query Interception

A high-level way of hooking into the ORM's lifecycle is to intercept the CRUD calls: `create`, `update`, `findMany`, etc. The `args` parameter contains the model (e.g., "User"), the operation (e.g., "findMany"), and the arguments (e.g.: `{ where: { id: 1 } }`). The `proceed` parameter is an async function that triggers the CRUD's execution. Things you can do include:

1. Executing arbitrary code before and after calling `proceed`.
2. Altering the query arguments.
3. Transforming the query results.
4. Overriding the call completely without calling `proceed`.

Here's an example of logging slow queries:

```ts
const client = new ZenStackClient(schema)
  .$use({
    id: 'slow-query-logger',
    onQuery: async (args, proceed) => {
      const start = Date.now();
      const result = await proceed(args.queryArgs);
      const duration = Date.now() - start;
      if (duration > 1000) {
        logger.log(`Slow query: ${args.model}, ${args.operation}, ${JSON.stringify(args.queryArgs)}`);
      }
      return result;
    }
  });
```

The plugin can also have side effects by making extra ORM calls (the `args` parameter includes the current `ZenStackClient` instance), or even start a transaction to group multiple operations.

ORM query interception is useful for many scenarios, but it doesn't intercept CRUD made with the query builder API:

```ts
// the following call will not trigger the plugin's `onQuery` callback
await client.$qb.selectFrom('User')
  .leftJoin('Post', 'Post.authorId', 'User.id')
  .select(['User.id', 'User.email', 'Post.title'])
  .execute();
```

To ubiquitously handle all database operations, whether originating from ORM call or query builder, use the Kysely transformers explained in the next section.

### Kysely Transformation

Kysely has a built-in [plugin mechanism](https://kysely.dev/docs/plugins) that allows you to transform the SQL-like query tree before execution and transform the query result before returning to the caller. ZenStack v3 will leverage it directly in its plugin system. Here's an example for automatically attaching prefixes to id fields during insert:

```ts
import { OperationNodeTransformer } from 'kysely';

const client = new ZenStackClient(schema)
  .$use({
    id: 'id-prefixer',
    transformKyselyQuery: ({node}) => {
      if (!InsertQueryNode.is(node)) {
        return node;
      } else {
        return new IdPrefixTransformer().transform(node);
      }
    }
  });

// a transformer that recursively visit the node and prefix primary key
// assignment values
class IdPrefixTransformer extends OperationNodeTransformer {
  ...
}
```

No matter how you access the database with ZenStack, using the ORM API or query builder, eventually, an operation is transformed into a Kysely query tree and then executed. Intercepting at the Kysely level allows you to preprocess and post-process all database queries uniformly.

### Entity Mutation Hooks

Sometimes, you don't care about what SQL is executed, but instead, you want to tap into entity mutation events: entities created, updated, or deleted. You can intercept entity mutations via [ORM Query Interception](#orm-query-interception) or [Kysely Transformation](#kysely-transformation), but it can be rather complex to implement.

The entity mutation hooks are designed to make this scenario easy. It allows you to directly provide callbacks invoked before and after a mutation happens. There are a few complexities to consider, though:

1. Accessing the entities pre/post mutation

  It's often desirable to be able to inspect entities impacted by the mutation (before and after). However, loading the entities can be expensive, especially for mutations affecting many rows.

2. Side effects and transaction
   
  There can be cases where you want to have database side effects in your callbacks, and you may wish your side effects and the original mutation to happen atomically. However, unconditionally employing a transaction for every mutation can bring unnecessary overhead.

To mitigate these problems, a runtime plugin allows you to provide an additional `mutationInterceptionFilter` callback to "preflight" an interception. The callback gives you access to the mutation that's about to happen and lets you return several pieces of information that control the interception:

- If the mutation should be intercepted at all
- If the pre-mutation entities should be loaded and passed to the `beforeEntityMutation` call
- If the post-mutation entities should be loaded and passed to the `afterEntityMutation` call
- If a transaction should be used to wrap around the before/after hooks call and the mutation itself

By carefully implementing the "preflight" callback, you can minimize the performance impact caused by the mutation hooks.

## Conclusion

ZenStack v3's core part will focus on providing the database access primitives, and most of the upper-level features will be implemented as plugins. This can include access control, soft delete, encryption, etc. An emphasis on extensibility will allow developers to adapt the ORM to the exact needs of their applications.
