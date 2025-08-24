---
sidebar_position: 2
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Entity Mutation Hooks

## Introduction

Entity mutation hooks allow you to intercept entity mutation operations, i.e., "create", "update", and "delete". They are triggered regardless of whether the operations are performed through the ORM queries or the query builder API.

To create an entity mutation hook plugin, call the `$use` method with an `onEntityMutation` key containing an object with the following fields (all optional):

- `beforeEntityMutation`
    A callback function that is called before the entity mutation operation. It receives a context object containing:
      - The model
      - The action (create, update, delete)
      - The Kysely query node (SQL AST)
      - The entities being mutated (only available when opted in)

- `afterEntityMutation`
    A callback function that is called after the entity mutation operation. It receives a context object containing:
      - The model
      - The action (create, update, delete)
      - The Kysely query node (SQL AST)
      - The entities before the mutation (only available when opted in)
      - The entities after the mutation (only available when opted in)

- `mutationInterceptionFilter`
  
    A callback used to determine if an operation should be intercepted, and if so, whether entities should be loaded and passed to the `beforeEntityMutation` and `afterEntityMutation` hooks. It receives a context object containing:
      - The model
      - The action (create, update, delete)
      - The Kysely query node (SQL AST)
    
    The callback should return an object indicating if the operation should be intercepted and whether entities should be loaded. If this callback is not provided, by default, all mutation operations are intercepted, but entities are not loaded.

If a mutation happens inside a transaction, the `afterEntityMutation` callback is called after the transaction is committed.

:::info
Update and delete triggered by cascading operations are not captured by the entity mutation hooks.
:::

:::warning
Be very careful about opting in to load before and after mutation entities. Batch mutations can result in a large number of entities being loaded and incur significant performance overhead.
:::

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="plugins/entity-mutation-hooks.ts" startScript="generate,entity-mutation-hooks" />
