---
description: Package for integrating with Next.js
sidebar_position: 3
---

# @zenstackhq/next

The `@zenstackhq/next` provides a quick way to install API endpoints onto a Next.js project for exposing database CRUD. Combined with ZenStack's power of enhancing Prisma with access policies, it's surprisingly simple to achieve a secure data backend without manually coding it.

### Exports

The package exports one single function:

```ts
/**
 * Options for initializing a Next.js API endpoint request handler.
 * @see requestHandler
 */
export type RequestHandlerOptions = {
    /**
     * Callback method for getting a Prisma instance for the given request/response pair.
     */
    getPrisma: (
        req: NextApiRequest,
        res: NextApiResponse
    ) => Promise<unknown> | unknown;

    /**
     * Whether to use superjson for serialization/deserialization. Defaults to true.
     */
    useSuperJson?: boolean;
};

/**
 * Creates a Next.js API endpoint request handler which encapsulates Prisma CRUD operations.
 *
 * @param options Options for initialization
 * @returns An API endpoint request handler
 */
export function requestHandler(
    options: RequestHandlerOptions
): (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
```

The `getPrisma` callback is for getting a Prisma client instance for the context of a request. You can use a plain Prisma client or one with ZenStack enhancements, but most likely, you'll use one enhanced by `withPolicy` or `withPresets` to ensure access policies are enforced.

### Examples

You can use it to create a request handler in an API endpoint like:

```ts title='/src/pages/api/model/[...path].ts'
import { requestHandler } from '@zenstackhq/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { withPresets } from '@zenstackhq/runtime';
import { getSessionUser } from '../../../lib/auth.ts';

function getPrisma(req: NextApiRequest, res: NextApiResponse) {
    return withPresets({ user: getSessionUser(req, res) });
}

export default requestHandler({ getPrisma });
```

The APIs can be easily consumed using the [`@zenstackhq/react`](./react) plugin.

### Error Handling

The request handler catches [Prisma errors](https://www.prisma.io/docs/reference/api-reference/error-reference) and turns them into responses with proper HTTP status and body.

-   `PrismaClientKnownRequestError` with code `P2004` is mapped to HTTP 403 to indicate the request is denied due to lack of permission.
-   Other `PrismaClientKnownRequestError`, `PrismaClientUnknownRequestError` and `PrismaClientValidationError` are mapped to HTTP 400.
-   None-prisma errors are mapped to HTTP 500.

Error body:

```ts
{
    // true for Prisma errors
    prisma?: boolean;

    // true for PrismaClientKnownRequestError with code 'P2004'
    rejectedByPolicy?: boolean;

    // original Prisma error code, available for PrismaClientKnownRequestError
    code?: string;

    // error message
    message: string;
}
```
