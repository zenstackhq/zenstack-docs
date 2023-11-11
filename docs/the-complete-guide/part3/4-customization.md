---
sidebar_label: 4. Customization
---

# Customizing The Generated APIs

Having APIs derived from the schema is great, but sometimes you want to customize the them to fit your needs. Some of the common use cases are:

- Disallowing specific operations
- Transforming the result data into a different format
- Adding custom headers to responses

In this chapter, let's explore a few options to do that.

### Framework Middlewares

Most server frameworks provide some kind of "middleware" mechanism for developers to intercept requests and responses. For example, you can use a separate Express middleware to add custom a custom header to the response before it's sent to the client:

```ts
app.use('/api/rpc', 
    ZenStackMiddleware({
        getPrisma: (req) => enhance(prisma, { user: getUser(req) }),
        // instructs the middleware to not send the response,
        // instead, store it in `res.locals`
        sendResponse: false,
    }),
    (req: Request, res: Response) => {
        // another middleware to intercept the CRUD response,
        // add a header and send the response
        const { status, body } = res.locals;
        res.header('x-requested-by', req.headers['x-user-id']);
        res.status(status).json(body);
    }
);
```

### Custom Server Adapters

Since server adapters are just wrappers around API handlers, you can also implement a custom adapter by using the API handler directly. This way, you have full control over how the API handler's result data is processed and sent back to the client as a framework response.

The following code demonstrate how to add the 'x-requested-by' header with this approach:

```ts
import RESTHandler from '@zenstackhq/server/api/rest';

app.use('/api/rpc-custom', async (req: Request, res: Response) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const searchParams = new URL(url).searchParams;
    const query = Object.fromEntries(searchParams);
    const handler = RPCHandler();

    const { status, body } = await handler({
        method: req.method,
        path: req.path,
        query,
        requestBody: req.body,
        prisma: enhance(prisma, { user: getUser(req) }) as any,
    });

    res.status(status)
        .header('x-requested-by', req.header('x-user-id'))
        .json(body);
});
```

### Custom APIs

Using the automatic CRUD API doesn't mean you can't implement your own APIs. You can always build fully customized APIs from scratch leveraging the enhanced Prisma Client.
