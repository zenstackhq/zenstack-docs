---
sidebar_position: 2
---

# Working With PostgreSQL Schemas

PostgreSQL has the concept of [Schema](https://www.postgresql.org/docs/current/ddl-schemas.html) that allows you to organize database objects into logical groups. This guide explains how to use multiple schemas in PostgreSQL with ZenStack.

Please note that the "Schema" term used in this guide refers specifically to the PostgreSQL concept, and has nothing to do with generic database schemas or the ZModel schema.

## Default Schema

By default, ZenStack assumes that all your models are in the default "public" schema and prepends table names with `public.` when generating SQL queries. You can change the default schema in the `datasource` block of ZModel:

```zmodel
datasource db {
  provider = 'postgresql'
  defaultSchema = 'my_schema'
}
```

:::info
If you're migrating from Prisma, you may have set the schema on the database url with the `?schema=` query parameter. This is not supported in ZenStack.
:::

## Using Multiple Schemas

If you use multiple Postgres schemas, you can add a `schemas` field to the datasource block, and then use the `@@schema` attribute to specify the schema to use for each model:

```zmodel
datasource db {
  provider = 'postgresql'
  schemas = ['auth', 'post']
}

model User {
  id Int @id @default(autoincrement())
  name String

  @@schema('auth')
}

model Post {
  id Int @id @default(autoincrement())
  title String

  @@schema('post')
}
```

For models that don't have the `@@schema` attribute, the default schema (either "public" or the one specified in `defaultSchema`) will be used.
