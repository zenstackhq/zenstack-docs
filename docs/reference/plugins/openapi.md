---
description: Plugin for generating OpenAPI 3.0 specifications
sidebar_position: 8
---

# @zenstackhq/openapi

The `@zenstackhq/openapi` generates an [OpenAPI V3](https://spec.openapis.org/oas/v3.1.0) specification based on your ZModel schema. The output is a plain YAML or JSON file that can be used with tools like [Swagger UI](https://swagger.io/tools/swagger-ui/). You can also merge it with other OpenAPI specifications before serving it to your users.

## Options

| Name            | Type   | Description                                                                   | Required | Default                |
| --------------- | ------ | ----------------------------------------------------------------------------- | -------- | ---------------------- |
| output          | String | Output file path (with suffix .yaml or .json)                                 | Yes      |                        |
| specVersion     | String | OpenAPI specification version                                                 | No       | 3.1.0                  |
| title           | String | API title                                                                     | No       | ZenStack Generated API |
| version         | String | API version                                                                   | No       | 1.0.0                  |
| prefix          | String | API path prefix, e.g., '/api'                                                 | No       |                        |
| description     | String | API description                                                               | No       |                        |
| summary         | String | API summary                                                                   | No       |                        |
| securitySchemes | Object | Security schemes for the API. See [here](#security-schemes) for more details. | No       |                        |

### Security schemes

The `securitySchemes` option is an object containing security schemes for the API, following the specification [here](https://swagger.io/docs/specification/authentication/). The object will be generated as the `securitySchemes` field under the `components` section in the OpenAPI specification.

Example usage:

```prisma
plugin openapi {
    provider = '@zenstackhq/openapi'
    securitySchemes = {
        basic: { type: 'http', scheme: 'basic' },
        bearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        apiKey: { type: 'apiKey', in: 'header', name: 'X-API-KEY' }
    }
}
```

The names of the configured security schemes will be added to the root `security` field and inherited by all operations. The plugin also respects the access policy rules defined in the schema. If a operation is fully open (e.g., `create` operation with `@@allow('create', true)` rule), an empty security array will be added to the operation to mark it as unprotected.

You can override the security scheme for a specific model or operation by using the `@@openapi.meta` attribute.

## Attributes

-   `@@openapi.meta`

    ```prisma
        attribute @@openapi.meta(_ meta: Object)
    ```

    Provide metadata for a data model for generating OpenAPI specification. The input is an object containing customized configuration for each model and each CRUD operation. You can use it to override Http method, API endpoint path, description, summary, tags, security, and etc. Currently there's no type checking for the structure, but we'll add that in the near future.

    ### Model-level metadata

    The input object can contain the following top-level fields:

    | Name           | Type   | Description                                     | Default                 |
    | -------------- | ------ | ----------------------------------------------- | ----------------------- |
    | security       | Array  | Security for this model                         |                         |
    | tagDescription | String | Description of the tag generated for this model | [Model Name] operations |

    ### Operation-level metadata

    The input object can contain operation-level metadata keyed by the Prisma operation name. Each entry can contain the following fields:

    | Name        | Type   | Description                         | Default                                 |
    | ----------- | ------ | ----------------------------------- | --------------------------------------- |
    | security    | Array  | Security for this operation         |                                         |
    | description | String | Description of the operation        |                                         |
    | method      | String | HTTP method of the operation        | Depends on the operation                |
    | path        | String | API endpoint path of the operation  | The corresponding Prisma operation name |
    | summary     | String | Summary of the operation            |                                         |
    | tags        | Array  | Tags of the operation               |                                         |
    | deprecated  | Bool   | Whether the operation is deprecated | false                                   |

    ### Example

    ```prisma
    model User {
        id String @id
        email String @unique

        @@openapi.meta({
            security: [ { basic: [] } ],
            tagDescription: 'Operations for managing users',
            findMany: {
                description: 'Find users matching the given conditions'
            },
            delete: {
                method: 'put',
                path: 'dodelete',
                description: 'Delete a unique user',
                summary: 'Delete a user yeah yeah',
                tags: ['delete', 'user'],
            },
            createMany: {
                security: [],
                deprecated: true
            }
        })
    }
    ```

-   `@@openapi.ignore`

    ```prisma
    attribute @@openapi.ignore()
    ```

    Mark a data model to be ignored when generating OpenAPI specification.

## Example

```prisma title='schema.zmodel'
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

Check [here](https://editor.swagger.io/?url=https://gist.githubusercontent.com/ymc9/2888fae6fa60f1c7b26a8c226e6bab2f/raw/a4c78732a158a3436b6d5779695b6ab11a6edcf5/petstore.api.yaml) for the generated specification for a blogging app.

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
