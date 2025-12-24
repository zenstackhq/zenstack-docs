---
sidebar_position: 11
---

# Input Validation

This document describes the attributes and functions available for input validation in ZModel. See [Input Validation](../../orm/validation.md) for more details on how to use them.

## Model-Level Attributes

- `@@validate`

    ```zmodel
    @@validate(_ value: Boolean, _ message: String?, _ path: String[]?)
    ```

    Defines a model-level validation rule that can involve multiple fields and logical combinations. Use the `message` parameter to provide an optional custom error message, and the `path` parameter to provide an optional path to the field that caused the error.

## Field-Level Attributes

All field-level attributes have a `message` parameter that allows you to provide a custom error message.

- **String & List Fields**
  
    - `@length`
        
        ```zmodel
        @length(_ min: Int?, _ max: Int?, _ message: String?)
        ```

        Validates the length of a string or list field.

- **String Fields**
    - `@startsWith`

        ```zmodel
        @startsWith(_ text: String, _ message: String?)
        ```

        Requires a string field to start with a given prefix.

    - `@endsWith`
  
        ```zmodel
        @endsWith(_ text: String, _ message: String?)
        ```

        Requires a string field to end with a given suffix.

    - `@contains`
  
        ```zmodel
        @contains(_text: String, _ message: String?)
        ```

        Requires a string field to contain a given substring.

    - `@email`

        ```zmodel
        @email(_ message: String?)
        ```

        Requires a string field to be a valid email address.

    - `@url`
  
        ```zmodel
        @url(_ message: String?)
        ```

        Requires a string field to be a valid URL.

    - `@datetime`
  
        ```zmodel
        @datetime(_ message: String?)
        ```
  
        Requires a string field to be a valid ISO 8601 datetime.

    - `@regex`
        
        ```zmodel
        @regex(_ regex: String, _ message: String?)
        ```

        Requires a string field to match a given regular expression.

    - `@lower`
  
        ```zmodel
        @lower(_ value: String)
        ```

        Transforms a string field to lowercase before saving to the database.

    - `@upper`

        ```zmodel
        @upper(_ value: String)
        ```

        Transforms a string field to uppercase before saving to the database.

    - `@trim`

        ```zmodel
        @trim(_ value: String)
        ```

        Trims whitespace from both ends of a string field before saving to the database.

- **Number Fields**

    - `@lt`

        ```zmodel
        @lt(_ value: Any, _ message: String?)
        ```

        Requires a number field to be less than a given value.

    - `@lte`

        ```zmodel
        @lte(_ value: Any, _ message: String?)
        ```
        
        Requires a number field to be less than or equal to a given value.

    - `@gt`

        ```zmodel
        @gt(_ value: Any, _ message: String?)
        ```

        Requires a number field to be greater than a given value.

    - `@gte`

        ```zmodel
        @gte(_ value: Any, _ message: String?)
        ```

        Requires a number field to be greater than or equal to a given value.

## Functions

- `now()`

    ```zmodel
    function now(): DateTime {}
    ```

  Returns the current datetime.

- `length()`

    ```zmodel
    function length(field: Any): Int {}
    ```

  Returns the length of a string or list field.

- `startsWith()`
  
    ```zmodel
    function startsWith(field: String, search: String): Boolean {}
    ```

  Checks if a string field starts with a given prefix.

- `endsWith()`

    ```zmodel
    function endsWith(field: String, search: String): Boolean {}
    ```
  
  Checks if a string field ends with a given suffix.

- `contains()`

    ```zmodel
    function contains(field: String, search: String): Boolean {}
    ```
      
  Checks if a string field contains a given substring.

- `isEmail()`

    ```zmodel
    function isEmail(field: String): Boolean {}
    ```

  Checks if a string field is a valid email address.

- `isUrl()`

    ```zmodel
    function isUrl(field: String): Boolean {}
    ```

  Checks if a string field is a valid URL.

- `isDateTime()`

    ```zmodel
    function isDateTime(field: String): Boolean {}
    ```

  Checks if a string field is a valid ISO 8601 datetime.

- `regex()`

    ```zmodel
    function regex(field: String, pattern: String): Boolean {}
    ```

  Checks if a string field matches a given regular expression.

- `has()`

    ```zmodel
    function has(field: Any[], search: Any): Boolean {}
    ```

  Checks if a list field contains a given element.

- `hasSome()`

    ```zmodel
    function hasSome(field: Any[], search: Any[]): Boolean {}
    ```

  Checks if a list field contains at least one element from a given list.

- `hasEvery()`

    ```zmodel
    function hasEvery(field: Any[], search: Any[]): Boolean {}
    ```

  Checks if a list field contains all elements from a given list.

- `isEmpty()`
  
    ```zmodel
    function isEmpty(field: Any[]): Boolean {}
    ```

  Checks if a list field is empty.
