:::info

By default, all operations are denied for a model. You can use the `@@allow` attribute to open up some permissions.

`@@allow` takes two parameters, the first is operation: create/read/update/delete. You can use a comma separated string to pass multiple operations, or use 'all' to abbreviate all operations. The second parameter is a boolean expression that verdicts if the rule should be activated.

Similarly, `@@deny` can be used to explicitly turn off some operations. It has the same syntax as `@@allow` but the opposite effect.

Whether an operation is permitted is determined as follows:

1. If any `@@deny` rule evaluates to true, it's denied.
2. If any `@@allow` rule evaluates to true, it's allowed.
3. Otherwise, it's denied.

Check out [Understanding Access Policies](/docs/the-complete-guide/part1/access-policy) for more details.
:::
