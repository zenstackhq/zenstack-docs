---
sidebar_position: 3
sidebar_label: Custom
title: Custom API Handler
description: Extend or implement ZenStack API handlers to match your backend conventions.
---

# Custom API Handler

## Overview

ZenStack ships ready-to-use REST and RPC handlers, but you can tailor their behavior or author brand-new handlers without leaving TypeScript. All built-in handlers expose their methods as `protected` to allow for extension points. You can:

- override parts of the REST or RPC pipeline (filtering, serialization, validation, error handling, and more)
- wrap the default handlers with extra behavior (multi-tenancy, telemetry, custom logging)
- implement a handler from scratch while still benefiting from ZenStack's schema and serialization helpers

## Core building blocks

```ts
import {
    type ApiHandler,
    type RequestContext,
    type Response,
    type LogConfig,
} from '@zenstackhq/server/types';
import { registerCustomSerializers, getZodErrorMessage, log } from '@zenstackhq/server/api';
```

- `ApiHandler`, `RequestContext`, and `Response` define the framework-agnostic contract used by every server adapter.
- `LogConfig` (and the related `Logger` type) mirrors the handler `log` option so you can surface diagnostics consistently.
- `registerCustomSerializers` installs the Decimal/Bytes superjson codecs that power the built-in handlers—call it once when implementing your own handler.
- `getZodErrorMessage` and `log` help you align error formatting and logging with the defaults.

## Extending the REST handler

The REST handler exposes its internals (for example `buildFilter`, `processRequestBody`, `handleGenericError`, and serializer helpers) as `protected`, so subclasses can tweak individual steps without re-implementing the whole pipeline.

```ts
import { RestApiHandler, type RestApiHandlerOptions } from '@zenstackhq/server/api';
import { schema } from '~/zenstack/schema';

type Schema = typeof schema;

class PublishedOnlyRestHandler extends RestApiHandler<Schema> {
    constructor(options: RestApiHandlerOptions<Schema>) {
        // RestApiHandlerOptions is generic and must be parameterized with your schema type
        super(options);
    }

    protected override buildFilter(type: string, query: Record<string, string | string[]> | undefined) {
        const base = super.buildFilter(type, query);
        if (type !== 'post') {
            return base;
        }

        const existing =
            base.filter && typeof base.filter === 'object' && !Array.isArray(base.filter)
                ? { ...(base.filter as Record<string, unknown>) }  // ensure filter is a plain object before spreading
                : {};

        return {
            ...base,
            filter: {
                ...existing,
                published: true,
            },
        };
    }
}

export const handler = new PublishedOnlyRestHandler({
    schema,
    endpoint: 'https://api.example.com',
});
```

The override inserts a default `published` filter for the `post` collection while delegating everything else to the base class. You can apply the same pattern to other extension points, such as:

- `processRequestBody` to accept additional payload metadata;
- `handleGenericError` to hook into your observability pipeline;
- `buildRelationSelect`, `buildSort`, or `includeRelationshipIds` to expose bespoke query features.

For canonical behavior and extension points, see [RESTful API Handler](./rest).

## Extending the RPC handler

`RPCApiHandler` exposes similar `protected` hooks. Overriding `unmarshalQ` lets you accept alternative encodings for the `q` parameter, while still benefiting from the built-in JSON/SuperJSON handling.

```ts
import { RPCApiHandler, type RPCApiHandlerOptions } from '@zenstackhq/server/api';
import { schema } from '~/zenstack/schema';

type Schema = typeof schema;

class Base64QueryHandler extends RPCApiHandler<Schema> {
    constructor(options: RPCApiHandlerOptions<Schema>) {
        super(options);
    }

    protected override unmarshalQ(value: string, meta: string | undefined) {
        if (value.startsWith('base64:')) {
            const decoded = Buffer.from(value.slice('base64:'.length), 'base64').toString('utf8');
            return super.unmarshalQ(decoded, meta);
        }
        return super.unmarshalQ(value, meta);
    }
}

export const handler = new Base64QueryHandler({ schema });
```

The example uses Node's `Buffer` utility to decode the payload; adapt the decoding logic if you target an edge runtime.

Other useful hooks include:

- `processRequestPayload` for enforcing per-request invariants (e.g., injecting tenant IDs);
- `makeBadInputErrorResponse`, `makeGenericErrorResponse`, and `makeORMErrorResponse` for customizing the error shape;
- `isValidModel` if you expose a restricted subset of models to a specific client.

For canonical behavior and extension points, see [RPC API Handler](./rpc).

## Implementing a handler from scratch

When the built-in handlers are not a fit, implement the `ApiHandler` interface directly. Remember to call `registerCustomSerializers()` once so your handler understands Decimal and Bytes payloads the same way the rest of the stack does.

```ts
import type { ApiHandler, RequestContext, Response } from '@zenstackhq/server/types';
import { registerCustomSerializers } from '@zenstackhq/server/api';
import { schema } from '~/zenstack/schema';

type Schema = typeof schema;

registerCustomSerializers();

class HealthcheckHandler implements ApiHandler<Schema> {
    constructor(private readonly logLevel: 'info' | 'debug' = 'info') {}

    get schema(): Schema {
        return schema;
    }

    get log() {
        return undefined;
    }

    async handleRequest({ method }: RequestContext<Schema>): Promise<Response> {
        if (method.toUpperCase() !== 'GET') {
            return { status: 405, body: { error: 'Only GET is supported' } };
        }
        return { status: 200, body: { data: { status: 'ok', timestamp: Date.now() } } };
    }
}

export const handler = new HealthcheckHandler();
```

## Plugging a custom handler into your app

Custom handlers are consumed exactly like the built-in ones—hand them to any server adapter through the shared `apiHandler` option.

```ts
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import { PublishedOnlyRestHandler } from './handler';
import { getClientFromRequest } from './auth';

app.use(
    '/api',
    ZenStackMiddleware({
        apiHandler: new PublishedOnlyRestHandler({ schema, endpoint: 'https://api.example.com' }),
        getClient: getClientFromRequest,
    })
);
```

For adapter-level customization strategies, head over to [Custom Server Adapter](../../reference/server-adapters/custom).
