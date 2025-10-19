import PackageInstall from '../../_components/PackageInstall';

# Writing Policies

> This section describes model-level policies only. See [here](./field-level.md) for field-level policies.

## Policy Plugin

The access control implementation is encapsulated in its own plugin distributed via the `@zenstackhq/plugin-policy` NPM package. The plugin exports extra ZModel attributes and functions. The first step to write policies is to install the package and enable the plugin in your ZModel schema so that those definitions are imported:

<PackageInstall dependencies={['@zenstackhq/plugin-policy@next']} />

```zmodel title="schema.zmodel"
plugin policy {
    provider = "@zenstackhq/plugin-policy"
}
```

## Rule Types

Policies can be defined as whitelist rules using the `@@allow` attribute or blacklist rules using `@@deny`.

Here's a quick example. Don't worry about the details yet. We'll cover the CRUD operations and rule expressions later.

```zmodel
model User {
    id    Int    @id @default(autoincrement())
    email String @unique

    // open to signup, profiles are public
    @@allow('create,read', true)

    // the user himself has full access
    @@allow('all', auth().id == id)
}

model Post {
    id        Int     @id @default(autoincrement())
    title     String
    published Boolean @default(false)
    author    User    @relation(fields: [authorId], references: [id])
    authorId  Int

    // no anonymous access
    @@deny('all', auth() == null)

    // published posts are readable by anyone
    @@allow('read', published)

    // author has full access
    @@allow('all', auth().id == authorId)
}
```

You can write as many policy rules as you want for a model. The order of the rules doesn't matter. ZenStack determines whether a CRUD operation is allowed using the following logic:

1. If any `@@deny` rule evaluates to true, it's denied.
2. If any `@@allow` rule evaluates to true, it's allowed.
3. Otherwise, it's denied (secure by default).

## Operation Types

Policy rules are expressed in terms of what CRUD operations they govern.

- `read`

    The permission to read records. Non-readable records are filtered out transparently.

- `create`

    The permission to create new records. The rules are evaluated **before** the creation happens.

- `update`

    The permission to update existing records. Non-updatable records are filtered out transparently **before** the update happens.

- `post-update`

    A special operation type to express conditions that should hold **after** an entity is updated. See [Post-Update Policies](./post-update.md) for details.

- `delete`
  
    The permission to delete existing records. Non-deletable records are filtered out transparently **before** the deletion happens.

- `all`

    Abbreviation for `create`, `read`, `update`, and `delete`. Note that `post-update` is not included and always needs to be explicitly specified.

As you've seen in the previous sample, a rule can specify multiple operations in a comma-separated list.

## Functions and Expressions

ZModel supports an intuitive expression language that's very similar to JavaScript. Typical expressions include:

- Literals like strings, numbers, and booleans
- Comparisons with `==`, `>`, etc.
- Logical combinations with `&&`, `||`, etc.
- References to the current model's fields, like `published`

They provide the basic building blocks for composing complex policy rules.

Functions are an extensibility mechanism that allows encapsulating specific semantics (e.g., getting the current user). Function calls are expressions, so they can be combined with other expressions using operators.

The following sections will cover some of the functions and expression types that are specifically designed for writing policy rules. See [Functions](../../reference/zmodel/07-function.md) and [Expression](../../reference/zmodel/08-expression.md) reference for more details. Refer to the [@zenstackhq/plugin-policy](../../reference/plugins/policy.md) documentation for functions available for writing policies.


## Accessing Current User

The most common type of access control rules concerns the current user. The built-in `auth()` function is designed to access the current user. `auth()` returns an object, and its type is inferred from the ZModel schema with the following rules:

1. If there's a `model` or `type` annotated with the `@@auth` attribute, it'll be used as the type of `auth()`.
2. Otherwise, if there's a `model` or `type` named "User" (case sensitive), it'll be used.
3. Otherwise, a compilation error will be reported.

Simply put, if you have a "user table" in your schema, just name it "User" or annotate that model with `@@auth`. If you want to decouple the `auth()`'s type from the data model for better flexibility, define a `type` and annotate it with `@@auth`.

```zmodel
type AuthInfo {
    email String
    role  String

    @@auth
}
```

With `auth()`'s type available, you can access its fields in policy expressions:

```zmodel
model Post {
    id       Int    @id @default(autoincrement())
    title    String

    @@allow('all', auth().role == 'ADMIN')
}
```

So the big question becomes: Where does the value of `auth()` come from?

ZenStack isn't an authentication library, so it doesn't know how to fetch the current login user. You are responsible for providing that piece of information. We'll cover it in the next part, where we talk about the runtime aspect of access control. For now, assume `auth()` gives you the **validated** current user info.

If you don't provide the current user, `auth()` will return `null`, and you can use it to write rules for anonymous users, like:

```zmodel
@@deny('all', auth() == null)
```

## Accessing Relations

You can achieve a lot by writing policies using a model's simple fields; however, real-world access control often involves relations. For example:

> A user can only create posts if his profile is verified, where "Profile" is a relation of "User".

ZenStack's policy really shines when it comes to how flexible it is in traversing relations.

### To-One Relations

Accessing to-one relation is straightforward, simply use dot notation to use the relation's field, and you can chain as deeply as you need:

```zmodel
model User {
    ...
    profile Profile

    @@allow('all', auth().city === profile.address.city)
}

model Profile {
    ...
    address Address
}

model Address {
    ...
    city String
}
```

### To-Many Relations

To access to-many relations, use the "collection predicate expression" to build a boolean predicate over the related records. The expression has three variants:

- Some: `relation?[CONDITION]`
- Every: `relation![CONDITION]`
- None: `relation^[CONDITION]`

The `CONDITION` is an expression under the context of the relation, meaning that fields referenced in the condition are resolved against the related model. You can use `this` keyword to "escape" and refer to the fields belonging to the model where the rule is defined.

Here's an example:

```zmodel
model User {
    ...
    posts Post[]

    // user can't be deleted if he has published posts
    @@deny('delete', posts?[published])
}

model Post {
    ...
    published Boolean @default(false)
}
```

You can nest collection predicate expressions to build deep to-many relation traversals.

## Special Notes About `create`

There are limitations on what relations can be accessed in `create` rules, because such rules are evaluated before the record is created. At that time, relations are not accessible yet.

As a result, `create` rules can only access "owned" relations - those relations that have foreign keys defined in the model where the rule is defined. During create, if the foreign key fields are set, the relations are accessible. For example, the following is allowed:

```zmodel
model Profile {
    ...
    user User @relation(fields: [userId], references: [id])
    userId Int

    // ✅ `user` is an owned relation
    @@allow('create', auth().id == user.id)
}
```

But the following is not allowed:

```zmodel
model User {
    ...
    profile Profile

    // ❌ `profile` is not an owned relation
    @@allow('create', auth().id == profile.userId)
}
```

## Reusing Relation's Policies

A common pattern in access control is that an entity's policy directly inherits from its related entity. For example: "A user's profile is readable if the user is readable." Instead of writing duplicated rules like:

```zmodel
model User {
    ...
    public Boolean
    @@allow('read', public)
}

model Profile {
    ...
    user User

    @@allow('read', user.public)
}
```

You can use the `check()` function to delegate the policy check to the related entity directly:

```zmodel
model User {
    ...
    public Boolean
    @@allow('read', public)
}

model Profile {
    ...
    user User

    @@allow('read', check(user, 'read'))
}
```

You can make it even more concise by omitting the second argument and inferring it from the context:

```zmodel
model Profile {
    ...
    @@allow('read', check(user)) // "read" is inferred from the rule context
}
```

:::info
`check()` currently only supports to-one relations.
:::

## Custom Functions 🚧

Coming soon.

## RBAC, ABAC, ReBAC, ?BAC

If you've studied access control patterns, you've probably heard many acronyms. What pattern does ZenStack employ?

We can say it's "none", or "all of them". ZenStack doesn't force you into any specific pattern. Instead, it provides you with a set of building blocks so you can build the implementation that best fits your needs. It can be one of the existing popular patterns, a mix of them, or something without an acronym yet.
