```ts
// pages/api/[...path].ts

// the standard Prisma client
const prisma = new PrismaClient();

export default requestHandler({
    getPrisma: async (req, res) => {
        // get current user in the session
        const user = await getSessionUser(req, res);

        // create a wrapper around Prisma client
        return withPolicy(prisma, { user });
    },
});
```
