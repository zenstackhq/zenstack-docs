---
description: ZenStack offers increased flexibility in managing your schema file through multiple schema files and model inheritance.
sidebar_position: 5
---
# Managing Large Schema

As your business expands, your schema file grows with it. ZenStack offers increased flexibility in managing your schema file through through multiple schema files and model inheritance. An example project is provided below for your reference:

[https://github.com/zenstackhq/sample-multiple-schema](https://github.com/zenstackhq/sample-multiple-schema) 

## Model Inheritance

You can use abstract model to include common fields that would be shared by multiple models.  By extending abstract model, you can keep your schema DRY(Don’t repeat yourself).  The abstract model can contain both fields and attributes like a normal model, but it is erased after generation and does not appear in the generated Prisma schema file.

You can have your model defined as:

```tsx
abstract model Base {
    id Int @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt()

    //Logged-in users can view
    @@allow('read', auth() != null)

}

model Post extends Base
{
    title String
    content String?
    viewCount Int @default(0)
}

model ToDo extends Base
{
    title String
    completed Boolean @default(false)
}
```

The generated `schema.prisma` file would be:

```zmodel
/// @@allow('all', auth() != null && published)
model User {
    name String
    id Int @id() @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt()
    published Boolean @default(true)
    zenstack_guard Boolean @default(true)
    zenstack_transaction String?
    @@index([zenstack_transaction])
}

/// @@allow('all', auth() != null && published)
model Post {
    title String
    content String?
    viewCount Int @default(0)
    comment Comment[]
    id Int @id() @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt()
    published Boolean @default(true)
    zenstack_guard Boolean @default(true)
    zenstack_transaction String?
    @@index([zenstack_transaction])
}

/// @@allow('all', auth() != null && published)
model Comment {
    content String
    post Post @relation(fields: [postId], references: [id])
    postId Int
    id Int @id() @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt()
    published Boolean @default(true)
    zenstack_guard Boolean @default(true)
    zenstack_transaction String?
    @@index([zenstack_transaction])
}
```

## Multiple Schemas

You can split your schema file into multiple files and use `import` statements to include the file you needed.  When running `zenstack generate`, it recursively traverses all the imported models and combine them into a single model.  For instance, you can split the above schema file into two files below:

- base.zmodel
    
    ```tsx
    abstract model Base {
        id Int @id @default(autoincrement())
        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt()
        published Boolean @default(true)
    
        // author has full access
        @@allow('all', auth() != null && published)
    }
    ```
    
- schema.zmodel
    
    ```tsx
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