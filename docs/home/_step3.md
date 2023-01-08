```ts
// pages/api/[...path].ts

// the standard Prisma client
const prisma = new PrismaClient();

// create a Next.js API endpoint handler
export default requestHandler({
    // set up a callback to get a database instance for handling the request
    getPrisma: async (req, res) => {
        // get current user in the session
        const user = await getSessionUser(req, res);

        // create a wrapper around Prisma client
        return withPolicy(prisma, { user });
    },
});
```
