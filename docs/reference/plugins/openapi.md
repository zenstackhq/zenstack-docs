---
description: Plugin for generating OpenAPI 3.0 specifications
sidebar_position: 5
---

# @zenstackhq/openapi

The `@zenstackhq/openapi` generates an [OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3) specification based on your ZModel schema. The output is a plain YAML or JSON file that can be used with tools like [Swagger UI](https://swagger.io/tools/swagger-ui/). You can also merge it with other OpenAPI specifications before serving it to your users.

## Options

| Name        | Type   | Description                                   | Required | Default                |
| ----------- | ------ | --------------------------------------------- | -------- | ---------------------- |
| output      | String | Output file path (with suffix .yaml or .json) | Yes      |                        |
| title       | String | API title                                     | No       | ZenStack Generated API |
| version     | String | API version                                   | No       | 1.0.0                  |
| prefix      | String | API path prefix, e.g., '/api'                 | No       |                        |
| description | String | API description                               | No       |                        |
| summary     | String | API summary                                   | No       |                        |

## Attributes

-   `@@openapi.meta`

    ```prisma
        attribute @@openapi.meta(_ meta: Object)
    ```

    Provide metadata for a data model for generating OpenAPI specification. The input is an object containing customized configuration for each model and each CRUD operation. You can use to override per-operation-level Http method, API endpoint path, description, summary and tags. Currently there's no type checking for the structure, but we'll add that in the near future.

    For example:

    ```prisma
    model User {
        id String @id
        email String @unique

        @@openapi.meta({
            findMany: {
                description: 'Find users matching the given conditions'
            },
            delete: {
                method: 'put',
                path: 'dodelete',
                description: 'Delete a unique user',
                summary: 'Delete a user yeah yeah',
                tags: ['delete', 'user']
            },
        })
    }
    ```

-   `@@openapi.ignore`

    ```prisma
    attribute @@openapi.ignore()
    ```

    Mark a data model to be ignored when generating OpenAPI specification.

## Example

```prisma title='/schema.zmodel'
datasource db {
    provider = 'sqlite'
    url = 'file:./dev.db'
}

plugin openapi {
    provider = '@zenstackhq/openapi'
    output = './openapi.yaml'
    title = 'My awesome API'
    version = '0.5.0'
    summary = 'Created with ZenStack'
    description = 'My awesome API created with ZenStack'
    prefix = '/api'
}
```

## Generated API paths

The generated API paths have 1:1 mapping with PrismaClient's CRUD methods. For `GET`/`DELETE` operations, the query args is passed as JSON-stringified text in the query parameter `q`. For `POST`/`PATCH`/`PUT` operations, the query args is passed as `application/json` in the request body.

Check [here](https://editor.swagger.io/?url=https://gist.githubusercontent.com/ymc9/9c48bfbc9a0853ceb43497c3228c342b/raw/e264e4b04cb2d7c98ef02b64a84531c77a196d7a/blogging.openapi.yaml) for the generated specification for a blogging app.

-   **[model]/findMany**

    _Default Http method:_ `GET`

-   **[model]/findUnique**

    _Default Http method:_ `GET`

-   **[model]/findFirst**

    _Default Http method:_ `GET`

-   **[model]/count**

    _Default Http method:_ `GET`

-   **[model]/aggregate**

    _Default Http method:_ `GET`

-   **[model]/groupBy**

    _Default Http method:_ `GET`

-   **[model]/create**

    _Default Http method:_ `POST`

-   **[model]/createMany**

    _Default Http method:_ `POST`

-   **[model]/update**

    _Default Http method:_ `PATCH` or `PUT`

-   **[model]/updateMany**

    _Default Http method:_ `PATCH` or `PUT`

-   **[model]/upsert**

    _Default Http method:_ `POST`

-   **[model]/delete**

    _Default Http method:_ `DELETE`

-   **[model]/deleteMany**

    _Default Http method:_ `DELETE`
