---
sidebar_position: 4
sidebar_label: Query API
title: Query API
---

ZenStack ORM's query API provides a powerful and high-level way to interact with your database with awesome type safety. The API is a superset of [Prisma ORM's query API](https://www.prisma.io/docs/orm/prisma-client/queries), so if you are familiar with Prisma, you will feel right at home. If not, it's intuitive and easy to learn.

The API is organized into several categories covered by the following sections. The API methods share many common input and output patterns, and we'll cover them in this overview section.

## Common Input Fields

- `where`

    For operations that involve filtering records, a `where` clause is used to specify the condition. Examples include `findUnique`, `updateMany`, `delete`, and etc. `where` clause also exists in nested payload for filtering relations.

    ```ts
    await db.post.findMany({ where: { published: true } });
    ```

    The [Filter](./filter) section describes the filtering capabilities in detail.

- `select`, `include`, `omit`

    When an operation returns record(s), you can use these clauses to control the fields and relations returned in the result. The `select` clause is used to specify the fields/relations to return, `omit` to exclude, and `include` to include relations (together with all regular fields).

    When selecting relations, you can nest these clauses to further control fields and relations returned in the nested relations.

    ```ts
    // results will include `title` field and `author` relation
    await db.post.findMany({
      select: { title: true, author: true },
    });

    // results will include all fields except `content`, plus `author` relation
    await db.post.findMany({
      omit: { content: true }, include: { author: true }
    });
    ```

    :::info
    `include` and `select` cannot be used together in the same operation, because `include` implies selecting all non-relation fields.

    `select` and `omit` cannot be used together in the same operation either, because the combination is meaningless.
    :::

- `orderBy`, `take`, `skip`

    When an operation returns multiple records, you can use these clauses to control the sort order, number of records returned, and the offset for pagination. `take` can be positive (for forward pagination) or negative (for backward pagination).

    ```ts
    // results will be sorted by `createdAt` in descending order, and return 
    // 10 records starting from the 5th record
    await db.post.findMany({ orderBy: { createdAt: 'desc' }, skip: 5, take: 10 });
    ```

- `data`

    When an operation involves creating or updating records, a `data` clause is used to specify the data to be used. It can include nested objects for manipulating relations. See the [Create](./create) and [Update](./update) sections for details.

    ```ts
    // Create a new post and connect it to an author
    await db.post.create({
      data: { title: 'New Post', author: { connect: { id: 1 } } }
    });
    ```

## Output Types

The output types of the API methods generally fall into three categories:

1. When the operation returns record(s)

    The output type is "contextual" to the input's shape, meaning that when you specify `select`, `include`, or `omit` clauses, the output type will reflect that.

    ```ts
    // result will be `Promise<{ title: string; author: { name: string } }[]>`
    db.post.findMany({
      select: { title: true, author: { select: { name: true } } }
    });
    ```

2. When the operation returns a batch result

    Some operations only returns a batch result `{ count: number }`, indicating the number of records affected. These include `createMany`, `updateMany`, and `deleteMany`.

3. Aggregation

    Aggregation operations' output type is contextual to the input's shape as well. See [Count](./count) and [Aggregate](./aggregate) sections for details.


## Sample Schema

Throughout the following sections, we will use the following ZModel schema as the basis for our examples:

```zmodel title="zenstack/schema.zmodel"
// This is a sample model to get you started.

datasource db {
    provider = 'sqlite'
}

/// User model
model User {
    id       Int    @id @default(autoincrement())
    email    String @unique
    posts    Post[]
}

/// Post model
model Post {
    id        Int      @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    title     String
    content   String?
    slug      String?  @unique
    published Boolean  @default(false)
    viewCount Int      @default(0)
    author    User?    @relation(fields: [authorId], references: [id])
    authorId  Int?
}
```
