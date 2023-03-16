You can use any HTTP client to consume the APIs. Here's some samples using [node-fetch](https://github.com/node-fetch/node-fetch):

```ts
const base = 'http://localhost:8080/api/openapi';

// create a user with two posts
const r = await fetch(`${base}/user/create`, {
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
    "id": "clf7y7k840000vhs3iej7skve",
    "email": "user1@abc.com",
    "posts": [
        {
            "id": "clf7y7k840001vhs377njs07l",
            "createdAt": "2023-03-14T07:45:04.036Z",
            "updatedAt": "2023-03-14T07:45:04.036Z",
            "title": "Post 1",
            "authorId": "clf7y7k840000vhs3iej7skve"
        },
        {
            "id": "clf7y7k840002vhs3w11iitmi",
            "createdAt": "2023-03-14T07:45:04.036Z",
            "updatedAt": "2023-03-14T07:45:04.036Z",
            "title": "Post 2",
            "authorId": "clf7y7k840000vhs3iej7skve"
        }
    ]
}
```
