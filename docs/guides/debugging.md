---
sidebar_position: 5
---
# Debugging and Troubleshooting

ZenStack's access policies are powerful, but when the rules get complex, it can be challenging to reason why an operation is being allowed or denied. This guide lists some techniques for debugging and troubleshooting.

### Enable Debug Logging

ZenStack enforces access policies by injecting into Prisma queries, so a straightforward way to see what's going on is to enable logging of such queries. You can achieve it with two steps:

1. When calling `enhance()` to create an enhanced PrismaClient, pass in a `logPrismaQueries` option set to `true`:

    ```ts
    const db = enhance(prisma, { user }, { logPrismaQuery: true })
    ```

2. Enable "info" level logging on PrismaClient

    The queries will be logged into PrismaClient's logger with the "info" level, so you need to ensure that level is turned on when creating the PrismaClient instance.

    ```ts
    const prisma = new PrismaClient({ log: ['info'] });
    ```

When these are set up, you should be able to see all Prisma queries ZenStack makes in the console like the following:

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

### Try Things Out In REPL

The `zenstack` CLI provides a REPL environment for you to execute queries with the regular or enhanced PrismaClient interactively. You can quickly switch between different user contexts and see how the access policies affect the result.

Please find more details about the REPL in the [CLI reference](/docs/reference/cli#repl).

---

In the future, we may devise more advanced debugging tools that help you break down complex rules and pinpoint the one that causes an operation to be allowed or denied. Please stay tuned!
