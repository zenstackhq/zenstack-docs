---
description: API references
sidebar_position: 4
sidebar_label: API
---

# API Reference

## `@zenstackhq/orm`

### `class ZenStackClient`

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