---
description: API references
sidebar_position: 4
sidebar_label: API
---

# API Reference

## `@zenstackhq/orm`

### `ClientContract<Schema>`

The interface for the ZenStack ORM client, implemented by [ZenStackClient](#zenstackclient).

### `ZenStackClient<Schema>`

The class that implements the ORM client.

```ts
/**
 * ZenStack ORM client.
 */
export const ZenStackClient = function <Schema extends SchemaDef>(
    this: any,
    schema: Schema,
    options: ClientOptions<Schema>,
);

/**
 * ZenStack client options.
 */
export type ClientOptions<Schema extends SchemaDef> = {
    /**
     * Kysely dialect.
     */
    dialect: Dialect;

    /**
     * Plugins.
     */
    plugins?: RuntimePlugin<Schema>[];

    /**
     * Logging configuration.
     */
    log?: KyselyConfig['log'];

    // only required when using computed fields
    /**
     * Computed field definitions.
     */
    computedFields: ComputedFieldsOptions<Schema>;      
};
```

#### Query APIs

Please refer to the [ORM Query API documentation](../orm/api/) for more details about query APIs like `findMany`, `create`, `update`, etc.

#### `$connect()`

```ts
/**
 * Eagerly connects to the database.
 */
$connect(): Promise<void>;
```

#### `$disconnect()`

```ts
/**
 * Explicitly disconnects from the database.
 */
$disconnect(): Promise<void>;
```

#### `$setAuth()`

```ts
/**
 * Sets the current user identity.
 */
$setAuth(auth: AuthType<Schema> | undefined): ClientContract<Schema>;
```

#### `$auth`

```ts
/**
 * The current user identity.
 */
get $auth(): AuthType<Schema> | undefined;
```

#### `$use()`

Read more in the [Plugins documentation](../orm/plugins/).

```ts
/**
 * Returns a new client with the specified plugin installed.
 */
$use(plugin: RuntimePlugin<Schema>): ClientContract<Schema>;
```

#### `$unuse()`

Read more in the [Plugins documentation](../orm/plugins/).

```ts
/**
 * Returns a new client with the specified plugin removed.
 */
$unuse(pluginId: string): ClientContract<Schema>;
```

#### `$unuseAll()`

Read more in the [Plugins documentation](../orm/plugins/).

```ts
/**
 * Returns a new client with all plugins removed.
 */
$unuseAll(): ClientContract<Schema>;
```

#### `$qb`

Read more in the [Query Builder API documentation](../orm/query-builder).

```ts
/**
 * The underlying Kysely query builder instance.
 */
readonly $qb: ToKysely<Schema>;
```

#### `$qbRaw`

Read more in the [Query Builder API documentation](../orm/query-builder).

```ts
/**
 * The underlying raw Kysely query builder without any ZenStack enhancements.
 */
readonly $qbRaw: AnyKysely;
```
