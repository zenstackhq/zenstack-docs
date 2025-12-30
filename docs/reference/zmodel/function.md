---
sidebar_position: 8
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

:::info
Functions related to input validation are documented in a [separate page](./input-validation.md).
:::

### uuid()

```zmodel
function uuid(version: Int?, format: String?): String {}
```

Generates a globally unique identifier based on the UUID spec.

*Parameters:*

- `version` (optional): The UUID version to generate. Supported values are `4` (default) and `7`.
- `format` (optional): A pattern to control the output format. `%s` in the pattern will be replaced by the generated id. Use escaped `\\%s` to have a literal `%s` in the output.

### cuid()

```zmodel
function cuid(version: Int?, format: String?): String {}
```

Generates a unique identifier based on the [CUID](https://github.com/ericelliott/cuid) spec.

*Parameters:*

- `version` (optional): The CUID version to generate. Supported values are `1` (default) and `2`.
- `format` (optional): A pattern to control the output format. `%s` in the pattern will be replaced by the generated id. Use escaped `\\%s` to have a literal `%s` in the output.

### nanoid()

```zmodel
function nanoid(length: Int?, format: String?): String {}
```

Generates an identifier based on the [nanoid](https://github.com/ai/nanoid) spec.

*Parameters:*

- `length` (optional): The length of the generated id.
- `format` (optional): A pattern to control the output format. `%s` in the pattern will be replaced by the generated id. Use escaped `\\%s` to have a literal `%s` in the output.

### ulid()

```zmodel
function ulid(format: String?): String {}
```

Generates a unique identifier based on the [ULID](https://github.com/ulid/spec) spec.

*Parameters:*

- `format` (optional): A pattern to control the output format. `%s` in the pattern will be replaced by the generated id. Use escaped `\\%s` to have a literal `%s` in the output.

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

Represents default values that cannot be expressed in ZModel (such as random()).

### auth()

```zmodel
function auth(): AUTH_TYPE {}
```

Gets the current login user. The return type is resolved to a model or type annotated with the `@@auth` attribute, and if not available, a model or type named `User`.
