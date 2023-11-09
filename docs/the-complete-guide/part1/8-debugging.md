---
sidebar_label: 8. Debugging
---

#  Debugging

ZenStack provides you with a set of powerful tools to model the authorization aspects of your application. However, it is not always easy to understand why an operation is rejected, or why a query gives in seemingly incorrect results.

You can let ZenStack log all queries sent to the wrapped Prisma Client and use it to inspect the effect of your policy rules. To enable the logging, pass an extra `logPrismaQuery` option when calling the `enhance` function:

```ts
const db = enhance(prisma, { user }, { logPrismaQuery: true });
```

The logs are output to the logger of Prisma Client with "info" level, so to be able to see it on the console, you'll also need to make sure it's turned on in the Prisma Client options:

```ts
const prisma = new PrismaClient({ log: ['info'] });
```

After setting these up, you should be able to see all Prisma queries ZenStack makes in the console.

### 🛠️ Debugging In REPL

The REPL environment provides a ".debug" command for you to quickly turn on/off debugging output.

```js
.auth { id: 1 }
.debug
db.list.findMany()
```

You should see the Prisma queries injected by ZenStack printed in the console.

```js
prisma:info [policy] `findMany` list:
{
  where: {
    AND: [
      { NOT: { OR: [] } },
      {
        OR: [
          { owner: { is: { id: 1 } } },
          {
            AND: [
              {
                space: {
                  members: {
                    some: { user: { is: { id: 1 } } }
                  }
                }
              },
              { NOT: { private: true } }
            ]
          }
        ]
      }
    ]
  }
}
```
