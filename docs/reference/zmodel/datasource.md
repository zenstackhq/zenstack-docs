---
sidebar_position: 1
---

# Data Source

Every model needs to include exactly one `datasource` declaration, providing information on how to connect to the underlying database.

## Syntax

```zmodel
datasource NAME {
    provider = PROVIDER
    url = DB_URL
}
```

-   **NAME**:

    Name of the data source. Must be a valid identifier. Name is only informational and serves no other purposes.

-   **`provider`**:

    Required. Name of database connector. Valid values:

    -   sqlite
    -   postgresql
    -   mysql

-   **`url`**:

    Optional. Database connection string. Either a plain string or an invocation of `env` function to fetch from an environment variable. For SQLite provider, the URL should be a file protocol, like `file:./dev.db`. For PostgreSQL and MySQL provider, it should be a valid connection string URL, like `postgresql://user:password@localhost:5432/dbname`.

    The `url` option is only used by the migration engine to connect to the database. The ORM runtime doesn't rely on it. Instead, you provide the connection information when constructing an ORM client.

-  **`directUrl`**:

    Optional. Connection URL for direct connection to the database.

    If you use a connection pooler URL in the url argument, Prisma CLI commands that require a direct connection to the database use the URL in the directUrl argument. This option is passed through to Prisma Migrate for database migrations.

-  **`defaultSchema`**:

    Optional. (PostgreSQL only) The default schema to use for models that don't have an explicit `@@schema` attribute. Defaults to "public". See [Working With PostgreSQL Schemas](../../recipe/postgres-multi-schema.md) for more details.

-  **`schemas`**:

    Optional. (PostgreSQL only) List of schemas to use. If specified, you can use the `@@schema` attribute to specify the schema name for a model. See [Working With PostgreSQL Schemas](../../recipe/postgres-multi-schema.md) for more details.

## Example

```zmodel
datasource db {
    provider = 'postgresql'
    url      = env('DATABASE_URL')
}
```

```zmodel
datasource db {
    provider = 'sqlite'
    url      = 'file:./dev.db'
}
```
