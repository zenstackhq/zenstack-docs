---
description: RPC-style API handler
sidebar_position: 1
title: RPC API Handler
---

# RPC API Handler

The RPC-style API handler exposes CRUD APIs directly as HTTP endpoints that fully mirror PrismaClient's query API. Consuming the APIs feels like making RPC calls to a PrismaClient then. The API handler is not meant to be used directly; instead, you should use it together with a [server adapter](/docs/category/server-adapters) which handles the request and response API for a specific framework.

It can be created as the following:

```ts
import RPCApiHandler from '@zenstackhq/server/api/rpc';
const handler = RPCApiHandler();
```


### Data Format

#### Input

For endpoints using `GET` and `DELETE` Http verbs, the query body JSON serialized and passed as the `q` query parameter. E.g.:

- Endpoint: /api/post/findMany
- Query parameters: `q` -> `{ "where" : { "public": true } }`

For endpoints using other HTTP verbs, the query body is passed as `application/json` in the request body. E.g.:

- Endpoint: /api/post/create
- Request body: 
    ```json
    { "data": { "title": "Hello World" } }
    ```

#### Output

The output shape conforms to the data structure returned by the corresponding PrismaClient API. E.g.:

- Endpoint: /api/post/findMany
- Output: 
    ```json
    [ { "id": 1, "title": "Hello World" } } ]
    ```

### Endpoints

-   **[model]/findMany**

    _Http method:_ `GET`

-   **[model]/findUnique**

    _Http method:_ `GET`

-   **[model]/findFirst**

    _Http method:_ `GET`

-   **[model]/count**

    _Http method:_ `GET`

-   **[model]/aggregate**

    _Http method:_ `GET`

-   **[model]/groupBy**

    _Http method:_ `GET`

-   **[model]/create**

    _Http method:_ `POST`

-   **[model]/createMany**

    _Http method:_ `POST`

-   **[model]/update**

    _Http method:_ `PATCH` or `PUT`

-   **[model]/updateMany**

    _Http method:_ `PATCH` or `PUT`

-   **[model]/upsert**

    _Http method:_ `POST`

-   **[model]/delete**

    _Http method:_ `DELETE`

-   **[model]/deleteMany**

    _Http method:_ `DELETE`

### HTTP Status Code and Error Responses

#### Status code

The HTTP status code used by the endpoints follows the following rules:

- `create` and `createMany` use `201` for success. Other endpoints use `200`.
- `403` is used for to indicate the request is denied due to lack of permissions, usually caused by access policy violation.
- `400` is used for invalid requests, e.g., malformed request body.
- `500` is used for other unexpected errors.

#### Error response format

```ts
{
    // true to indicate the failure is due to a Prisma error
    prisma?: boolean;

    // true to indicate the failure is due to access policy violation
    rejectedByPolicy?: boolean;

    // original Prisma error code, available when `prisma` is true
    code?: string;

    // error message
    message: string;

    // extra reason about why a failure happened (e.g., 'RESULT_NOT_READABLE' indicates
    // a mutation succeeded but the result cannot be read back due to access policy)
    reason?: string;
}
```
