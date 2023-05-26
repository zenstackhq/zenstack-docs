The APIs can be used in the following three ways:

1. With generated client hooks

    ZenStack provides plugins to generate client hooks from the ZModel targeting the most popular frontend data fetching libraries: [TanStack Query](https://tanstack.com/query/latest) and [SWR](https://swr.vercel.app/). The generated hooks can be used to make API calls to the server adapters. Refer to the follow docs for detailed usage:

    - [`@zenstackhq/tanstack-query`](/docs/reference/plugins/tanstack-query)
    - [`@zenstackhq/swr`](/docs/reference/plugins/swr)
    <br/><br/>

    :::info
    The generated client hooks assumes the server adapter uses [RPC-style API handler](/docs/reference/server-adapters/api-handlers/rpc) (which is the default setting).
    :::

1. With directh HTTP calls

    You can make direct HTTP calls to the server adapter using your favorite client libraries like `fetch` or `axios`. Refer to the documentation of the [API Handlers](/docs/category/api-handlers) for the API endpoints and data formats.

    Here's an example using `fetch` (with RPC-style API handler):

    ```ts
    // create a user with two posts
    const r = await fetch(`/api/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            include: { posts: true },
            data: {
                email: 'user1@abc.com',
                posts: {
                    create: [{ title: 'Post 1' }, { title: 'Post 2' }],
                },
            },
        }),
    });

    console.log(await r.json());
    ```

    Output:

    ```json
    {
        "id": 1,
        "email": "user1@abc.com",
        "posts": [
            {
                "id": 1,
                "createdAt": "2023-03-14T07:45:04.036Z",
                "updatedAt": "2023-03-14T07:45:04.036Z",
                "title": "Post 1",
                "authorId": 1
            },
            {
                "id": 2,
                "createdAt": "2023-03-14T07:45:04.036Z",
                "updatedAt": "2023-03-14T07:45:04.036Z",
                "title": "Post 2",
                "authorId": 1
            }
        ]
    }
    ```

1. With third-party client generators

    ZenStack provides an [OpenAPI](/docs/reference/plugins/openapi) plugin for generating Open API 3.x specification from the ZModel. The generated OpenAPI spec can be used to generate client libraries for various languages and frameworks. For example, you can use [openapi-typescript](https://github.com/drwpow/openapi-typescript) to generate a typescript client.
