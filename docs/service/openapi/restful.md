---
sidebar_position: 2
---

import AvailableSince from '../../_components/AvailableSince';

# RESTful API

<AvailableSince version="v3.5.0" />

The RESTful API handler can generate an OpenAPI v3.1 specification that describes all its [JSON:API](https://jsonapi.org/)-compliant endpoints. The spec is generated at runtime from your ZModel schema, so it always stays in sync with your data model.

## Generating the Spec

Call the `generateSpec` method on a `RestApiHandler` instance:

```ts
import { schema } from '~/zenstack/schema';
import { RestApiHandler } from '@zenstackhq/server/api';

const handler = new RestApiHandler({ schema, ... });

const spec = await handler.generateSpec();

// Use with Swagger UI, write to a file, or serve as a JSON endpoint
console.log(JSON.stringify(spec));
```

### Options

The `generateSpec` method accepts an optional `OpenApiSpecOptions` object:

```ts
import type { OpenApiSpecOptions } from '@zenstackhq/server/api';

const spec = await handler.generateSpec({
    title: 'My Blog API',
    version: '2.0.0',
    description: 'API for managing blog posts and users',
    summary: 'Blog API',
    respectAccessPolicies: true,
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'ZenStack Generated API'` | The title of the API shown in the spec's `info.title` field. |
| `version` | `string` | `'1.0.0'` | The version of the API shown in the spec's `info.version` field. |
| `description` | `string` | — | A longer description of the API. |
| `summary` | `string` | — | A short summary of the API. |
| `respectAccessPolicies` | `boolean` | `false` | When `true`, adds `403 Forbidden` responses to operations on models that have access policies defined. |

## Serving the Spec

A common pattern is to expose the spec as a JSON endpoint alongside your API:

```ts title="Express example"
import express from 'express';
import { schema } from '~/zenstack/schema';
import { RestApiHandler } from '@zenstackhq/server/api';

const app = express();
const handler = new RestApiHandler({ schema, endpoint: 'http://localhost:3000/api' });

// Serve the OpenAPI spec
app.get('/api/openapi.json', async (_req, res) => {
    const spec = await handler.generateSpec({
        title: 'My API',
        respectAccessPolicies: true,
    });
    res.json(spec);
});
```

You can then point tools like Swagger UI to `http://localhost:3000/api/openapi.json`.

You can also implement a script to wrap the generation logic to output the spec during build.

## Customization Through Handler Options

The generated spec is influenced by the `RestApiHandler` options you provide:

### Model Name Mapping

If you configure `modelNameMapping`, the spec uses the mapped names in URL paths:

```ts
const handler = new RestApiHandler({
    schema,
    endpoint: 'http://localhost:3000/api',
    modelNameMapping: { User: 'users', Post: 'posts' },
});
```

This produces paths like `/users` and `/posts` instead of `/user` and `/post`.

### Query Options

The `queryOptions` passed to the handler influence the generated spec in several ways:

#### Slicing

If you provide a `slicing` configuration, the spec only includes the models, operations, procedures, and filter kinds that are allowed:

```ts
const handler = new RestApiHandler({
    schema,
    endpoint: 'http://localhost:3000/api',
    queryOptions: {
        slicing: {
            includedModels: ['User', 'Post'],
            models: {
                post: {
                    excludedOperations: ['delete'],
                },
            },
        },
    },
});
```

The generated spec will only contain `User` and `Post` models and will omit the `DELETE /post/{id}` endpoint.

#### Omit

If you provide an `omit` configuration, the specified fields are excluded from the generated schemas:

```ts
const handler = new RestApiHandler({
    schema,
    endpoint: 'http://localhost:3000/api',
    queryOptions: {
        omit: {
            user: { password: true },
        },
    },
});
```

The `password` field will not appear in the `User` resource schema, create request schema, or update request schema.
