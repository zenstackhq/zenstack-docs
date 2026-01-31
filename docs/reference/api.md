---
description: API references
sidebar_position: 4
sidebar_label: API
---

# API Reference

## `@zenstackhq/orm`

### `ClientContract`

The interface for the ZenStack ORM client, implemented by [ZenStackClient](#zenstackclient).

#### Type Parameters

- `Schema`: The schema type.

### `ZenStackClient`

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
```

#### Type Parameters

- `Schema`: The schema type.

#### Options

```ts
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

  /**
   * Whether to automatically fix timezone for `DateTime` fields returned by 
   * node-pg. Defaults to `true`.
   *
   * Node-pg has a terrible quirk that it interprets the date value as local
   * timezone (as a `Date` object) although for `DateTime` field the data in 
   * DB is stored in UTC.
   * @see https://github.com/brianc/node-postgres/issues/429
   */
  fixPostgresTimezone?: boolean;

  /**
   * Whether to enable input validations expressed with attributes like `@email`,
   * `@regex`, `@@validate`, etc. Defaults to `true`.
   */
  validateInput?: boolean;

  /**
   * Options for omitting fields in ORM query results.
   */
  omit?: OmitOptions<Schema>;

  /**
   * Computed field definitions.
   */
  computedFields?: ComputedFieldsOptions<Schema>;      
};
```

#### Properties

##### `$schema`

```ts
/**
 * The schema definition.
 */
readonly $schema: Schema;
```

##### `$options`
```ts
/**
 * The client options.
 */
readonly $options: Options;
```

##### `$auth`

```ts
/**
 * The current user identity.
 */
get $auth(): AuthType<Schema> | undefined;
```

##### `$qb`

Read more in the [Query Builder API documentation](../orm/query-builder).

```ts
/**
 * The underlying Kysely query builder instance.
 */
readonly $qb: ToKysely<Schema>;
```

##### `$qbRaw`

Read more in the [Query Builder API documentation](../orm/query-builder).

```ts
/**
 * The underlying raw Kysely query builder without any ZenStack enhancements.
 */
readonly $qbRaw: AnyKysely;
```

#### APIs

Please refer to the [ORM Query API documentation](../orm/api/) for more details about CRUD APIs like `findMany`, `create`, `update`, etc.

##### `$connect()`

```ts
/**
 * Eagerly connects to the database.
 */
$connect(): Promise<void>;
```

##### `$disconnect()`

```ts
/**
 * Explicitly disconnects from the database.
 */
$disconnect(): Promise<void>;
```

##### `$setAuth()`

```ts
/**
 * Sets the current user identity.
 */
$setAuth(auth: AuthType<Schema> | undefined): ClientContract<Schema>;
```

##### `$setOptions`

```ts
/**
 * Returns a new client with new options applied.
 * @example
 * ```
 * const dbNoValidation = db.$setOptions({ ...db.$options, validateInput: false });
 * ```
 */
$setOptions<Options extends ClientOptions<Schema>>(options: Options): ClientContract<Schema, Options>;
```

##### `$use()`

Read more in the [Plugins documentation](../orm/plugins/).

```ts
/**
 * Returns a new client with the specified plugin installed.
 */
$use(plugin: RuntimePlugin<Schema>): ClientContract<Schema>;
```

##### `$unuse()`

Read more in the [Plugins documentation](../orm/plugins/).

```ts
/**
 * Returns a new client with the specified plugin removed.
 */
$unuse(pluginId: string): ClientContract<Schema>;
```

##### `$unuseAll()`

Read more in the [Plugins documentation](../orm/plugins/).

```ts
/**
 * Returns a new client with all plugins removed.
 */
$unuseAll(): ClientContract<Schema>;
```

### `RuntimePlugin`

The interface for ZenStack ORM runtime plugins.

#### Type Parameters

- `Schema`: The schema type.
- `ExtQueryArgs`: Extended query args.
- `ExtClientMembers`: Extended client members.

#### Members

##### `id`
```ts
/**
 * Plugin ID.
 */
id: string;
```

##### `name`
```ts
/**
 * Plugin display name.
 */
name?: string;
```

##### `description`
```ts
/**
 * Plugin description.
 */
description?: string;
```

##### `onQuery`
```ts
/**
 * Intercepts an ORM query.
 */
onQuery?: OnQueryCallback<Schema>;
```  

##### `onProcedure`
```ts
/**
 * Intercepts a procedure invocation.
 */
onProcedure?: OnProcedureCallback<Schema>;
```

##### `onEntityMutation`
```ts
/**
 * Intercepts an entity mutation.
 */
onEntityMutation?: EntityMutationHooksDef<Schema>;
```

##### `onKyselyQuery`
```ts
/**
 * Intercepts a Kysely query.
 */
onKyselyQuery?: OnKyselyQueryCallback<Schema>;
```

##### `client`
```ts
/**
 * Extended client members (methods and properties).
 */
client?: ExtClientMembers;
```

##### `queryArgs`
```ts
/**
 * Extended query args configuration.
 */
queryArgs?: {
    [K in keyof ExtQueryArgs]: ZodType<ExtQueryArgs[K]>;
};
```