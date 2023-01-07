```prisma
model User {
    id String @id
    email String
    posts Post[]

    // everybody can signup
    @@allow('create', true)

    // allow full CRUD by self
    @@allow('all', auth() == this)
}

model Post {
    id String @id
    title String
    published Boolean @default(false)
    author User @relation(fields: [authorId], references: [id])
    authorId String

    // allow logged-in users to read published posts
    @@allow('read', auth() != null && published)

    // allow full CRUD by author
    @@allow('all', author == auth())
}
```
