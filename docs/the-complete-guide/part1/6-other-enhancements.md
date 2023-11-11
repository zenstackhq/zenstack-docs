---
sidebar_label: 6. Other Enhancements
---

# Other Enhancements

Besides core enhancements like access policies, ZenStack also provides a few other lightweight enhancements targeting specific use cases.

### Hashing Passwords

When using a credential-based authentication system, it's important never to store the password in plain text. ZenStack provides a simple way to automatically hash passwords before storing them in the database. To enable it, simply mark the password field with the `@password` attribute.

```zmodel
model User {
    id Int @id @default(autoincrement())
    email String @unique
    password String @password
}
```

Under the hood, ZenStack uses [bcryptjs](https://github.com/dcodeIO/bcrypt.js/tree/master) to generate a hash.

See [here](/docs/reference/zmodel-language#password) for more details about the `@password` attribute.

#### 🛠️ Adding User Password

Let's add a `password` field to our `User` model, so we can implement credential-based authentication in the future.

```zmodel
model User {
    ...
    password String? @password
}
```

Rerun generation, push database schema, and start REPL:

```bash
npx zenstack generate
npx prisma db push
npx zenstack repl
```

Try to create a new user with a password:

```js
db.user.create({ data: { email: 'ross@zenstack.dev', password: 'abc123' }})
```

You may see a surprising error:

```js
denied by policy: user entities failed 'create' check, result is not allowed to be read back
Code: P2004
Meta: { reason: 'RESULT_NOT_READABLE' }
```

Recall that in previous chapters, we mentioned that "write can imply read". In this case, the `create` operation returns the created user object, which is subject to the "read" policy check. Since we're using an anonymous context, the read operation is denied.

However, if you use the raw Prisma Client to query, you can see the user is created, and his password is hashed:

```js
prisma.user.findFirst({ orderBy: { id: 'desc' } });
```

```js
{
  id: 3,
  createdAt: 2023-11-09T05:53:28.793Z,
  updatedAt: 2023-11-09T05:53:28.793Z,
  email: 'ross@zenstack.dev',
  password: '$2a$12$jYdALEg7gtIi.tc9JmFKuOG3X//0Cdo801xYotdtUw5pXV6Ahb.2m',
  name: null
}
```

:::info

This "result not readable" issue is often not a problem in practice, since a user with write privilege can also usually read. Sign-up flow is a special case where a user transitions from anonymous to authenticated. You can catch and ignore the error in the sign-up part. After the user logs in, you can use his identity for the subsequent operations.

Or alternatively, you can use the raw Prisma Client in the authentication part of your system.

:::

### Omitting Fields

Some database fields can be sensitive and should not be exposed to the client. Password is a good example (even when it's hashed). You can use the `@omit` attribute to mark a field, and it'll be automatically omitted when queried from an enhanced Prisma Client.

```zmodel
model User {
    ...
    password String @password @omit
}
```

:::info

You can use a field-level access policy to achieve the same goal:

```zmodel
model User {
    ...
    password String @password @allow('read', false)
}
```

However, using `@omit` is more appropriate since conceptually omitting sensitive field is not a permission issue.
:::

#### 🛠️ Omitting Password Field

Let's mark the `password` field with `@omit`:

```zmodel
model User {
    ...
    password String? @password @omit
}
```

Rerun generation, push database schema, and start REPL:

```bash
npx zenstack generate
npx prisma db push
npx zenstack repl
```

Query users, and you'll find the `password` field is omitted:

```js
.auth { id: 1 }
db.user.findFirst();
```

```js
{
  id: 1,
  createdAt: 2023-11-07T21:37:22.506Z,
  updatedAt: 2023-11-07T21:37:22.506Z,
  email: 'joey@zenstack.dev',
  name: 'Joey'
}
```
