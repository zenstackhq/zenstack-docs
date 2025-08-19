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

    Name of the data source. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`. Name is only informational and serves no other purposes.

-   **`provider`**:

    Name of database connector. Valid values:

    -   sqlite
    -   postgresql

-   **`url`**:

    Database connection string. Either a plain string or an invocation of `env` function to fetch from an environment variable. For SQLite provider, the URL should be a file protocol, like `file:./dev.db`. For PostgreSQL provider, it should be a postgres connection string, like `postgresql://user:password@localhost:5432/dbname`.

    The `url` option is only used by the migration engine to connect to the database. The ORM runtime doesn't rely on it. Instead, you provide the connection information when constructing an ORM client.

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
