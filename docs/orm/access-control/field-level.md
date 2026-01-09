---
sidebar_position: 4
---

import AvailableSince from '../../_components/AvailableSince';
import PreviewFeature from '../../_components/PreviewFeature'
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';

# Field-Level Policies

<AvailableSince version="v3.2.0" />
<PreviewFeature name="Field-level policy" />

Field-level policies allow you to define access control rules at the individual field level within a model. This provides fine-grained control over who can read or write specific fields in your data models. To define field-level policies, use the `@allow` and `@deny` attributes directly on model fields (note the single `@`).

```zmodel
model User {
    id    Int    @id

    // email can be updated only by the user themselves
    email String @allow('update', auth() == this)

    // name cannot be read by anonymous users
    name  String @deny('read', auth() == null)
}
```

Field-level policies are similar to model-level ones, with the following key restrictions:

- Only "read" and "update" operations are supported. You can use "all" to denote both.
- They cannot be defined on relation fields or computed fields.

## Read Behavior

When reading a row, fields that violates "read" policies will be nullified in the result. Conceptually, the following form of SQL is generated to guard the fields:

```sql
SELECT
    CASE WHEN <read_policy_for_field_1> THEN field_1 ELSE NULL END AS field_1,
    ...
FROM table
WHERE <model_level_policies> and <other_conditions>;
```

If read policies are defined on foreign key fields, they will also control the readability of the corresponding relations.

:::info

Setting unreadable fields null brings a caveat that you cannot tell whether a field is actually `NULL` in the database or just unreadable due to access control. So why don't we instead omit the fields from the result?

The concern is that a non-readable field should still have a valid SQL value, because it can be used to compute other data (computed columns, joins, etc.). With `null` values, the computation remain valid in SQL (e.g., `NULL + 1` results in `NULL`), so the fields remain usable everywhere even though their actual values cannot be seen.

:::

## Update Behavior

When updating data, if an update involves setting fields that violate "update" policies, the entire update operation will be rejected with an `ORMError` with `reason` set to `REJECTED_BY_POLICY`.

## Samples

<StackBlitzGithub repoPath="zenstackhq/v3-doc-orm-policy" openFile={['field-level/zenstack/schema.zmodel', 'field-level/main.ts']} startScript="field-level" />
