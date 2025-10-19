# Post-Update Rules

Among the operation types, "update" is a special one because it has a "pre" state and "post" state. The "update" policies we've seen in the previous parts refer to the "pre" state, meaning that if your polices refer to the model's fields, the fields are evaluated to their values before the update happens.

However, sometimes you want to express conditions that should hold after the update happens. For example, you may want to ensure that after an update, a post's `published` field cannot be set to true unless the current user is the author. Post-update policies are designed for such scenarios.

Writing post-update rules is essentially the same as writing regular "update" rules, except that fields will refer to their post-update values. You can use the built-in `before()` function to refer to the pre-update entity if needed.

Another key difference is that "post-update" operation is by default allowed. If you don't write any post-update rules, the update operation will succeed as long as it passes the "update" policies. However, if you have any post-update rules for a model, at least one `@@allow` rule must evaluate to true for the update operation to succeed.

```zmodel
model Post {
    id        Int @id @default(autoincrement())
    title     String
    published Boolean @default(false)
    author    User @relation(fields: [authorId], references: [id])
    authorId  Int

    // only author can publish the post
    @@deny('post-update', published == true && auth().id != authorId)

    // prevent changing authorId
    @@deny('post-update', before().authorId != authorId)
}
```

