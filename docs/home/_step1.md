```prisma
model User {
    id String @id
    email String
    // field is hashed on save and omitted when the entity is returned by query
    password String @password @omit
    posts Post[]

    // policy: everybody can signup
    @@allow('create', true)

    // policy: allow full CRUD by self
    @@allow('all', auth() == this)
}

model Post {
    id String @id
    title String
    published Boolean @default(false)
    author User @relation(fields: [authorId], references: [id])
    authorId String

    // policy: allow logged-in users to read published posts
    @@allow('read', auth() != null && published)

    // policy: allow full CRUD by author
    @@allow('all', author == auth())
}
```
