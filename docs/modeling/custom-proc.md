---
sidebar_position: 12
description: ZenStack custom procedures
---

import ZModelVsPSL from '../_components/ZModelVsPSL';
import PreviewFeature from '../_components/PreviewFeature';
import AvailableSince from '../_components/AvailableSince';

# Custom Procedure

<PreviewFeature name="Custom procedure" />

<AvailableSince version="v3.2.0" />

<ZModelVsPSL>
Custom procedure is a ZModel feature and doesn't exist in PSL.
</ZModelVsPSL>

Custom procedures are like database stored procedures that allow you to define reusable routines encapsulating complex logic.

Use the `procedure` keyword to define a custom procedure in ZModel. Here's an example for a query procedure:

```zmodel title="schema.zmodel"
procedure getUserFeeds(userId: Int, limit: Int?) : Post[] 
```

Mutation procedures (that write to the database) should be defined with `mutation procedure`:

```zmodel title="schema.zmodel"
mutation procedure signUp(email: String) : User
```

You can use all types supported by ZModel to define procedure parameters and return types, including:

    - Primitive types like `Int`, `String`
    - Models
    - Enums
    - Custom types
    - Array of the types above

Parameter types can be marked optional with a `?` suffix. If a procedure doesn't return anything, use `Void` as the return type.

Custom procedures are implemented with TypeScript when constructing the ORM client, and can be invoked via the ORM client in backend code. See [Custom Procedures](../orm/custom-proc.md) in the ORM part for more details.

They are also accessible via Query-as-a-Service (via [RPC-style](../service/api-handler/rpc.md#endpoints) or [RESTful-style](../service/api-handler/rest.md#calling-custom-procedures) API), plus consumable via Client SDKs like [TanStack Query Client](../service/client-sdk/tanstack-query/#custom-procedures).
