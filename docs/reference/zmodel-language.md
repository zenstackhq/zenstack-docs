---
description: ZModel language references
sidebar_position: 1
sidebar_label: ZModel Language
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

Some of these extensions have been asked for by the Prisma community for some time, so we hope that ZenStack can be helpful even just as an extensible version of Prisma.

This section provides detailed descriptions of all aspects of the ZModel language, so you don't have to jump over to Prisma's documentation for extra learning.

## Data source

Every model needs to include exactly one `datasource` declaration, providing information on how to connect to the underlying database.

### Syntax

```prisma
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

```prisma
datasource db {
    provider = "postgresql"
    url = "postgresql://postgres:abc123@localhost:5432/todo?schema=public"
}
```

It's highly recommended that you not commit sensitive database connection strings into source control. Alternatively, you can load it from an environment variable:

```prisma
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

```prisma
generator [GENERATOR_NAME] {
    [OPTION]*
}
```

-   **[GENERATOR_NAME]**

    Name of the generator. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[OPTION]**

    A generator configuration option, in form of "[NAME] = [VALUE]". A generator needs to have at least a "provider" option that specify its provider.

### Example

```prisma
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

```prisma
plugin [PLUGIN_NAME] {
    [OPTION]*
}
```

-   **[PLUGIN_NAME]**

    Name of the plugin. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[OPTION]**

    A plugin configuration option, in form of "[NAME] = [VALUE]". A plugin needs to have at least a "provider" option that specify its provider.

### Example

```prisma
plugin reactHooks {
    provider = '@zenstackhq/react'
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

```prisma
enum UserRole {
    USER
    ADMIN
}
```

## Model

Models represent the business entities of your application.

### Syntax

```prisma
model [NAME] {
    [FIELD]*
}
```

-   **[NAME]**:

    Name of the model. Needs to be unique in the entire model. Needs to be a valid identifier matching regular expression `[A-Za-z][a-za-z0-9_]\*`.

-   **[FIELD]**:

    Arbitrary number of fields. See [next section](#field) for details.

### Note

A model must include a field marked with `@id` attribute. The `id` field serves as a unique identifier for a model entity and is mapped to the database table's primary key.

See [here](/docs/reference/zmodel-language#attribute) for more details about attributes.

### Example

```prisma
model User {
    id String @id
}
```

## Attribute

Attributes decorate fields and models and attach extra behaviors or constraints to them.

### Syntax

#### Field attribute

Field attribute name is prefixed by a single `@`.

```prisma
id String @[ATTR_NAME](ARGS)?
```

-   **[ATTR_NAME]**

Attribute name. See [below](#built-in-attributes) for a full list of attributes.

-   **[ARGS]**

See [attribute arguments](#attribute-arguments).

#### Model attribute

Field attribute name is prefixed double `@@`.

```prisma
model Model {
    @@[ATTR_NAME](ARGS)?
}
```

-   **[ATTR_NAME]**

Attribute name. See [below](#built-in-attributes) for a full list of attributes.

-   **[ARGS]**

See [attribute arguments](#attribute-arguments).

### Arguments

Attribute can be declared with a list of parameters and applied with a comma-separated list of arguments.

Arguments are mapped to parameters by position or by name. For example, for the `@default` attribute declared as:

```prisma
attribute @default(_ value: ContextType)
```

, the following two ways of applying it are equivalent:

```prisma
published Boolean @default(value: false)
```

```prisma
published Boolean @default(false)
```

### Parameter types

Attribute parameters are typed. The following types are supported:

-   Int

    Integer literal can be passed as argument.

    E.g., declaration:

    ```prisma
    attribute @password(saltLength: Int?, salt: String?)

    ```

    application:

    ```prisma
    password String @password(saltLength: 10)
    ```

-   String

    String literal can be passed as argument.

    E.g., declaration:

    ```prisma
    attribute @id(map: String?)
    ```

    application:

    ```prisma
    id String @id(map: "_id")
    ```

-   Boolean

    Boolean literal or expression can be passed as argument.

    E.g., declaration:

    ```prisma
    attribute @@allow(_ operation: String, _ condition: Boolean)
    ```

    application:

    ```prisma
    @@allow("read", true)
    @@allow("update", auth() != null)
    ```

-   ContextType

    A special type that represents the type of the field onto which the attribute is attached.

    E.g., declaration:

    ```prisma
    attribute @default(_ value: ContextType)
    ```

    application:

    ```prisma
    f1 String @default("hello")
    f2 Int @default(1)
    ```

-   FieldReference

    References to fields defined in the current model.

    E.g., declaration:

    ```prisma
    attribute @relation(
        _ name: String?,
        fields: FieldReference[]?,
        references: FieldReference[]?,
        onDelete: ReferentialAction?,
        onUpdate: ReferentialAction?,
        map: String?)
    ```

    application:

    ```prisma
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

    ```prisma
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

    ```prisma
    model Model {
        // 'Cascade' is a predefined enum value
        owner Owner @relation(..., onDelete: Cascade)
    }
    ```

An attribute parameter can be typed as any of the types above, a list of the above type, or an optional of the types above.

```prisma
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

```prisma
model Model {
    ...
    serial Int @default(autoincrement())
    createdAt DateTime @default(now())
}
```

You can find a list of predefined attribute functions [here](#predefined-attribute-functions).

### Predefined attributes

#### Field attributes

-   `@id`

    ```prisma
    attribute @id(map: String?)
    ```

    Defines an ID on the model.

    _Params_:

    | Name | Description                                                       |
    | ---- | ----------------------------------------------------------------- |
    | map  | The name of the underlying primary key constraint in the database |

-   `@default`

    ```prisma
        attribute @default(_ value: ContextType)
    ```

    Defines a default value for a field.

    _Params_:

    | Name  | Description                  |
    | ----- | ---------------------------- |
    | value | The default value expression |

-   `@unique`

    ```prisma
        attribute @unique(map: String?)
    ```

    Defines a unique constraint for this field.

    _Params_:

    | Name | Description                                                       |
    | ---- | ----------------------------------------------------------------- |
    | map  | The name of the underlying primary key constraint in the database |

-   `@relation`

    ```prisma
        attribute @relation(_ name: String?, fields: FieldReference[]?, references: FieldReference[]?, onDelete: ReferentialAction?, onUpdate: ReferentialAction?, map: String?)
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

-   `@map`

    ```prisma
        attribute @map(_ name: String)
    ```

    Maps a field name or enum value from the schema to a column with a different name in the database.

    _Params_:

    | Name | Description                                       |
    | ---- | ------------------------------------------------- |
    | map  | The name of the underlying column in the database |

-   `@updatedAt`

    ```prisma
        attribute @updatedAt()
    ```

    Automatically stores the time when a record was last updated.

-   `@password`

    ```prisma
        attribute @password(saltLength: Int?, salt: String?)
    ```

    Indicates that the field is a password field and needs to be hashed before persistence.

    _NOTE_: ZenStack uses the "bcryptjs" library to hash passwords. You can use the `saltLength` parameter to configure the cost of hashing or use `salt` parameter to provide an explicit salt. By default, a salt length of 12 is used. See [here](https://www.npmjs.com/package/bcryptjs ':target=blank') for more details.

    _Params_:

    | Name       | Description                                                   |
    | ---------- | ------------------------------------------------------------- |
    | saltLength | The length of salt to use (cost factor for the hash function) |
    | salt       | The salt to use (a pregenerated valid salt)                   |

-   `@omit`

    ```prisma
        attribute @omit()
    ```

    Indicates that the field should be omitted when read from the generated services. Commonly used together with `@password` attribute.

#### Model attributes

-   `@@unique`

    ```prisma
        attribute @@unique(_ fields: FieldReference[], name: String?, map: String?)
    ```

    Defines a compound unique constraint for the specified fields.

    _Params_:

    | Name   | Description                                                  |
    | ------ | ------------------------------------------------------------ |
    | fields | A list of fields defined in the current model                |
    | name   | The name of the unique combination of fields                 |
    | map    | The name of the underlying unique constraint in the database |

-   `@@index`

    ```prisma
        attribute @@index(_ fields: FieldReference[], map: String?)
    ```

    Defines an index in the database.

    _Params_:

    | Name   | Description                                      |
    | ------ | ------------------------------------------------ |
    | fields | A list of fields defined in the current model    |
    | map    | The name of the underlying index in the database |

-   `@@map`

    ```prisma
        attribute @@map(_ name: String)
    ```

    Maps the schema model name to a table with a different name, or an enum name to a different underlying enum in the database.

    _Params_:

    | Name | Description                                              |
    | ---- | -------------------------------------------------------- |
    | name | The name of the underlying table or enum in the database |

-   `@@allow`

    ```prisma
        attribute @@allow(_ operation: String, _ condition: Boolean)
    ```

    Defines an access policy that allows a set of operations when the given condition is true. Read more about access policies [here](#access-policy).

    _Params_:

    | Name      | Description                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbriviation for including all operations. |
    | condition | Boolean expression indicating if the operations should be allowed                                                                                                        |

-   `@@deny`

    ```prisma
        attribute @@deny(_ operation: String, _ condition: Boolean)
    ```

    Defines an access policy that denies a set of operations when the given condition is true. Read more about access policies [here](#access-policy).

    _Params_:

    | Name      | Description                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbriviation for including all operations. |
    | condition | Boolean expression indicating if the operations should be denied                                                                                                         |

### Predefined attribute functions

-   `uuid`

    ```prisma
        function uuid(): String {}
    ```

    Generates a globally unique identifier based on the UUID spec.

-   `cuid`

    ```prisma
        function cuid(): String {}
    ```

    Generates a globally unique identifier based on the [CUID](https://github.com/ericelliott/cuid) spec.

-   `now`

    ```prisma
        function now(): DateTime {}
    ```

    Gets current date-time.

-   `autoincrement`

    ```prisma
        function autoincrement(): Int {}
    ```

    Creates a sequence of integers in the underlying database and assign the incremented
    values to the ID values of the created records based on the sequence.

-   `dbgenerated`

    ```prisma
        function dbgenerated(expr: String): Any {}
    ```

    Represents default values that cannot be expressed in the Prisma schema (such as random()).

-   `auth`

    ```prisma
        function auth(): User {}
    ```

    Gets the current login user. The return type of the function is the `User` model defined in the current ZModel.

-   `future`

    ```prisma
        function future(): Any {}
    ```

    Gets the "post-update" state of an entity. Only valid when used in a "update" access policy. Read more about access policies [here](#access-policy).

### Examples

Here're some examples on using field and model attributes:

```prisma
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

```prisma
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

    A field's type can be any of the scalar or reference type, a list of the aforementioned type (suffixed with `[]`), or an optional of the aforementioned type (suffixed with `?`).

-   **[FIELD_ATTRIBUTES]**

    Field attributes attach extra behaviors or constraints to the field. See [Attribute](#attribute) for more information.

### Example

```prisma
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

```prisma
model User {
    id String @id
    profile Profile?
}

model Profile {
    id String @id
    user @relation(fields: [userId], references: [id])
    userId String @unique
}
```

### One-to-many relation

The _owner_ side of the relation declares a list field typed as the model of the _owned_ side of the relation.

On the _owned_ side, a reference field is declared with `@relation` attribute, together with a **foreign key** field storing the id of the owner entity.

```prisma
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

### Many-to-one relation

A _join model_ is declared to connect the two sides of the relation using two one-to-one relations.

Each side of the relation then establishes a one-to-many relation with the _join model_.

```prisma
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

### Referential action

When defining a relation, you can specify what happens when one side of a relation is updated or deleted. See [Referential action](/docs/reference/zmodel-language#referential-action) for details.

## Access policy

Access policies use `@@allow` and `@@deny` rules to specify the eligibility of an operation over a model entity. The signatures of the attributes are:

-   `@@allow`

    ```prisma
        attribute @@allow(_ operation: String, _ condition: Boolean)
    ```

    _Params_:

    | Name      | Description                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbriviation for including all operations. |
    | condition | Boolean expression indicating if the operations should be allowed                                                                                                        |

-   `@@deny`

    ```prisma
        attribute @@deny(_ operation: String, _ condition: Boolean)
    ```

    _Params_:

    | Name      | Description                                                                                                                                                              |
    | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | operation | Comma separated list of operations to control, including `"create"`, `"read"`, `"update"`, and `"delete"`. Pass` "all"` as an abbriviation for including all operations. |
    | condition | Boolean expression indicating if the operations should be denied                                                                                                         |

### Policy expressions

Policy rules use boolean expressions to make verdicts. ZModel provides a set of literals and operators for constructing expressions of arbitrary complexity.

```

Expression ::= Literal | Array | This | Null | Reference | MemberAccess | Binary | Unary | CollectionPredicate

Literal ::= String | Number | Boolean

Array ::= "[" Expression [, Expression]* "]"

This ::= "this"

Null ::= "null"

Reference ::= Identifier

MemberAccess ::= Expression "." Identifier

Operator_Precedence#table
Binary ::= Expression ("==" | "!=" | ">" | "<" | ">=" | "<=" | "&&" | "||")

Unary ::= "!" Expression

CollectionPredicate ::= Expression ("?" | "!" | "^") "[" Expression "]"

```

Binary operator precedence follows [Javascript's rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/).

Collection predicate expressions are used for reaching into relation fields. You can find more details [here](#collection-predicate-expressions).

### Using authentication in policy rules

It's very common to use the current login user to verdict if an operation should be permitted. Therefore, ZenStack provides a built-in `auth()` attribute function that evaluates to the `User` entity corresponding to the current user. To use the function, your ZModel file must define a `User` model.

You can use `auth()` to:

-   Check if a user is logged in

    ```prisma
    @@deny('all', auth() == null)
    ```

-   Access user's fields

    ```prisma
    @@allow('update', auth().role == 'ADMIN')
    ```

-   Compare user identity

    ```prisma
    // owner is a relation field to User model
    @@allow('update', auth() == owner)
    ```

### Accessing relation fields in policy

As you've seen in the examples above, you can access fields from relations in policy expressions. For example, to express "a user can be read by any user sharing a space" in the `User` model, you can directly read into its `membership` field.

```prisma
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

```prisma
    @@allow('read', members?[user == auth()])
```

, in condition `user == auth()`, `user` refers to the `user` field in model `Membership`, because the collection `members` is resolved to `Membership` model.

Also, collection predicates can be nested to express complex conditions involving multi-level relation lookup. E.g.:

```prisma
    @@allow('read', membership?[space.members?[user == auth()]])
```

In this example, `user` refers to `user` field of `Membership` model because `space.members` is resolved to `Membership` model.

### Combining multiple rules

A model can contain an arbitrary number of policy rules. The logic of combining them is as follows:

-   The operation is rejected if any of the conditions in `@@deny` rules evaluate to `true`
-   Otherwise, the operation is permitted if any of the conditions in `@@allow` rules evaluate to `true`
-   Otherwise, the operation is rejected

### Pre-update vs. post-update

When an access policy rule is applied to a mutate operation, the entities under operation have a "pre" and "post" state. For a "create" rule, its "pre" state is empty, so the rule implicitly refers to the "post" state. For a "delete" rule, its "post" state is empty, so the rule implicitly refers to the "pre" state.

However, for "update" rules it is ambiguous; both the "pre" and the "post" states exist. By default, for "update" rules, fields referenced in the expressions refer to the "pre" state, and you can use the `future()` function to refer to the "post" state explicitly.

In the following example, the "update" rule uses `future()` to ensure an update cannot alter the post's owner.

```prisma
model Post {
    id String @id @default(uuid())
    title String @length(1, 100)
    author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
    authorId String

    // update can only be done by the author, and is not allowed to change author
    @@allow('update', author == auth() && future().author == author)
}
```

### Examples

#### A simple example with Post model

```prisma
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

```prisma
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

## Field validation

### Overview

Field validation is used for attaching constraints to field values. Unlike access policies, field validation rules are only applied on individual fields and are only checked for 'create' and 'update' operations.

Internally ZenStack uses [zod](https://github.com/colinhacks/zod ':target=blank') for validation.

### Validation attributes

The following attributes can be used to attach field validation rules:

#### String

-   `@length(_ min: Int?, _ max: Int?)`

    Validates length of a string field.

-   `@startsWith(_ text: String)`

    Validates a string field value starts with the given text.

-   `@endsWith(_ text: String)`

    Validates a string field value ends with the given text.

-   `@email()`

    Validates a string field value is a valid email address.

-   `@url()`

    Validates a string field value is a valid url.

-   `@datetime()`

    Validates a string field value is a valid ISO datetime.

-   `@regex(_ regex: String)`

    Validates a string field value matches a regex.

#### Number

-   `@gt(_ value: Int)`

    Validates a number field is greater than the given value.

-   `@gte(_ value: Int)`

    Validates a number field is greater than or equal to the given value.

-   `@lt(_ value: Int)`

    Validates a number field is less than the given value.

-   `@lte(_ value: Int)`

    Validates a number field is less than or equal to the given value.

### Example

```prisma
model User {
    id String @id
    handle String @regex("^[0-9a-zA-Z]{4,16}$")
    email String @email @endsWith("@myorg.com")
    profileImage String? @url
    age Int @gt(0)
}
```

## Referential action

### Overview

When defining a relation, you can use referential action to control what happens when one side of a relation is updated or deleted by setting the `onDelete` and `onUpdate` parameters in the `@relation` attribute.

```prisma
attribute @relation(
    _ name: String?,
    fields: FieldReference[]?,
    references: FieldReference[]?,
    onDelete: ReferentialAction?,
    onUpdate: ReferentialAction?,
    map: String?)
```

The `ReferentialAction` enum is defined as:

```prisma
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

```prisma
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
