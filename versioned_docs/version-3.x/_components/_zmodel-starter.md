  ```zmodel
  datasource db {
    provider = 'sqlite'
    url = "file:./dev.db"
  }

  model User {
    id       String @id @default(cuid())
    email    String @unique @email @length(6, 32)
    posts    Post[]
  }

  model Post {
    id        String   @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    title     String   @length(1, 256)
    content   String
    published Boolean  @default(false)
    author    User     @relation(fields: [authorId], references: [id])
    authorId  String
  }
  ```