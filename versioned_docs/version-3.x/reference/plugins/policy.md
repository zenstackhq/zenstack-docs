---
sidebar_position: 3
---

# @zenstackhq/plugin-policy

The `@zenstackhq/plugin-policy` plugin provides a set of ZModel declarations and an ORM runtime plugin to enable access control features. See [Access Control](../../orm/access-control/index.md) for more details.

## ZModel Declarations

The plugin contributes a set of ZModel attributes and functions for defining access control policies. To use them, you need to enable the plugin in your ZModel schema:

```zmodel
plugin policy {
    provider = '@zenstackhq/plugin-policy'
}
```

### Attributes

Use the following model-level attributes to define access control policies:

- `@@allow`

    ```zmodel
    attribute @@allow(_ operation: String, _ condition: Boolean)
    ```

    Defines an access policy that allows a set of operations when the given condition is true.
      - `operation`: comma-separated list of "create", "read", "update", "post-update", "delete". Use "all" to denote all operations.
      - `condition`: a boolean expression that controls if the operation should be allowed.
  
- `@@deny`
  
    ```zmodel
    attribute @@deny(_ operation: String, _ condition: Boolean)
    ```

    Defines an access policy that denies a set of operations when the given condition is true.
      - `operation`: comma-separated list of "create", "read", "update", "post-update", "delete". Use "all" to denote all operations.
      - `condition`: a boolean expression that controls if the operation should be denied.

### Functions

The following functions can be used in policy conditions:

- `auth()`

    ```zmodel
    function auth(): User {}
    ```

    Gets the current login user. The return type of the function is the `User` model defined in the current ZModel.

- `now()`

    ```zmodel
    function now(): DateTime {}
    ```

    Gets the current datetime.

- `contains()`

    ```zmodel
    function contains(field: String, search: String, caseInSensitive: Boolean?): Boolean {
    }
    ```

    Checks if the field value contains the search string. By default, the search is case-sensitive, and "LIKE" operator is used to match. If `caseInSensitive` is true, "ILIKE" operator is used if supported, otherwise it still falls back to "LIKE" and delivers whatever the database's behavior is.

- `startsWith()`

    ```zmodel
    function startsWith(field: String, search: String, caseInSensitive: Boolean?): Boolean {
    }
    ```

    Checks if the field value starts with the search string. By default, the search is case-sensitive, and "LIKE" operator is used to match. If `caseInSensitive` is true, "ILIKE" operator is used if supported, otherwise it still falls back to "LIKE" and delivers whatever the database's behavior is.

- `endsWith()`

    ```zmodel
    function endsWith(field: String, search: String, caseInSensitive: Boolean?): Boolean {
    }
    ```

    Checks if the field value ends with the search string. By default, the search is case-sensitive, and "LIKE" operator is used to match. If `caseInSensitive` is true, "ILIKE" operator is used if supported, otherwise it still falls back to "LIKE" and delivers whatever the database's behavior is.

- `has()`

    ```zmodel
    function has(field: Any[], search: Any): Boolean {}
    ```

    Checks if the list field value has the given search value.

- `hasSome()`

    ```zmodel
    function hasSome(field: Any[], search: Any[]): Boolean {
    }
    ```

    Checks if the list field value has at least one element of the search list

- `hasEvery()`

    ```zmodel
    function hasEvery(field: Any[], search: Any[]): Boolean {}
    ```

    Checks if the list field value has all elements of the search list.


- `isEmpty()`

    ```zmodel
    function isEmpty(field: Any[]): Boolean {}
    ```

    Checks if the list field value is empty.

- `currentModel()`

    ```zmodel
    function currentModel(casing: String?): String {}
    ```

    Returns the name of the model for which the policy rule is defined. If the rule is inherited to a sub model, this function returns the name of the sub model.
        
      - `casing`: parameter to control the casing of the returned value. Valid values are "original", "upper", "lower", "capitalize", "uncapitalize". Defaults to "original".

- `currentOperation()`

    ```zmodel
    function currentOperation(casing: String?): String {}
    ```

    Returns the operation for which the policy rule is defined for. Note that a rule with "all" operation is expanded to "create", "read", "update", and "delete" rules, and the function returns corresponding value for each expanded version.
        
      - `casing`: parameter to control the casing of the returned value. Valid values are "original", "upper", "lower", "capitalize", "uncapitalize". Defaults to "original".

## Runtime Plugin

The plugin exports a runtime plugin `PolicyPlugin` that can be installed on the ORM client to enable access control enforcement.

```ts
import { ZenStackClient } from '@zenstackhq/orm';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';

const db = new ZenStackClient(...);
const authDb = db.$use(new PolicyPlugin());
```
