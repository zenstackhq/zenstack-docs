---
sidebar_position: 2
---

import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import PreviewFeature from '../../_components/PreviewFeature';

# Entity Mutation Hooks

<PreviewFeature name="Plugin feature" />

## Introduction

Entity mutation hooks allow you to intercept entity mutation operations, i.e., "create", "update", and "delete". They are triggered regardless of whether the operations are performed through the ORM queries or the query builder API.

To create an entity mutation hook plugin, call the `$use` method with an `onEntityMutation` key containing an object with the following fields (all optional):

- `beforeEntityMutation`
    A callback function that is called before the entity mutation operation. It receives a context object containing:
      - The model.
      - The action (`create`, `update`, `delete`).
      - The Kysely query node (SQL AST).
      - An async loader to load the entities to be mutated.
      - An `ZenStackClient` instance to perform further queries or mutations. Mutation operations initiated with this client will not trigger the entity mutation hooks again.
      - A unique query ID to correlate data between `beforeEntityMutation` and `afterEntityMutation` hooks.

- `afterEntityMutation`
    A callback function that is called after the entity mutation operation. It receives a context object containing:
      - The model.
      - The action (`create`, `update`, `delete`).
      - The Kysely query node (SQL AST).
      - An async loader to load the entities after the mutation.
      - An `ZenStackClient` instance to perform further queries or mutations. Mutation operations initiated with this client will not trigger the entity mutation hooks again.
      - A unique query ID to correlate data between `beforeEntityMutation` and `afterEntityMutation` hooks.

- `runAfterMutationWithinTransaction`
  
    A boolean option that controls whether to run after-mutation hooks within the transaction that performs the mutation.
    - If set to `true`, if the mutation already runs inside a transaction, the callbacks are executed immediately after the mutation within the transaction boundary. If the mutation is not running inside a transaction, a new transaction is created to wrap both the mutation and the callbacks. If your hooks make further mutations, they will succeed or fail atomically with the original mutation.
    - If set to `false`, the callbacks are executed after the mutation transaction is committed.
     
    Defaults to `false`.
     

:::info
Update and delete triggered by cascading operations are not captured by the entity mutation hooks.
:::

:::warning
Be very careful about loading before and after mutation entities. Batch mutations can result in a large number of entities being loaded and incur significant performance overhead.
:::

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm" openFile="plugins/entity-mutation-hooks.ts" startScript="generate,entity-mutation-hooks" />
