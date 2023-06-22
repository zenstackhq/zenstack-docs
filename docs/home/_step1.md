```zmodel
model User {
    id String @id
    // @email is a field validation rule
    email String @email
    // @password marks field to be hashed (using bcrypt) on save
    // @omit indicates the field should be filtered when the entity is returned
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
    // auth() is a built-in function that returns current user
    @@allow('all', author == auth())
}
```
