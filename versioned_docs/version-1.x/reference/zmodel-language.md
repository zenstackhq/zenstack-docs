---
description: ZModel language references
sidebar_position: 1
sidebar_label: ZModel Language
toc_max_heading_level: 3
---

# ZModel Language Reference

## Overview

**ZModel**, the modeling DSL of ZenStack, is the main concept you'll deal with when using this toolkit. The ZModel syntax is a superset of [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema). Therefore, every valid Prisma schema is a valid ZModel.

:::tip

We made that choice to extend the Prisma schema for several reasons:

-   Creating a new ORM adds little value to the community. Instead, extending Prisma - the overall best ORM toolkit for Typescript - sounds more sensible.

-   Prisma's schema language is simple and intuitive.

-   Extending an existing popular language lowers the learning curve compared to inventing a new one.

:::

However, the standard capability of Prisma schema doesn't allow us to build the functionalities we want in a natural way, so we made a few extensions to the language by adding the following:

1. Custom attributes
1. Custom attribute functions
1. Built-in attributes and functions for defining access policies
1. Built-in attributes for defining field validation rules
1. Utility attributes like `@password` and `@omit`
1. Multi-schema files support 

Some of these extensions have been asked for by the Prisma community for some time, so we hope that ZenStack can be helpful even just as an extensible version of Prisma.

This section provides detailed descriptions of all aspects of the ZModel language, so you don't have to jump over to Prisma's documentation for extra learning.

## Import 
ZModel allows to import other ZModel files. This is useful when you want to split your schema into multiple files for better organization. Under the hood, it will recursively merge all the imported schemas, and generate a single Prisma schema file for the Prisma CLI to consume.

### Syntax

```zmodel
import [IMPORT_SPECIFICATION]
```

- **[IMPORT_SPECIFICATION]**: 
    Path to the ZModel file to be imported. It can be:
    
    - An absolute path, e.g., "/path/to/user".
    - A relative path, e.g., "./user".
    - A module resolved to an installed NPM package, e.g., "my-package/base".

    If the import specification doesn't end with ".zmodel", the resolver will automatically append it. Once a file is imported, all the declarations in that file will be included in the building process.

### Examples

```zmodel
// there is a file called "user.zmodel" in the same directory
import "user"
```


## Data source

Every model needs to include exactly one `datasource` declaration, providing information on how to connect to the underlying database.

### Syntax

```zmodel
datasource [NAME] {
    provider = [PROVIDER]
    url = [DB_URL]
}
```

-   **[NAME]**:

    Name of the data source. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`. Name is only informational and serves no other purposes.

-   **[PROVIDER]**:

    Name of database connector. Valid values:

    -   sqlite
    -   postgresql
    -   mysql
    -   sqlserver
    -   cockroachdb

-   **[DB_URL]**:

    Database connection string. Either a plain string or an invocation of `env` function to fetch from an environment variable.

### Examples

```zmodel
datasource db {
    provider = "postgresql"
    url = "postgresql://postgres:abc123@localhost:5432/todo?schema=public"
}
```

It's highly recommended that you not commit sensitive database connection strings into source control. Alternatively, you can load it from an environment variable:

```zmodel
datasource db {
    provider = "postgresql"
    url = env("DATABASE_URL")
}
```

### Supported databases

ZenStack uses [Prisma](https://prisma.io ':target=_blank') to talk to databases, so all relational databases supported by Prisma are also supported by ZenStack.

Here's a list for your reference:

| Database              | Version |
| --------------------- | ------- |
| PostgreSQL            | 9.6     |
| PostgreSQL            | 10      |
| PostgreSQL            | 11      |
| PostgreSQL            | 12      |
| PostgreSQL            | 13      |
| PostgreSQL            | 14      |
| PostgreSQL            | 15      |
| MySQL                 | 5.6     |
| MySQL                 | 5.7     |
| MySQL                 | 8       |
| MariaDB               | 10      |
| SQLite                | \*      |
| AWS Aurora            | \*      |
| AWS Aurora Serverless | \*      |
| Microsoft SQL Server  | 2022    |
| Microsoft SQL Server  | 2019    |
| Microsoft SQL Server  | 2017    |
| Azure SQL             | \*      |
| CockroachDB           | 21.2.4+ |

You can find the orignal list [here](https://www.prisma.io/docs/reference/database-reference/supported-databases ':target=_blank').

## Generator

Generators are used for creating assets (usually code) from a Prisma schema. Check [here](https://www.prisma.io/docs/concepts/components/prisma-schema/generators) for a list of official and community generators.

### Syntax

```zmodel
generator [GENERATOR_NAME] {
    [OPTION]*
}
```

-   **[GENERATOR_NAME]**

    Name of the generator. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[OPTION]**

    A generator configuration option, in form of "[NAME] = [VALUE]". A generator needs to have at least a "provider" option that specify its provider.

### Example

```zmodel
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client-js"
```

## Plugin

Plugins are ZenStack's extensibility mechanism. It's usage is similar to [Generator](#generator). Users can define their own plugins to generate artifacts from the ZModel schema. Plugins differ from generators mainly in the following ways:

-   They have a cleaner interface without the complexity of JSON-RPC.
-   They use an easier-to-program AST representation than generators.
-   They have access to language features that ZenStack adds to Prisma, like custom attributes and functions.

### Syntax

```zmodel
plugin [PLUGIN_NAME] {
    [OPTION]*
}
```

-   **[PLUGIN_NAME]**

    Name of the plugin. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[OPTION]**

    A plugin configuration option, in form of "[NAME] = [VALUE]". A plugin needs to have at least a "provider" option that specify its provider.

### Example

```zmodel
plugin swr {
    provider = '@zenstackhq/swr'
    output = 'lib/hooks'
}
```

## Enum

Enums are container declarations for grouping constant identifiers. You can use them to express concepts like user roles, product categories, etc.

### Syntax

```prsima
enum [ENUM_NAME] {
    [FIELD]*
}
```

-   **[ENUM_NAME]**

    Name of the enum. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[FIELD]**

    Field identifier. Needs to be unique in the model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

### Example

```zmodel
enum UserRole {
    USER
    ADMIN
}
```

## Model

Models represent the business entities of your application. A model inherits all fields and attributes from extended abstract models. Abstract models are eliminated in the generated prisma schema file. 

### Syntax
```zmodel
(abstract)? model [NAME] (extends [ABSTRACT_MODEL_NAME](,[ABSTRACT_MODEL_NAME])*)? {
    [FIELD]*
}
```
-  **[abstract]**:

    Optional. If present, the model is marked as abstract would not be mapped to a database table. Abstract models are only used as base classes for other models.
-   **[NAME]**:

    Name of the model. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[FIELD]**:

    Arbitrary number of fields. See [next section](#field) for details.

-   **[ABSTRACT_MODEL_NAME]**:
    
    Name of an abstract model. 

### Note

A model must include a field marked with `@id` attribute. The `id` field serves as a unique identifier for a model entity and is mapped to the database table's primary key.

See [here](/docs/reference/zmodel-language#attribute) for more details about attributes.

### Example

```zmodel
abstract model Basic {
    id String @id
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model User extends Basic {
    name String 
}
```

The generated prisma file only contains one `User` model:
```zmodel
model User {
    id String @id
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    name String @id
}
```


## Attribute

Attributes decorate fields and models and attach extra behaviors or constraints to them.

### Syntax

#### Field attribute

Field attribute name is prefixed by a single `@`.

```zmodel
id String @[ATTR_NAME](ARGS)?
```

-   **[ATTR_NAME]**

Attribute name. See [below](#predefined-attributes) for a full list of attributes.

-   **[ARGS]**

See [attribute arguments](#arguments).

#### Model attribute

Field attribute name is prefixed double `@@`.

```zmodel
model Model {
    @@[ATTR_NAME](ARGS)?
}
```

-   **[ATTR_NAME]**

Attribute name. See [below](#predefined-attributes) for a full list of attributes.

-   **[ARGS]**

See [attribute arguments](#arguments).

### Arguments

Attribute can be declared with a list of parameters and applied with a comma-separated list of arguments.

Arguments are mapped to parameters by position or by name. For example, for the `@default` attribute declared as:

```zmodel
attribute @default(_ value: ContextType)
```

, the following two ways of applying it are equivalent:

```zmodel
published Boolean @default(value: false)
```

```zmodel
published Boolean @default(false)
```

### Parameter types

Attribute parameters are typed. The following types are supported:

-   Int

    Integer literal can be passed as argument.

    E.g., declaration:

    ```zmodel
    attribute @password(saltLength: Int?, salt: String?)

    ```

    application:

    ```zmodel
    password String @password(saltLength: 10)
    ```

-   String

    String literal can be passed as argument.

    E.g., declaration:

    ```zmodel
    attribute @id(map: String?)
    ```

    application:

    ```zmodel
    id String @id(map: "_id")
    ```

-   Boolean

    Boolean literal or expression can be passed as argument.

    E.g., declaration:

    ```zmodel
    attribute @@allow(_ operation: String, _ condition: Boolean)
    ```

    application:

    ```zmodel
    @@allow("read", true)
    @@allow("update", auth() != null)
    ```

-   ContextType

    A special type that represents the type of the field onto which the attribute is attached.

    E.g., declaration:

    ```zmodel
    attribute @default(_ value: ContextType)
    ```

    application:

    ```zmodel
    f1 String @default("hello")
    f2 Int @default(1)
    ```

-   FieldReference

    References to fields defined in the current model.

    E.g., declaration:

    ```zmodel
    attribute @relation(
        _ name: String?,
        fields: FieldReference[]?,
        references: FieldReference[]?,
        onDelete: ReferentialAction?,
        onUpdate: ReferentialAction?,
        map: String?)
    ```

    application:

    ```zmodel
    model Model {
        ...
        // [ownerId] is a list of FieldReference
        owner Owner @relation(fields: [ownerId], references: [id])
        ownerId
    }
    ```

-   Enum

    Attribute parameter can also be typed as predefined enum.

    E.g., declaration:

    ```zmodel
    attribute @relation(
        _ name: String?,
        fields: FieldReference[]?,
        references: FieldReference[]?,
        // ReferentialAction is a predefined enum
        onDelete: ReferentialAction?,
        onUpdate: ReferentialAction?,
        map: String?)
    ```

    application:

    ```zmodel
    model Model {
        // 'Cascade' is a predefined enum value
        owner Owner @relation(..., onDelete: Cascade)
    }
    ```

An attribute parameter can be typed as any of the types above, a list of the above type, or an optional of the types above.

```zmodel
    model Model {
        ...
        f1 String
        f2 String
        // a list of FieldReference
        @@unique([f1, f2])
    }
```

### Attribute functions

Attribute functions are used for providing values for attribute arguments, e.g., current `DateTime`, an autoincrement `Int`, etc. They can be used in place of attribute arguments, like:

```zmodel
model Model {
    ...
    serial Int @default(autoincrement())
    createdAt DateTime @default(now())
}
```

You can find a list of predefined attribute functions [here](#predefined-attribute-functions).

### Predefined attributes

#### Field attributes

##### @id

```zmodel
attribute @id(map: String?)
```

Defines an ID on the model.

_Params_:

| Name | Description                                                       |
| ---- | ----------------------------------------------------------------- |
| map  | The name of the underlying primary key constraint in the database |

##### @default

```zmodel
attribute @default(_ value: ContextType)
```

Defines a default value for a field.

_Params_:

| Name  | Description                  |
| ----- | ---------------------------- |
| value | The default value expression |

##### @unique

```zmodel
attribute @unique(map: String?)
```

Defines a unique constraint for this field.

_Params_:

| Name | Description                                                       |
| ---- | ----------------------------------------------------------------- |
| map  | The name of the underlying primary key constraint in the database |

##### @relation

```zmodel
attribute @relation(
    _ name: String?,
    fields: FieldReference[]?, 
    references: FieldReference[]?, 
    onDelete: ReferentialAction?,
    onUpdate: ReferentialAction?,
    map: String?)
```

Defines meta information about a relation.

_Params_:

| Name       | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| name       | The name of the relationship                                                   |
| fields     | A list of fields defined in the current model                                  |
| references | A list of fields of the model on the other side of the relation                |
| onDelete   | Referential action to take on delete. See details [here](#referential-action). |
| onUpdate   | Referential action to take on update. See details [here](#referential-action). |

##### @map

```zmodel
attribute @map(_ name: String)
```

Maps a field name or enum value from the schema to a column with a different name in the database.

_Params_:

| Name | Description                                       |
| ---- | ------------------------------------------------- |
| map  | The name of the underlying column in the database |

##### @updatedAt

```zmodel
attribute @updatedAt()
```

Automatically stores the time when a record was last updated.

##### @ignore

```zmodel
attribute @ignore()
```

Exclude a field from the Prisma Client (for example, a field that you do not want Prisma users to update).

##### @allow

```zmodel
attribute @allow(_ operation: String, _ condition: Boolean)
```

Defines an access policy that allows the annotated field to be read or updated. Read more about access policies [here](#access-policy).

_Params_:

| Name      | Description                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| operation | Comma separated list of operations to control, including `"read"` and `"update"`. Pass` "all"` as an abbreviation for including all operations. |
| condition | Boolean expression indicating if the operations should be allowed                                                                                                        |

##### @deny

```zmodel
attribute @deny(_ operation: String, _ condition: Boolean)
```

Defines an access policy that denies the annotated field to be read or updated. Read more about access policies [here](#access-policy).

_Params_:

| Name      | Description                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| operation | Comma separated list of operations to control, including `"read"` and `"update"`. Pass` "all"` as an abbreviation for including all operations. |
| condition | Boolean expression indicating if the operations should be denied       

##### @password

```zmodel
attribute @password(saltLength: Int?, salt: String?)
```

Indicates that the field is a password field and needs to be hashed before persistence.

_NOTE_: ZenStack uses the "bcryptjs" library to hash passwords. You can use the `saltLength` parameter to configure the cost of hashing or use `salt` parameter to provide an explicit salt. By default, a salt length of 12 is used. See [here](https://www.npmjs.com/package/bcryptjs ':target=blank') for more details.

_Params_:

| Name       | Description                                                   |
| ---------- | ------------------------------------------------------------- |
| saltLength | The length of salt to use (cost factor for the hash function) |
| salt       | The salt to use (a pregenerated valid salt)                   |

##### @omit

```zmodel
attribute @omit()
```

Indicates that the field should be omitted when read from the generated services. Commonly used together with `@password` attribute.

##### @prisma.passthrough

```zmodel
attribute @prisma.passthrough(_ text: String)
```

A utility attribute for passing arbitrary text to the generated Prisma schema. This is useful as a workaround for dealing with discrepancies between Prisma schema and ZModel.

_Params_:

| Name | Description                          |
| ---- | ------------------------------------ |
| text | Text to passthrough to Prisma schema |

E.g., the following ZModel content:

```zmodel
model User {
    id Int @id @default(autoincrement())
    name String @prisma.passthrough("@unique")
}
```

wil be translated to the following Prisma schema:

```zmodel
model User {
    id Int @id @default(autoincrement())
    name String @unique
}
```

#### Model attributes

##### @@id

```zmodel
attribute @@id(_ fields: FieldReference[], name: String?, map: String?)
```

Defines a multi-field ID (composite ID) on the model.

_Params_:

| Name   | Description                                                                   |
| ------ | ----------------------------------------------------------------------------- |
| fields | A list of fields defined in the current model                                 |
| name   | The name that the Client API will expose for the argument covering all fields |
| map    | The name of the underlying primary key constraint in the database             |

##### @@unique

```zmodel
attribute @@unique(_ fields: FieldReference[], name: String?, map: String?)
```

Defines a compound unique constraint for the specified fields.

_Params_:

| Name   | Description                                                  |
| ------ | ------------------------------------------------------------ |
| fields | A list of fields defined in the current model                |
| name   | The name of the unique combination of fields                 |
| map    | The name of the underlying unique constraint in the database |

##### @@schema

```zmodel
attribute @@schema(_ name: String)
```

Specifies the database schema to use in a [multi-schema setup](https://www.prisma.io/docs/guides/database/multi-schema).

_Params_:

| Name | Description                     |
| ---- | ------------------------------- |
| name | The name of the database schema |

##### @@index

```zmodel
attribute @@index(_ fields: FieldReference[], map: String?)
```

Defines an index in the database.

_Params_:

| Name   | Description                                      |
| ------ | ------------------------------------------------ |
| fields | A list of fields defined in the current model    |
| map    | The name of the underlying index in the database |

##### @@map

```zmodel
attribute @@map(_ name: String)
```

Maps the schema model name to a table with a different name, or an enum name to a different underlying enum in the database.

_Params_:

| Name | Description                                              |
| ---- | -------------------------------------------------------- |
| name | The name of the underlying table or enum in the database |

##### @@ignore

```zmodel
attribute @@ignore()
```

Exclude a model from the Prisma Client (for example, a model that you do not want Prisma users to update).

##### @@allow

```zmodel
attribute @@allow(_ operation: String, _ condition: Boolean)
```

Defines an access policy that allows a set of operations when the given condition is true. Read more about access policies [here](#access-policy).

_Params_:

| Name      | Description                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbriviation for including all operations. |
| condition | Boolean expression indicating if the operations should be allowed                                                                                                        |

##### @@deny

```zmodel
attribute @@deny(_ operation: String, _ condition: Boolean)
```

Defines an access policy that denies a set of operations when the given condition is true. Read more about access policies [here](#access-policy).

_Params_:

| Name      | Description                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbriviation for including all operations. |
| condition | Boolean expression indicating if the operations should be denied                                                                                                         |

##### @@auth

```zmodel
attribute @@auth()
```

Specify the model for resolving `auth()` function call in access policies. By default, the model named "User" is used. You can use this attribute to override the default behavior. A Zmodel can have at most one model with this attribute. 

##### @@prisma.passthrough

```zmodel
attribute @@prisma.passthrough(_ text: String)
```

A utility attribute for passing arbitrary text to the generated Prisma schema. This is useful as a workaround for dealing with discrepancies between Prisma schema and ZModel.

_Params_:

| Name | Description                          |
| ---- | ------------------------------------ |
| text | Text to passthrough to Prisma schema |

E.g., the following ZModel content:

```zmodel
model User {
    id Int @id @default(autoincrement())
    name String
    @@prisma.passthrough("@@unique([name])")
}
```

wil be translated to the following Prisma schema:

```zmodel
model User {
    id Int @id @default(autoincrement())
    name String
    @@unique([name])
}
```

### Predefined attribute functions

##### uuid()

```zmodel
function uuid(): String {}
```

Generates a globally unique identifier based on the UUID spec.

##### cuid()

```zmodel
function cuid(): String {}
```

Generates a globally unique identifier based on the [CUID](https://github.com/ericelliott/cuid) spec.

##### now()

```zmodel
function now(): DateTime {}
```

Gets current date-time.

##### autoincrement()

```zmodel
function autoincrement(): Int {}
```

Creates a sequence of integers in the underlying database and assign the incremented
values to the ID values of the created records based on the sequence.

##### dbgenerated()

```zmodel
function dbgenerated(expr: String): Any {}
```

Represents default values that cannot be expressed in the Prisma schema (such as random()).

##### auth()

```zmodel
function auth(): User {}
```

Gets the current login user. The return type of the function is the `User` model defined in the current ZModel.

##### future()

```zmodel
function future(): Any {}
```

Gets the "post-update" state of an entity. Only valid when used in a "update" access policy. Read more about access policies [here](#access-policy).

##### contains()

```zmodel
    function contains(field: String, search: String, caseInSensitive: Boolean?): Boolean {}
```

Checks if the given field contains the search string. The search string is case-sensitive by default. Use `caseInSensitive` to toggle the case sensitivity.

Equivalent to Prisma's [contains](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#contains) operator.

##### search()

```zmodel
function search(field: String, search: String): Boolean {}
```

Checks if the given field contains the search string using [full-text-search](https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search).

Equivalent to Prisma's [search](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#search) operator.

##### startsWith()

```zmodel
function startsWith(field: String, search: String): Boolean {}
```

Checks if the given field starts with the search string.

Equivalent to Prisma's [startsWith](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#startswith) operator.

##### endsWith()

```zmodel
function endsWith(field: String, search: String): Boolean {}
```

Checks if the given field ends with the search string.

Equivalent to Prisma's [endsWith](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#endswith) operator.

##### has()

```zmodel
function has(field: Any[], search: Any): Boolean {}
```

Check if the given field (list) contains the search value.

Equivalent to Prisma's [has](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#has) operator.

##### hasEvery()

```zmodel
function hasEvery(field: Any[], search: Any[]): Boolean {}
```

Check if the given field (list) contains every element of the search list.

Equivalent to Prisma's [hasEvery](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#hasevery) operator.

##### hasSome

```zmodel
function hasSome(field: Any[], search: Any[]): Boolean {}
```

Check if the given field (list) contains at least one element of the search list.

Equivalent to Prisma's [hasSome](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#hassome) operator.

##### isEmpty

```zmodel
function isEmpty(field: Any[]): Boolean {}
```

Check if the given field (list) is empty.

Equivalent to Prisma's [isEmpty](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#isempty) operator.

### Examples

Here're some examples on using field and model attributes:

```zmodel
model User {
    // unique id field with a default UUID value
    id String @id @default(uuid())

    // require email field to be unique
    email String @unique

    // password is hashed with bcrypt with length of 16, omitted when returned from the CRUD services
    password String @password(saltLength: 16) @omit

    // default to current date-time
    createdAt DateTime @default(now())

    // auto-updated when the entity is modified
    updatedAt DateTime @updatedAt

    // mapping to a different column name in database
    description String @map("desc")

    // mapping to a different table name in database
    @@map("users")

    // use @@index to specify fields to create database index for
    @@index([email])

    // use @@allow to specify access policies
    @@allow("create,read", true)

    // use auth() to reference the current user
    // use future() to access the "post-update" state
    @@allow("update", auth() == this && future().email == email)
}
```

### Custom attributes and functions

You can find examples of custom attributes and functions in [ZModel Standard Library](https://github.com/zenstackhq/zenstack/blob/main/packages/schema/src/res/stdlib.zmodel).

## Field

Fields are typed members of models.

### Syntax

```zmodel
model Model {
    [FIELD_NAME] [FIELD_TYPE] (FIELD_ATTRIBUTES)?
}
```

-   **[FIELD_NAME]**

    Name of the field. Needs to be unique in the containing model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[FIELD_TYPE]**

    Type of the field. Can be a scalar type or a reference to another model.

    The following scalar types are supported:

    -   String
    -   Boolean
    -   Int
    -   BigInt
    -   Float
    -   Decimal
    -   Json
    -   Bytes
    -   [Unsupported types](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#unsupported-types)

    A field's type can be any of the scalar or reference type, a list of the aforementioned type (suffixed with `[]`), or an optional of the aforementioned type (suffixed with `?`).

-   **[FIELD_ATTRIBUTES]**

    Field attributes attach extra behaviors or constraints to the field. See [Attribute](#attribute) for more information.

### Example

```zmodel
model Post {
    // "id" field is a mandatory unique identifier of this model
    id String @id @default(uuid())

    // fields can be DateTime
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    // or string
    title String

    // or integer
    viewCount Int @default(0)

    // and optional
    content String?

    // and a list too
    tags String[]

    // and can reference another model too
    comments Comment[]
}
```

## Relation

Relations are connections among models. There're three types of relations:

-   One-to-one
-   One-to-many
-   Many-to-many

Relations are expressed with a pair of fields and together with the special `@relation` field attribute. One side of the relation field carries the `@relation` attribute to indicate how the connection is established.

### One-to-one relation

The _owner_ side of the relation declares an optional field typed as the model of the _owned_ side of the relation.

On the _owned_ side, a reference field is declared with `@relation` attribute, together with a **foreign key** field storing the id of the owner entity.

```zmodel
model User {
    id String @id
    profile Profile?
}

model Profile {
    id String @id
    user User @relation(fields: [userId], references: [id])
    userId String @unique
}
```

### One-to-many relation

The _owner_ side of the relation declares a list field typed as the model of the _owned_ side of the relation.

On the _owned_ side, a reference field is declared with `@relation` attribute, together with a **foreign key** field storing the id of the owner entity.

```zmodel
model User {
    id String @id
    posts Post[]
}

model Post {
    id String @id
    author User? @relation(fields: [authorId], references: [id])
    authorId String?
}
```

### Many-to-many relation

A _join model_ is declared to connect the two sides of the relation using two one-to-one relations.

Each side of the relation then establishes a one-to-many relation with the _join model_.

```zmodel
model Space {
    id String @id
    // one-to-many with the "join-model"
    members Membership[]
}

// Membership is the "join-model" between User and Space
model Membership {
    id String @id()

    // one-to-many from Space
    space Space @relation(fields: [spaceId], references: [id])
    spaceId String

    // one-to-many from User
    user User @relation(fields: [userId], references: [id])
    userId String

    // a user can be member of a space for only once
    @@unique([userId, spaceId])
}

model User {
    id String @id
    // one-to-many with the "join-model"
    membership Membership[]
}

```

### Self-relations

A relation field referencing its own model is called "self-relation". ZModel's represents self-relation in the same way as Prisma does. Please refer to the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations) for more details.

### Referential action

When defining a relation, you can specify what happens when one side of a relation is updated or deleted. See [Referential action](/docs/reference/zmodel-language#referential-action) for details.

## Access policy

### Model-level policy

Model-level access policies are defined with `@@allow` and `@@deny` attributes. They specify the eligibility of an operation over a model entity. The signatures of the attributes are:

-   `@@allow`

    ```zmodel
        attribute @@allow(_ operation: String, _ condition: Boolean)
    ```

    _Params_:

    | Name      | Description                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbreviation for including all operations. |
    | condition | Boolean expression indicating if the operations should be allowed                                                                                                        |

-   `@@deny`

    ```zmodel
        attribute @@deny(_ operation: String, _ condition: Boolean)
    ```

    _Params_:

    | Name      | Description                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbreviation for including all operations. |
    | condition | Boolean expression indicating if the operations should be denied                                                                                                         |

### Field-level policy

Field-level access policies are defined with `@allow` and `@deny` attributes. They control whether the annotated field can be read or updated. If a field fails "read" check, it'll be deleted when returned. If a field is set to be updated but fails "update" check, the update operation will be rejected.

Note that it's not allowed to put "update" rule on relation fields, because whether an entity can be updated shouldn't be determined indirectly by a relation, but directly by the entity itself. However, you can put "update" rule on a foreign key field to control how a a relation can be updated.

The signatures of the attributes are:

-   `@allow`

    ```zmodel
        attribute @allow(_ operation: String, _ condition: Boolean, _ override: Boolean?)
    ```

    _Params_:

    | Name      | Description                                                                                                                                                              | Default |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
    | operation | Comma separated list of operations to control, including `"read"` and `"update"`. Pass` "all"` as an abbreviation for including all operations.                          |         |
    | condition | Boolean expression indicating if the operations should be allowed                                                                                                        |         |
    | override  | Boolean indicating if the field-level policy should override model-level ones. See [here](/docs/the-complete-guide/part1/access-policy/field-level#overriding-model-level-policies) for more details. | false   |

-   `@deny`

    ```zmodel
        attribute @deny(_ operation: String, _ condition: Boolean)
    ```

    _Params_:

    | Name      | Description                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | operation | Comma separated list of operations to control, including ``"read"` and `"update"`. Pass` "all"` as an abbreviation for including all operations. |
    | condition | Boolean expression indicating if the operations should be denied                                                                                                         |

### Policy expressions

Policy rules use boolean expressions to make verdicts. ZModel provides a set of literals and operators for constructing expressions of arbitrary complexity.

```

Expression ::= Literal | Array | This | Null | Reference | MemberAccess | Invocation | Binary | Unary | CollectionPredicate

Literal ::= String | Number | Boolean

Array ::= "[" Expression [, Expression]* "]"

This ::= "this"

Null ::= "null"

Reference ::= Identifier

MemberAccess ::= Expression "." Identifier

Operator_Precedence#table
Binary ::= Expression ("==" | "!=" | ">" | "<" | ">=" | "<=" | "&&" | "||" || "in")

Unary ::= "!" Expression

CollectionPredicate ::= Expression ("?" | "!" | "^") "[" Expression "]"

```

Binary operator precedence follows [Javascript's rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/).

Collection predicate expressions are used for reaching into relation fields. You can find more details [here](#collection-predicate-expressions).

### Using authentication in policy rules

It's very common to use the current login user to verdict if an operation should be permitted. Therefore, ZenStack provides a built-in `auth()` attribute function that evaluates to the `User` entity corresponding to the current user. To use the function, your ZModel file must define a `User` model or a model marked with the `@@auth` attribute.

You can use `auth()` to:

-   Check if a user is logged in

    ```zmodel
    @@deny('all', auth() == null)
    ```

-   Access user's fields

    ```zmodel
    @@allow('update', auth().role == 'ADMIN')
    ```

-   Compare user identity

    ```zmodel
    // owner is a relation field to User model
    @@allow('update', auth() == owner)
    ```

### Accessing relation fields in policy

As you've seen in the examples above, you can access fields from relations in policy expressions. For example, to express "a user can be read by any user sharing a space" in the `User` model, you can directly read into its `membership` field.

```zmodel
    @@allow('read', membership?[space.members?[user == auth()]])
```

In most cases, when you use a "to-many" relation in a policy rule, you'll use "Collection Predicate" to express a condition. See [next section](#collection-predicate-expressions) for details.

### Collection predicate expressions

Collection predicate expressions are boolean expressions used to express conditions over a list. It's mainly designed for building policy rules for "to-many" relations. It has three forms of syntaxes:

-   Any

    ```
    <collection>?[condition]
    ```

    Any element in `collection` matches `condition`

-   All

    ```
    <collection>![condition]
    ```

    All elements in `collection` match `condition`

-   None

    ```
    <collection>^[condition]
    ```

    None element in `collection` matches `condition`

The `condition` expression has direct access to fields defined in the model of `collection`. E.g.:

```zmodel
    @@allow('read', members?[user == auth()])
```

, in condition `user == auth()`, `user` refers to the `user` field in model `Membership`, because the collection `members` is resolved to `Membership` model.

Also, collection predicates can be nested to express complex conditions involving multi-level relation lookup. E.g.:

```zmodel
    @@allow('read', membership?[space.members?[user == auth()]])
```

In this example, `user` refers to `user` field of `Membership` model because `space.members` is resolved to `Membership` model.

### Combining multiple rules

A model can contain an arbitrary number of policy rules. The logic of combining model-level rules is as follows:

-   The operation is rejected if any of the conditions in `@@deny` rules evaluate to `true`.
-   Otherwise, the operation is permitted if any of the conditions in `@@allow` rules evaluate to `true`.
-   Otherwise, the operation is rejected.

A field can also contain an arbitrary number of policy rules. The logic of combining field-level rules is as follows:

-   The operation is rejected if any of the conditions in `@deny` rules evaluate to `true`.
-   Otherwise, if there exists any `@allow` rule and at least one of them evaluates to `true`, the operation is permitted.
-   Otherwise, if there exists any `@allow` rule but none one of them evaluates to `true`, the operation is rejected.
-   Otherwise, the operation is permitted.

Please note the difference between model-level and field-level rules. Model-level access are by-default denied, while field-level access are by-default allowed.

### Pre-update vs. post-update

When an access policy rule is applied to a mutate operation, the entities under operation have a "pre" and "post" state. For a "create" rule, its "pre" state is empty, so the rule implicitly refers to the "post" state. For a "delete" rule, its "post" state is empty, so the rule implicitly refers to the "pre" state.

However, for "update" rules it is ambiguous; both the "pre" and the "post" states exist. By default, for "update" rules, fields referenced in the expressions refer to the "pre" state, and you can use the `future()` function to refer to the "post" state explicitly.

In the following example, the "update" rule uses `future()` to ensure an update cannot alter the post's owner.

```zmodel
model Post {
    id String @id @default(uuid())
    title String @length(1, 100)
    author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
    authorId String

    // update can only be done by the author, and is not allowed to change author
    @@allow('update', author == auth() && future().author == author)
}
```

:::info
The `future()` function is not supported in field-level access policies. To express post-update rules, put them into model-level policies.
:::

### Examples

#### A simple example with Post model

```zmodel
model Post {
    // reject all operations if user's not logged in
    @@deny('all', auth() == null)

    // allow all operations if the entity's owner matches the current user
    @@allow('all', auth() == owner)

    // posts are readable to anyone
    @allow('read', true)
}
```

#### A more complex example with multi-user spaces

```zmodel
model Space {
    id String @id
    members Membership[]
    owner User @relation(fields: [ownerId], references: [id])
    ownerId String

    // require login
    @@deny('all', auth() == null)

    // everyone can create a space
    @@allow('create', true)

    // owner can do everything
    @@allow('all', auth() == owner)

    // any user in the space can read the space
    //
    // Here the <collection>?[condition] syntax is called
    // "Collection Predicate", used to check if any element
    // in the "collection" matches the "condition"
    @@allow('read', members?[user == auth()])
}

// Membership is the "join-model" between User and Space
model Membership {
    id String @id()

    // one-to-many from Space
    space Space @relation(fields: [spaceId], references: [id])
    spaceId String

    // one-to-many from User
    user User @relation(fields: [userId], references: [id])
    userId String

    // a user can be member of a space for only once
    @@unique([userId, spaceId])

    // require login
    @@deny('all', auth() == null)

    // space owner can create/update/delete
    @@allow('create,update,delete', space.owner == auth())

    // user can read entries for spaces which he's a member of
    @@allow('read', space.members?[user == auth()])
}

model User {
    id String @id
    email String @unique
    membership Membership[]
    ownedSpaces Space[]

    // allow signup
    @@allow('create', true)

    // user can do everything to herself; note that "this" represents
    // the current entity
    @@allow('all', auth() == this)

    // can be read by users sharing a space
    @@allow('read', membership?[space.members?[user == auth()]])
}

```

## Data validation

### Overview

Data validation is used for attaching constraints to field values. Unlike access policies, field validation rules cannot access the current user with the `auth()` function and are only checked for 'create' and 'update' operations. The main purpose of field validation is to ensure data integrity and consistency, not for access control.

The [`@core/zod`](/docs/reference/plugins/zod) plugin recognizes the validation attributes and includes them into the generated Zod schemas.

### Field-level validation attributes

The following attributes can be used to attach validation rules to individual fields:

#### String

-   `@length(_ min: Int?, _ max: Int?, _ message: String?)`

    Validates length of a string field.

-   `@startsWith(_ text: String, _ message: String?)`

    Validates a string field value starts with the given text.

-   `@endsWith(_ text: String, _ message: String?)`

    Validates a string field value ends with the given text.

-   `@contains(_text: String, _ message: String?)`

    Validates a string field value contains the given text.

-   `@email(_ message: String?)`

    Validates a string field value is a valid email address.

-   `@url(_ message: String?)`

    Validates a string field value is a valid url.

-   `@datetime(_ message: String?)`

    Validates a string field value is a valid ISO datetime.

-   `@regex(_ regex: String, _ message: String?)`

    Validates a string field value matches a regex.

-   `@trim(_ value: String)`

    Trims whitespace.

-   `@lower(_ value: String)`

    Converts to lowercase.

-   `@upper(_ value: String)`

    Converts to uppercase.

:::info
Attributes `@trim`, `@lower`, and `@upper` are actually "transformation" instead of "validation". They make sure the values are transformed before storing into the database.
:::

#### Number

-   `@gt(_ value: Int, _ message: String?)`

    Validates a number field is greater than the given value.

-   `@gte(_ value: Int, _ message: String?)`

    Validates a number field is greater than or equal to the given value.

-   `@lt(_ value: Int, _ message: String?)`

    Validates a number field is less than the given value.

-   `@lte(_ value: Int, _ message: String?)`

    Validates a number field is less than or equal to the given value.

### Model-level validation attributes

You can use the `@@validate` attribute to attach validation rules to a model. 

```
@@validate(_ value: Boolean, _ message: String?)
```

Model-level rules can reference multiple fields, use relation operators (`==`, `!=`, `>`, `>=`, `<`, `<=`) to compare fields, use boolean operators (`&&`, `||`, and `!`) to compose conditions, and can use the following functions to evaluate conditions for fields:

-   `function length(field: String, min: Int, max: Int?): Boolean`

    Validates length of a string field.

-   `function regex(field: String, regex: String): Boolean`

    Validates a string field value matches a regex.

-   `function email(field: String): Boolean`

    Validates a string field value is a valid email address.

-   `function datetime(field: String): Boolean`

    Validates a string field value is a valid ISO datetime.

-   `function url(field: String)`

    Validates a string field value is a valid url.

-   `function contains(field: String, search: String, caseInSensitive: Boolean?): Boolean`

    Validates a string field contains the search string.

-   `function startsWith(field: String, search: String): Boolean`

    Validates a string field starts with the search string.

-   `function endsWith(field: String, search: String): Boolean`

    Validates a string field ends with the search string.

-   `function has(field: Any[], search: Any): Boolean`

    Validates a list field contains the search value.

-   `function hasEvery(field: Any[], search: Any[]): Boolean`

    Validates a list field contains every element in the search list.

-   `function hasSome(field: Any[], search: Any[]): Boolean`

    Validates a list field contains some elements in the search list.

-   `function isEmpty(field: Any[]): Boolean`

    Validates a list field is null or empty.

### Example

```zmodel
model User {
    id String @id
    handle String @regex("^[0-9a-zA-Z]{4,16}$")
    email String? @email @endsWith("@myorg.com", "must be an email from myorg.com")
    profileImage String? @url
    age Int @gte(18)
    activated Boolean @default(false)

    @@validate(!activated || email != null, "activated user must have an email")
}
```

## Referential action

### Overview

When defining a relation, you can use referential action to control what happens when one side of a relation is updated or deleted by setting the `onDelete` and `onUpdate` parameters in the `@relation` attribute.

```zmodel
attribute @relation(
    _ name: String?,
    fields: FieldReference[]?,
    references: FieldReference[]?,
    onDelete: ReferentialAction?,
    onUpdate: ReferentialAction?,
    map: String?)
```

The `ReferentialAction` enum is defined as:

```zmodel
enum ReferentialAction {
    Cascade
    Restrict
    NoAction
    SetNull
    SetDefault
}
```

-   `Cascade`

    -   **onDelete**: deleting a referenced record will trigger the deletion of referencing record.

    -   **onUpdate**: updates the relation scalar fields if the referenced scalar fields of the dependent record are updated.

-   `Restrict`

    -   **onDelete**: prevents the deletion if any referencing records exist.
    -   **onUpdate**: prevents the identifier of a referenced record from being changed.

-   `NoAction`

    Similar to 'Restrict', the difference between the two is dependent on the database being used.

    See details [here](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions#noaction ':target=blank')

-   `SetNull`

    -   **onDelete**: the scalar field of the referencing object will be set to NULL.
    -   **onUpdate**: when updating the identifier of a referenced object, the scalar fields of the referencing objects will be set to NULL.

-   `SetDefault`
    -   **onDelete**: the scalar field of the referencing object will be set to the fields default value.
    -   **onUpdate**: the scalar field of the referencing object will be set to the fields default value.

### Example

```zmodel
model User {
    id String @id
    profile Profile?
}

model Profile {
    id String @id
    user @relation(fields: [userId], references: [id], onUpdate: Cascade, onDelete: Cascade)
    userId String @unique
}
```
