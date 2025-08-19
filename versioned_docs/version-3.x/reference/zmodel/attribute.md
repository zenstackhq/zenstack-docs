---
sidebar_position: 6
---

# Attribute

Attributes decorate fields and models and attach extra behaviors or constraints to them.

ZModel's standard library provides a set of predefined attributes, plugins can provide additional attributes, and you can also define your own attributes in the schema.

## Syntax

### Field attribute

#### Definition

Field attribute name is prefixed by a single `@`.

```zmodel
attribute NAME(PARAMS)
```

-  **NAME**
  
    Attribute name. Field attribute's name must start with '@'.

-  **PARAMS**

    Attribute parameters. See [Parameters](#parameters) for details.

Example:

```zmodel
attribute @id(map: String?, length: Int?)
```

#### Application

```zmodel
id String ATTR_NAME(ARGS)?
```

-   **ATTR_NAME**

    Attribute name.

-   **ARGS**

    Argument list. See [Parameters](#parameters) for details.

Example:

```zmodel
model User {
    id Int @id(map: "_id")
}
```

### Model attribute

#### Definition

Field attribute name is prefixed by double `@@`.

```zmodel
attribute @@NAME(PARAMS)
```

-  **NAME**
  
    Attribute name. Model attribute's name must start with '@@'.

-  **PARAMS**

    Attribute parameters. See [Parameters](#parameters) for details.

Example:

```zmodel
attribute @@unique(_ fields: FieldReference[], name: String?, map: String?)
```

#### Application

```zmodel
model Model {
    ATTR_NAME(ARGS)?
}
```

-   **ATTR_NAME**

    Attribute name.

-   **ARGS**

    Argument list. See [Parameters](#parameters) for details.

Example:

```zmodel
model User {
    org      String
    userName String
    @@unique([org, userName])
}
```

### Parameters

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

## Predefined attributes

### @@id

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

### @@unique

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

### @@index

```zmodel
attribute @@index(_ fields: FieldReference[], map: String?)
```

Defines an index in the database.

_Params_:

| Name   | Description                                      |
| ------ | ------------------------------------------------ |
| fields | A list of fields defined in the current model    |
| map    | The name of the underlying index in the database |

### @@map

```zmodel
attribute @@map(_ name: String)
```

Maps the schema model name to a table with a different name, or an enum name to a different underlying enum in the database.

_Params_:

| Name | Description                                              |
| ---- | -------------------------------------------------------- |
| name | The name of the underlying table or enum in the database |

### @@ignore

```zmodel
attribute @@ignore()
```

Exclude a model from the ORM Client.

### @@auth

```zmodel
attribute @@auth()
```

Specify the model for resolving `auth()` function call.

### @@delegate

```zmodel
attribute @@delegate(_ discriminator: FieldReference)
```

Marks a model to be a delegated base. Used for [modeling a polymorphic hierarchy](../../modeling/polymorphism.md).

_Params_:

| Name          | Description                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| discriminator | A `String` or `enum` field in the same model used to store the name of the concrete model that inherit from this base model. |

### @@meta

```zmodel
attribute @@meta(_ name: String, _ value: Any)
```

Adds arbitrary metadata to a model. The metadata can be accessed by custom plugins for code generation, or at runtime from the `modelMeta` object exported from `@zenstackhq/runtime/model-meta`. The `value` parameter can be an arbitrary literal expression, including object literals.

```zmodel
model User {
    id Int @id
    @@meta('description', 'This is a user model')
}
```

### @id

```zmodel
attribute @id(map: String?)
```

Defines an ID on the model.

_Params_:

| Name | Description                                                       |
| ---- | ----------------------------------------------------------------- |
| map  | The name of the underlying primary key constraint in the database |

### @default

```zmodel
attribute @default(_ value: ContextType)
```

Defines a default value for a field.

_Params_:

| Name  | Description                  |
| ----- | ---------------------------- |
| value | The default value expression |

### @unique

```zmodel
attribute @unique(map: String?)
```

Defines a unique constraint for this field.

_Params_:

| Name | Description                                                       |
| ---- | ----------------------------------------------------------------- |
| map  | The name of the underlying primary key constraint in the database |

### @relation

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

### @map

```zmodel
attribute @map(_ name: String)
```

Maps a field name or enum value from the schema to a column with a different name in the database.

_Params_:

| Name | Description                                       |
| ---- | ------------------------------------------------- |
| map  | The name of the underlying column in the database |

### @updatedAt

```zmodel
attribute @updatedAt()
```

Automatically stores the time when a record was last updated.

### @ignore

```zmodel
attribute @ignore()
```

Exclude a field from the ORM Client (so that the field is not included in the input and output of ORM queries).

### @json

```zmodel
attribute @json()
```

### @meta

```zmodel
attribute @meta(_ name: String, _ value: Any)
```

Adds arbitrary metadata to a field. The metadata can be accessed by custom plugins for code generation, or at runtime from the `modelMeta` object exported from `@zenstackhq/runtime/model-meta`. The `value` parameter can be an arbitrary literal expression, including object literals.

```zmodel
model User {
    id Int @id
    name String @meta(name: "description", value: "The name of the user")
}
```

## Native type mapping attributes

Native type mapping attributes are a special set of field attributes that allow you to specify the native database type for a field. They are prefixed with `@db.`.

Without native type mappings, ZModel types are by default mapped to the database types as follows:

| ZModel Type | SQLite Type | PostgreSQL Type      |
|-------------|-------------|----------------------|
| `String`    | `TEXT`      | `text`               |
| `Boolean`   | `INTEGER`   | `boolean`            |
| `Int`       | `INTEGER`   | `integer`            |
| `BigInt`    | `INTEGER`   | `bigint`             |
| `Float`     | `REAL`      | `double precision`   |
| `Decimal`   | `DECIMAL`   | `decimal(65,30)`     |
| `DateTime`  | `NUMERIC`   | `timestamp(3)`       |
| `Json`      | `JSONB`     | `jsonb`              |
| `Bytes`     | `BLOB`      | `bytea`              |


The following native type mapping attributes can be used to override the default mapping:

| Attribute                | ZModel Type                   | SQLite Type | PostgreSQL Type      |
|--------------------------|-------------------------------|-------------|----------------------|
| `@db.Text`               | `String`                      | -           | `text`               |
| `@db.Char(x)`            | `String`                      | -           | `char(x)`            |
| `@db.VarChar(x)`         | `String`                      | -           | `varchar(x)`         |
| `@db.Bit(x)`             | `String` `Boolean` `Bytes`    | -           | `bit(x)`             |
| `@db.VarBit`             | `String`                      | -           | `varbit`             |
| `@db.Uuid`               | `String`                      | -           | `uuid`               |
| `@db.Xml`                | `String`                      | -           | `xml`                |
| `@db.Inet`               | `String`                      | -           | `inet`               |
| `@db.Citext`             | `String`                      | -           | `citext`             |
| `@db.Boolean`            | `Boolean`                     | -           | `boolean`            |
| `@db.Int`                | `Int`                         | -           | `serial` `serial4`   |
| `@db.Integer`            | `Int`                         | -           | `integer` `int`,`int4` |
| `@db.SmallInt`           | `Int`                         | -           | `smallint` `int2`    |
| `@db.Oid`                | `Int`                         | -           | `oid`                |
| `@db.BigInt`             | `BigInt`                      | -           | `bigint` `int8`      |
| `@db.DoublePrecision`    | `Float` `Decimal`             | -           | `double precision`   |
| `@db.Real`               | `Float` `Decimal`             | -           | `real`               |
| `@db.Decimal`            | `Float` `Decimal`             | -           | `decimal` `numeric`  |
| `@db.Money`              | `Float` `Decimal`             | -           | `money`              |
| `@db.Timestamp(x)`       | `DateTime`                    | -           | `timestamp(x)`       |
| `@db.Timestamptz(x)`     | `DateTime`                    | -           | `timestampz(x)`      |
| `@db.Date`               | `DateTime`                    | -           | `date`               |
| `@db.Time(x)`            | `DateTime`                    | -           | `time(x)`            |
| `@db.Timetz`             | `DateTime`                    | -           | `timez(x)`           |
| `@db.Json`               | `Json`                        | -           | `json`               |
| `@db.JsonB`              | `Json`                        | -           | `jsonb`              |
| `@db.ByteA`              | `Bytes`                       | -           | `bytea`              |