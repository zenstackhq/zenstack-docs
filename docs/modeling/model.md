---
sidebar_position: 3
description: Models in ZModel
---

# Model

The `model` construct is the core of ZModel. It defines the structure of your data and relations. A model represents a domain entity and is backed by a database table.

## Defining models

A typical model looks like this:

```zmodel
model User {
    id        Int      @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    email     String   @unique
    name      String
}
```

The simplest models are just a collection of fields. A model must be uniquely identifiable by some of its fields. In most cases, you'll have a field marked with the `@id` attribute (more about [attributes](./attribute) later). 

```zmodel
model User {
    // highlight-next-line
    id Int @id
}
```

If your model needs a composite ID, you can use the `@@id` model-level attribute to specify it:

```zmodel
model City {
    country String
    name    String
    // highlight-next-line
    @@id([country, name])
}
```

If no `@id` or `@@id` is specified, the ORM will resort to using a field (or fields) marked with the `@unique` or `@@unique` attribute as the identifier.

```zmodel
model User {
    // highlight-next-line
    email String @unique
}

model City {
    country String
    name    String
    // highlight-next-line
    @@unique([country, name])
}
```

## Model fields

Each model field must at least have a name and a type. A field can be typed in one of the following ways:

1. Built-in types, including:
   - String
   - Boolean
   - Int
   - BigInt
   - Float
   - Decimal
   - DateTime
   - Json
   - Bytes
   - Unsupported
  
   The `Unsupported` type is for defining fields of types not supported by the ORM. It lets the migration engine know how to create the field in the database.

   ```zmodel
   // from Prisma docs
   model Star {
       id       Int                    @id
       // highlight-next-line
       position Unsupported("circle")? @default(dbgenerated("'<(10,4),11>'::circle"))
   }
   ```

2. Enum
   
   We'll talk about [enums](./enum) later.

   ```zmodel
   enum Role {
       USER
       ADMIN
   }

   model User {
       id   Int  @id
       // highlight-next-line
       role Role
   }
   ```

3. Model
    
    It'll then form a relation. We'll cover that topic [later](./relation).

    ```zmodel
    model Post {
        id       Int  @id
        // highlight-next-line
        author   User @relation(fields: [authorId], references: [id])
        authorId Int
    }
    ```
4. Custom type
   
   ZenStack allows you to define custom types in the schema and use them to type JSON fields. This is covered in more detail in the [Custom Type](./custom-type) section.

   ```zmodel
   type Address {
       street  String
       city    String
       country String
       zip     Int
   }

   model User {
       id      Int     @id
       // highlight-next-line
       address Address @json
   }
   ```

A field can be set as optional by adding the `?` suffix to its type, or list by adding the `[]` suffix. However, a field cannot be both optional and a list at the same time.

```zmodel
model User {
    id   Int      @id
    // highlight-next-line
    name String?
    // highlight-next-line
    tags String[]
}
```

### Default values

A default value can be specified for a field with the `@default` attribute. The value can be a literal, an enum value, or a supported function call, including:

- [`now()`](../reference/zmodel/function.md#now): returns the current timestamp
- [`cuid()`](../reference/zmodel/function.md#cuid): returns a CUID
- [`uuid()`](../reference/zmodel/function.md#uuid): returns a UUID
- [`ulid()`](../reference/zmodel/function.md#ulid): returns a ULID
- [`nanoid()`](../reference/zmodel/function.md#nanoid): returns a Nano ID
- [`autoincrement()`](../reference/zmodel/function.md#autoincrement): returns an auto-incrementing integer (only for integer fields)
- [`dbgenerated("...")`](../reference/zmodel/function.md#dbgenerated): calls a native db function

```zmodel
model User {
    id        Int      @id @default(autoincrement())
    role      Role     @default(USER)
    createdAt DateTime @default(now())
}
```

Prefixing/suffixing entity IDs is becoming more common in database design, usually by including the model name in the generated ID. To support this pattern, functions that generate `String` ids (`cuid()`, `uuid()`, `ulid()`, `nanoid()`) takes an optional `format` argument to allow passing in a pattern that controls the output format. `%s` in the pattern will be replaced by the generated id. For example:

```zmodel
model User {
    // generate a UUID v4 with "user_" prefix
    id String @id @default(uuid(4, "user_%s"))
}
```

## Native type mapping

Besides giving a field a type, you can also specify the native database type to use with the `@db.` series of attributes.

```zmodel
model User {
    ...
    // highlight-next-line
    name String @db.VarChar(64)
}
```

These attributes control what data type is used when the [migration engine](../orm/migration.md) maps the schema to DDL. You can find a complete list of native type attributes in the [ZModel Language Reference](../reference/zmodel/attribute#native-type-mapping-attributes).

## Name mapping

Quite often, you want to use a different naming scheme for your models and fields than the database. You can achieve that with the `@map` and `@@map` attribute. The ORM respects the mapping when generating queries, and the migration engine uses it to generate the DDL.

```zmodel
model User {
    id Int @id @map('_id')    
    @@map('users')
}
```
