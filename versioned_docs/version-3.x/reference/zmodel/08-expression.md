---
sidebar_position: 8
---

# Expression

ZModel provides an expression system that allows you to construct complex computations from primitive constructs like literals and fields. Expressions are used extensively in defining access control policies and input validation rules.

## Expression Types

### Literal

String (e.g., `"hello"`), number (e.g., `42`), and boolean (e.g., `true`, `false`) literals are supported. Strings can be enclosed in either single quotes (`'`) or double quotes (`"`).

### List

Lists can be constructed using square brackets, e.g., `[1, 2, 3]` or `['a', 'b', 'c']`.

### Field Reference

Model's fields can be directly referenced by their names within the current model context.

### Member Access

You can use the dot notation to access members of an expression that contains fields. E.g., `author.name` if `author` is a relation field. Member access expressions can be chained.

### Unary Operator

The following operators are supported:

- `!` (logical NOT): E.g., `!true`

### Binary Operator

The following operators are supported:
- `==` (equal to): E.g., `a == b`
- `!=` (not equal to): E.g., `a != b`
- `>` (greater than): E.g., `a > b`
- `>=` (greater than or equal to): E.g., `a >= b`
- `<` (less than): E.g., `a < b`
- `<=` (less than or equal to): E.g., `a <= b`
- `&&` (logical AND): E.g., `a && b`
- `||` (logical OR): E.g., `a || b`

ZModel follows JavaScript's operator precedence and associativity rules.

### Collection Predicate

Collection predicate expressions are used to express a boolean condition over a to-many relation field. The expression has the following three variants:

- `relation?[CONDITION]`
  
    Evaluates to true if at least one related record satisfies the condition. E.g., `posts?[published == true]`.

- `relation![CONDITION]`

    Evaluates to true if all related records satisfy the condition. E.g., `posts![published == true]`.

- `relation^[CONDITION]`

    Evaluates to true if no related records satisfy the condition. E.g., `posts^[published == true]`.

The `CONDITION` is an expression under the context of the relation, meaning that fields referenced in the condition are resolved against the related model. You can use `this` keyword to "escape" and refer to the fields belonging to the model where the rule is defined.

### `in` Operator

The `in` keyword can be used to check if a value exists in a list. E.g., `value in [1, 2, 3]`.

### Function Calls

Functions can be called using the standard syntax: `functionName(arg1, arg2, ...)`. See [Functions](./07-function.md) for the list of available functions.

### Null

The `null` keyword represents a null value expression.

### This

The `this` keyword refers to the current entity of the model.
