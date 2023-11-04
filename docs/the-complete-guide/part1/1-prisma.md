---
sidebar_label: 1. Prisma Crash Course
---

# Prisma Crash Course

:::info
Feel free to skip to the [next chapter](/docs/the-complete-guide/part1/zmodel) if you are already familiar with Prisma.
:::

ZenStack is built above Prisma ORM, so it'll be important to have a basic understanding of it.

Prisma is a so-called "schema-first" ORM that simplifies database access for Node.js and TypeScript applications. It provides an intuitive and concise DSL (Domain-Specific Language) for defining data models and generates a type-safe client for accessing the database.

This guide is by no means a comprehensive introduction to Prisma, but it covers the most essential parts of understanding and using it.

### Prisma Schema

You can define your data models in a file called `schema.prisma`. Here's an example:

```zmodel

model User {
    id Int @id @default(autoincrement())
    email String @unique
    name String?
}

```

The `User` model contains a primary key `id` (indicated by the `@id` attribute), a unique `email` field, and an optional `name` field. The `@default` attribute specifies the field's default value, and the `autoincrement` function instructs the database to generate incrementing values automatically.

Modeling relationships is also easy. The following example shows a `Post` model with a one-to-many relationship with the `User` model. The `@relation` attribute is the key for connecting the two models by associating them with a foreign key.

```zmodel

model User {
    id Int @id @default(@autoincrement())
    ...
    posts Post[]
}

model Post {
    id Int @id @default(@autoincrement())
    title String
    author User @relation(fields: [authorId], references: [id])
    authorId Int
}

```

### Prisma Client

You can run the Prisma CLI to generate a type-safe client for accessing the database.

```bash
npx prisma generate
```

The client is generated into the `@prisma/client` package and can be used as the following:

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// create a user
await prisma.user.create({
    data: { email: 'user1@abc.com' }
});

// create a user together with two related posts
await prisma.user.create({ 
    data: {
        email: 'user2@abc.com',
        posts: {
            create: [
                { title: 'Post 1' },
                { title: 'Post 2' }
            ]
        }
    }
});

// find posts with title containing some text, and return the author of each post together
const posts = prisma.post.findMany({
    where: { title: { contains: 'ZenStack' } },
    include: { author: true }
});

// here the `posts` is smartly inferred to be typed `Array<Post & { author: User }>`
console.log(posts[0].author.email);
```

### Prisma Migrate

To synchronize your schema to the database tables and fields, run the "migrate" command:

```bash
npx prisma migrate dev
```

It synchronizes the local database with the schema and generates a migration record (used for reconstructing database's schema when your app deploys).

When deploying your app to an integration environment (e.g, staging or production), you should run

```bash
npx prisma migrate deploy
```

to apply the migration records to the database.

---

Prisma has a rich set of other features not covered here, like schema migration, data browsing, etc., but we've got enough knowledge to understand and use ZenStack. Check out [Prisma Documentation](https://www.prisma.io/docs/getting-started) for a more comprehensive introduction.
