---
description: Integrating with a custom authentication system.
sidebar_position: 100
sidebar_label: Custom Authentication
---

# Custom Authentication Integration

You may be using an authentication provider that's not mentioned in the guides. Or you may have a custom-implemented one. Integrating ZenStack with any authentication system is pretty straightforward. This guide will provide the general steps to follow.

## Determine what's needed for access control

The bridge that connects authentication and authorization is the `auth()` function that represents the authenticated current user. Based on your requirements, you should determine what fields are needed from it. The `auth()` object must at least contain an id field that uniquely identifies the current user. If you do RBAC, you'll very likely need an `auth().role` field available. Or even an `auth().permissions` field for fine-grained control.

The `auth()` call needs to be resolved to a "model" or "type" in ZModel. If you store user data in your database, you may already have a "User" model that carries all the fields you need to access.

```zmodel
model User {
  id          String @id
  role        String
  permissions String[]
  ...
}
```

ZenStack picks up the model named "User" automatically to resolve `auth()` unless another model or type is specifically appointed (by using the `@@auth` attribute). For example, if you're not storing user data locally, you can define a "type" to resolve `auth()`. This way, you can provide typing without being backed by a database table.

```zmodel
type Auth {
  id          String @id
  role        String
  permissions String[]

  @@auth
}
```

Just remember that any thing that you access from `auth().` must be resolved.

## Fetch the current user along with the additional information

At runtime in your backend code, you need to provide a value for the `auth()` call to ZenStack, so it can use it to evaluate access policies. How this is done is solely dependent on your authentication mechanism. Here are some examples:

1. If you use JWT tokens, you can issue tokens with user id and other fields embedded, then validate and extract them from the request.
2. If you use a dedicated authentication service, you can call it to get the current user's information.

You must ensure that whatever approach you use, the user information you get can be trusted and free of tampering.

## Create a user-bound ORM client

Finally, you can call the `$setAuth()` method on `ZenStackClient` to create an ORM instance that's bound to the current user. 

```ts
// ZenStack ORM client with access policy plugin installed
import { authDb } from './db'; 

const user = await getCurrentUser(); // your implementation
const db = authDb.$setAuth(user);
```
