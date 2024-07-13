---
title: How the "check" Function Helps Keep Your Policies DRY
description: This post introduces a typical pattern of access policy duplication in ZenStack schemas, and explains how the new `check` attribute function can help you keep your policies DRY.
tags: [zenstack]
authors: yiming
date: 2024-07-13
image: ./cover.jpg
---

# How the "check" Function Helps Keep Your Policies DRY

![Cover Image](cover.jpg)

Among ZenStack's features, the most beloved one is the ability to define access control policies inside the data schema. This ensures that your rules are colocated with the source code, always in sync with the data model, and easy to understand. It arguably provides a superior DX to other solutions like hand-coded authorization logic, or Postgres row-level security.

However, as your application grows more complex, you may find yourself repeating the same policy patterns across multiple models. This post explores one typical pattern of such duplication and demonstrates how the new `check()` attribute function can help you keep your policies DRY.

<!--truncate-->

## The parent-child duplication pattern

Consider a simple Todo application with two models: `List` and `Todo`. Each list can have multiple todos. The author of a list has full access to it. A list can also be set as public so anyone can read it. A todo's access control is determined by its containing list: one has the same permissions to a todo as to its parent.

Here's how a ZModel schema for the application might look:

```zmodel
model List {
  id       Int @id
  name     String
  public   Boolean
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
  todos    Todo[]

  // highlight-start
  @@allow('all', auth() == author)
  @@allow('read', public)
  // highlight-end
}

model Todo {
  id     Int @id
  name   String
  list   List @relation(fields: [listId], references: [id])
  listId Int

  // highlight-start
  @@allow('all', auth() == list.author)
  @@allow('read', list.public)
  // highlight-end
}
```

As you can easily spot, the access policies for `Todo` are almost identical to those for `List`. The duplication is not only tedious to write but also error-prone to maintain. If you ever need to change the policy, you have to remember to update it in two places.

The key to the problem is that from the access control point of view, the child model `Todo` simply "follows" the parent model `List`, which is a typical pattern in many applications. We can avoid duplication if we had a way to "delegate" the check of the child model to its parent.

## The `check()` function

The new `check()` attribute function introduced in ZenStack [v2.3](https://github.com/zenstackhq/zenstack/releases/tag/v2.3.0) is designed exactly for such "delegation". The function has the following signature:

```ts
function check(field: FieldReference, operation String?): Boolean
```

- `field`

  A relation field to check access for. Must be a non-array field.

- `operation`

  An optional argument indicating the CRUD permission kind to check. If the operation is not provided, it defaults to the operation of the policy rule containing it.

You can use the function in a few different forms:

1. You can explicitly specify the kind of CRUD operation to delegate to:

   ```zmodel
   model Child {
     parent Parent
     @@allow('read', check(parent, 'update'))
   }
   ```

2. Or you can omit the operation so it defaults to the current context:

   ```zmodel
   model Child {
     ...
     parent Parent

     @@allow('read', check(parent)) // here the operation is implicitly 'read'
   }
   ```

3. You can also delegate "all" operations:

   ```zmodel
   model Child {
     ...
     parent Parent

     @@allow('all', check(parent))
   }
   ```

   The above is equivalent to:

   ```zmodel
   model Child {
     ...
     parent Parent

     @@allow('read', check(parent))
     @@allow('create', check(parent))
     @@allow('update', check(parent))
     @@allow('delete', check(parent))
   }
   ```

4. Since `check` is just a boolean function, you can freely combine it with other conditions:

   ```zmodel
   model Child {
     ...
     parent Parent

     @@allow('read', check(parent) || auth().status == 'PAID')
   }
   ```

## Before and after

With this new weapon in hand, we can easily refactor our Todo schema to eliminate the duplication:

```zmodel
model List {
  id       Int @id
  name     String
  public   Boolean
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
  todos    Todo[]

  @@allow('all', auth() == author)
  @@allow('read', public)
}

model Todo {
  id     Int @id
  name   String
  list   List @relation(fields: [listId], references: [id])
  listId Int

  // highlight-next-line
  @@allow('all', check(list))
}
```

Pretty neat, isn't it?

## What's next?

Having the `check` function is great for resolving the parent-child duplication pattern. However, there are more related features that can be explored in future versions of ZenStack. Here are some ideas:

### 1. `*-to-many` relations

You've probably already noticed the limitation: the `check` function only works for the `*-to-one` side of a relation. Although I feel it should cover most of the use cases, there might be cases where you want to deal with the "*-to-many" side.

There are two possible ways to add such support:

- A: a new set of check functions: `checkSome`, `checkAll`, `checkNone`, etc.

  ```zmodel
  model Parent {
    children Child[]

    @@allow('read', checkSome(children, 'read'))
  }
  ```

- B: make it work with [collection predicate expressions](../docs/reference/zmodel-language#collection-predicate-expressions)

  ```zmodel

  model Parent {
    children Child[]

    // check if at least one child is readable
    @@allow('read', children?[child, check(child, 'read')])
  }

  ```

What's your preference? Leave a comment below!

### 2. Cyclic relations

The `zenstack` CLI checks for cycles in the `check` call graph and reports an error if it finds one. This is needed to prevent infinite loops during evaluation. However, there are cases where cyclic delegation is intentionally needed. For example, if you want to model a Google Drive-like system, you may end up with a self-cycle like this:

```zmodel
model Folder {
  parent Folder?
  children Folder[]
  permissions Permission[]

  // a folder is readable if it's configured with a permission or if its parent is readable
  @@allow('read', check(parent) || permissions?[type == 'read' && user == auth()])
}
```

This will be a hard problem to solve since Prisma inherently doesn't support recursive queries. A possible solution is to expand the recursion with a (configurable) finite levels of depth.

Is this something your app needs?

### 3. Other forms of duplication?

Parent-child is just one of the patterns of duplication out there. Are there other patterns hurting you? Leave a comment or join our [discord server](https://discord.gg/Ykhr738dUe) to discuss! We love real-world problems and our innovation never stops.
