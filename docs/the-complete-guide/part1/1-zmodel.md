---
sidebar_label: 1. ZModel Language
---

# ZModel Language

The first thing that ZenStack may surprise you is that, unlike other Prisma tools, we created a new schema language called *ZModel*. It's a superset of the Prisma Schema Language (PSL) with syntax elements to support additional features. The `zenstack` CLI takes a ZModel file as input and generates a Prisma Schema file out of it - which in turn can be fed to the standard `prisma` CLI for generating a Prisma Client or migrating the database.

Why did we invent a new schema language?

### Why ZModel?

#### Custom Attributes

While Prisma Schema Language provides a terse and intuitive way to define data models, it has a major extensibility limitation: you can't add custom attributes. Prisma provides a set of pre-defined attributes to control detailed aspects of your tables and fields, but you're stuck when you need custom ones for your special modeling purposes. Traditionally, Prisma community tools have been hacking around this limitation by smuggling custom information in code comments, like the following example with 
[TypeGraphQL Prisma](https://prisma.typegraphql.com/):

```zmodel
model User {
    id Int @default(autoincrement()) @id
    email String @unique
    /// @TypeGraphQL.omit(output: true, input: true)
    password String
}
```

It works, but it's ugly and gets no protection from the compiler. The model can become messy if it's littered with such hacks everyone. One of the biggest reasons for introducing the ZModel language is to systematically remove this obstacle so that we have a solid foundation for adding custom semantics into the schema down the road.

Here's a quick example of the custom `@password` and `@omit` attributes ZModel added for automatically hashing passwords upon saving and omitting them from query results:

```zmodel
model User {
    id Int @default(autoincrement()) @id
    email String @unique
    password String @omit @password
}
```

The access policies and data validation rules are also implemented with custom attributes. Don't worry. We'll cover them in detail in the following chapters.

#### Other Language Features

A custom schema language also allows us to add new language features besides custom attributes. For example:

1. The `import` syntax for breaking down a large schema into multiple files
2. The `extends` syntax for inheriting fields from a base model

Here's an example of how to use them to manage large schemas more effectively:

```zmodel title='base.zmodel'
abstract model Base {
    id Int @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt()
    published Boolean @default(true)

    // author has full access
    @@allow('all', auth() != null && published)
}
```

```zmodel title='schema.zmodel'
import "base"
model User extends Base {
    name String
}

model Post extends Base {
    title String
    content String?
    viewCount Int @default(0)
    comment Comment[]
}

model Comment extends Base {
    content String
    post Post @relation(fields: [postId], references: [id])
    postId Int
}
```

#### A Better Plugin System

Prisma allows you to write custom generators. However, the generator development API is undocumented and difficult to understand. ZenStack provides a plugin system that enables you to generate custom artifacts with a simple API and object model. In fact, almost all the features of ZenStack itself are implemented as plugins.

### ZModel Structure

The ZModel language is a superset of Prisma Schema Language (PSL). All Prisma schema syntaxes are valid in ZModel. A ZModel can contain the following declarations.

#### Imports

The `import` syntax is an extension to PSL. You can use it to break down a large schema into multiple files.

```zmodel title='schema.zmodel'
import "user"
import "post"
```

```zmodel title='user.zmodel'
model User {
    id Int @id @default(autoincrement())
    email String @unique
    posts Post[]
}
```

```zmodel title='post.zmodel'
model Post {
    id Int @id @default(autoincrement())
    title String
    author User @relation(fields: [authorId], references: [id])
    authorId Int
}
```

When the `zenstack` CLI compiles an input schema, it merges the content of all imported files into a single schema before further processing.

#### Data Source

The `datasource` declaration of ZModel is exactly the same as PSL. ZenStack passes it to the generated Prisma schema without modification.

```zmodel
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}
```

#### Prisma Generators

The `generator` declarations of ZModel are exactly the same as PSL. ZenStack passes it to the generated Prisma schema without modification.

```zmodel
generator client {
    provider = "prisma-client-js"
}
```

#### Plugins

Plugins are the new extensibility mechanism provided by ZModel. Its syntax is similar to generators but with the `plugin` declaration keyword. Here's an example for generating tRPC CRUD routers:

```zmodel
plugin trpc {
    provider = "@zenstackhq/trpc"
    output   = "src/generated"
}
```

[Part II](/docs/the-complete-guide/part2) of this guide will cover the plugin system in detail.

#### Models

The `model` declaration of ZModel is exactly the same as PSL, except for the new set of attributes ZenStack added.

```zmodel
model User {
    id Int @id @default(autoincrement())

    // during create and update, ZenStack validates the field is a valid email address
    email String @unique @email

    // the field is automatically hashed upon saving, and omitted from query results
    password String @omit @password

    // access policy: open to sign up
    @@allow('create', true)

    // access policy: the user has full access to self
    @@allow('all', auth() == this)
}
```

### IDE Support

ZenStack offers a VSCode extension to support authoring ZModel files - syntax highlighting, auto-completion, and error checking. You can install it from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=zenstack.zenstack). Although it still lacks some features, the goal is to make it on par with the Prisma VSCode extension. We're also actively looking to support JetBrains IDEs. Please follow [this discussion](https://github.com/zenstackhq/zenstack/discussions/414) for updates.

### Full Documentation

Check out the [ZModel Language](/docs/reference/zmodel-language) reference documentation for a complete language description.
