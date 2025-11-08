---
sidebar_position: 1
---

import DataTypeSerialization from './_data_type_serialization.md';

# RPC API Handler

## Introduction

The RPC-style API handler exposes CRUD endpoints that fully mirror [ZenStack's ORM API](../../orm/api/). Consuming the APIs feels like making RPC calls to a ZenStackClient then. The API handler is not meant to be used directly; instead, you should use it together with a [server adapter](../../../category/server-adapters) which handles the request and response API for a specific framework.

It can be created and used as the following:

```ts
import { schema } from '~/zenstack/schema';
import { RPCApiHandler } from '@zenstackhq/server/api';

const handler = new RPCApiHandler({ schema });
```

## Wire Format

### Input

For endpoints using `GET` and `DELETE` Http verbs, the query body is serialized and passed as the `q` query parameter. E.g.:

```ts
GET /api/post/findMany?q=%7B%22where%22%3A%7B%22public%22%3Atrue%7D%7D
```

- Endpoint: /api/post/findMany
- Query parameters: `q` -> `{ "where" : { "public": true } }`

For endpoints using other HTTP verbs, the query body is passed as `application/json` in the request body. E.g.:

```json
POST /api/post/create
{ "data": { "title": "Hello World" } }
```

### Output

The output shape conforms to the data structure returned by the corresponding ZenStackClient API, wrapped into a `data` field. E.g.:

```json
GET /api/post/findMany

{
    "data": [ { "id": 1, "title": "Hello World" } ]
}
```

### Serialization

This section explains the details about data serialization. If you're using generated hooks to consume the API, the generated code already automatically deals with serialization for you, and you don't need to do any further processing.

ZenStack uses [superjson](https://github.com/blitz-js/superjson) to serialize and deserialize data - including the `q` query parameter, the request body, and the response body. Superjson generates two parts during serialization:

- json:

    The JSON-compatible serialization result.

- meta:

    The serialization metadata including information like field types that facilitates deserialization.

If the data only involves simple data types, the serialization result is the same as regular `JSON.stringify`, and no `meta` part is generated. However, for complex data types (like `Bytes`, `Decimal`, etc.), a `meta` object will be generated, which needs to be carried along when sending the request, and will also be included in the response.

The following part explains how the `meta` information is included for different situations:

- The `q` query parameter

    If during superjson-serialization of the `q` parameter, a `meta` object is generated, it should be put into an object `{ serialization: meta }`, JSON-stringified, and included as an additional query parameter `meta`. For example, if you have a field named `bytes` of `Bytes` type, and you may want to query with a filter like ```{ where: { bytes: Buffer.from([1,2,3]) } }```. Superjson-serializing the query object results in:
    ```json
    {
        "json": { "where": { "bytes": "AQID" } }, // base-64 encoded bytes
        "meta": { "values": { "where.bytes": [["custom","Bytes"]] } }
    }
    ```
    Your query URL should look like:
    ```json
    GET /api/post/findMany?q={"where":{"bytes":"AQID"}}&meta={"serialization":{"values":{"where.bytes":[["custom","Bytes"]]}}}
    ```

- The request body

    If during superjson-serialization of the request body, a `meta` object is generated, it should be put into an object `{ serialization: meta }`, and included as an additional field `meta` field in the request body. For example, if you have a field named `bytes` of `Bytes` type, and you may want to create a record with a value like ```{ data: { bytes: Buffer.from([1,2,3]) } }```. Superjson-serializing the request body results in:
    ```json
    {
        "json": { "bytes": "AQID" }, // base-64 encoded bytes
        "meta": { "values": { "bytes": [[ "custom", "Bytes" ]] } }
    }
    ```
    Your request body should look like:
    ```json
    POST /api/post/create

    { 
        "data": { "bytes": "AQID" },
        "meta": { "serialization": {"values": { "bytes": [[ "custom","Bytes" ]] } } } 
    }
    ```

- The response body

    If during superjson-serialization of the response body, a `meta` object is generated, it will be put into an object `{ serialization: meta }`, and included as an additional field `meta` field in the response body. For example, if you have a field named `bytes` of `Bytes` type, and a `findFirst` query returns ```{ id: 1, bytes: Buffer.from([1,2,3]) }```. Superjson-serializing the request body results in:
    ```json
    {
        "json": { "id": 1, "bytes":"AQID" }, // base-64 encoded bytes
        "meta": { "values": { "bytes": [[ "custom", "Bytes" ]] } }
    }
    ```
    Your response body will look like:
    ```json
    GET /api/post/findFirst

    { 
        "data": { "id": 1, "bytes": "AQID" },
        "meta": { "serialization": {"values": { "bytes": [[ "custom","Bytes"]] } } } 
    }
    ```

    You should use the meta.serialization field value to superjson-deserialize the response body.

#### Data Type Serialization Format

<DataTypeSerialization />

## Endpoints

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

-   **[model]/check**

    _Http method:_ `GET`

## HTTP Status Code and Error Responses

### Status code

The HTTP status code used by the endpoints follows the following rules:

- `create` and `createMany` use `201` for success. Other endpoints use `200`.
- `400` is used for generic invalid requests, e.g., malformed request body.
- `403` is used for to indicate the request is denied due to lack of permissions, usually caused by access policy violation.
- `404` is used to indicate the requested record is not found.
- `422` is used for input validation errors.
- `500` is used for other unexpected errors.

### Error response format

When an error occurs, the response body will have the following shape. See [ORM error](../../orm/errors.md) for details of the `ORMErrorReason` and `RejectedByPolicyReason` enums.

```ts
{
    body: {
        error: {
            // HTTP status code, same as the response status code
            status: number;

            // error message
            message: string;

            // reason of the error
            reason: ORMErrorReason;

            // the model name involved in the error, if applicable
            model?: string;

            // indicates if the failure is due to input validation errors
            rejectedByValidation?: boolean;

            // indicates if the failure is due to access policy violation
            rejectedByPolicy?: boolean;

            // detailed rejection reason, only available when 
            // `rejectedByValidation` or `rejectedByPolicy` is true
            rejectReason?: RejectedByPolicyReason;

            // the error code given by the underlying database driver
            dbErrorCode?: unknown;
        }
    }
}
```
