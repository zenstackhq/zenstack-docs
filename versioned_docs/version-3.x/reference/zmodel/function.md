---
sidebar_position: 7
---

# Function

Functions are used to provide values for attribute arguments, e.g., current `DateTime`, an auto-increment `Int`, etc. They can be used in place of attribute arguments, like:

```zmodel
model Model {
    ...
    serial Int @default(autoincrement())
    createdAt DateTime @default(now())
}
```

ZModel's standard library provides a set of predefined functions, plugins can provide additional functions, and you can also define your own functions in the schema.

## Syntax

### Definition

```zmodel
function NAME(PARAMS): RETURN_TYPE {}
```

-   **NAME**

    Function name. Must be a valid identifier.

-   **PARAMS**

    Parameters. See [Parameters](#parameters) for details.

-   **RETURN_TYPE**

    Return type. Must be a valid type as described in [Parameters](#parameters).

Example:

```zmodel
function uuid(version: Int?): String {}
```

### Application

```zmodel
id String @default(FUNC_NAME(ARGS))
```
-   **FUNC_NAME**

    Function name.

-   **ARGS**

    Argument list. See [Parameters](#parameters) for details.

Example:

```zmodel
id String @default(uuid(4))
```

### Parameters

A function can have zero or more parameters. A parameter has a name and a type.

Valid parameter types include:
    -   `String`
    -   `Boolean`
    -   `Int`
    -   `BigInt`
    -   `Float`
    -   `Decimal`
    -   `DateTime`
    -   `Bytes`
    -   `Any`

Parameter's type can also carry the following suffix:
    - `[]` to indicate it's a list type
    - `?` to indicate it's optional

## Predefined functions

### uuid()

```zmodel
function uuid(): String {}
```

Generates a globally unique identifier based on the UUID spec.

### cuid()

```zmodel
function cuid(version: Int?): String {}
```

Generates a unique identifier based on the [CUID](https://github.com/ericelliott/cuid) spec. Pass `2` as an argument to use [cuid2](https://github.com/paralleldrive/cuid2).

### nanoid()

```zmodel
function nanoid(length: Int?): String {}
```

Generates an identifier based on the [nanoid](https://github.com/ai/nanoid) spec.

### ulid()

```zmodel
function ulid(): String {}
```

Generates a unique identifier based on the [ULID](https://github.com/ulid/spec) spec.

### now()

```zmodel
function now(): DateTime {}
```

Gets current date-time.

### autoincrement()

```zmodel
function autoincrement(): Int {}
```

Creates a sequence of integers in the underlying database and assign the incremented
values to the ID values of the created records based on the sequence.

### dbgenerated()

```zmodel
function dbgenerated(expr: String): Any {}
```

Represents default values that cannot be expressed in the Prisma schema (such as random()).

### auth()

```zmodel
function auth(): AUTH_TYPE {}
```

Gets the current login user. The return type is resolved to a model or type annotated with the `@@auth` attribute, and if not available, a model or type named `User`.
