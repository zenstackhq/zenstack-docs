---
sidebar_position: 3
---

import AvailableSince from '../../_components/AvailableSince';
import OpenApiSpecOptions from './_openapi_spec_options.md';

# RPC-Style API

<AvailableSince version="v3.6.0" />

The RPC API handler can generate an OpenAPI v3.1 specification that describes all its endpoints. The spec is generated at runtime from your ZModel schema, so it always stays in sync with your data model.

## Generating the Spec

Call the `generateSpec` method on an `RPCApiHandler` instance:

```ts
import { schema } from '~/zenstack/schema';
import { RPCApiHandler } from '@zenstackhq/server/api';

const handler = new RPCApiHandler({ schema, ... });

const spec = await handler.generateSpec();

// Use with Swagger UI, write to a file, or serve as a JSON endpoint
console.log(JSON.stringify(spec));
```

### Options

<OpenApiSpecOptions />

## Serving the Spec

A common pattern is to expose the spec as a JSON endpoint alongside your API:

```ts title="Express example"
import express from 'express';
import { schema } from '~/zenstack/schema';
import { RPCApiHandler } from '@zenstackhq/server/api';

const app = express();
const handler = new RPCApiHandler({ schema, endpoint: 'http://localhost:3000/api' });

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

The generated spec is influenced by the `RPCApiHandler` options you provide:

### Query Options

The `queryOptions` passed to the handler influence the generated spec in several ways:

#### Slicing

If you provide a [slicing](../../orm/advanced/slicing.md) configuration, the spec only includes the models, operations, procedures, and filter kinds that are allowed:

```ts
const handler = new RPCApiHandler({
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

The generated spec will only contain `User` and `Post` models and will omit the `DELETE /post/delete` endpoint.

#### Omit

If you provide an `omit` configuration, the specified fields are excluded from the generated schemas:

```ts
const handler = new RPCApiHandler({
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
