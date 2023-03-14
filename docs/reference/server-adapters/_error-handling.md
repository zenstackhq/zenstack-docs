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

    // extra reason about why a failure happened (e.g., 'RESULT_NOT_READABLE' indicates
    // a mutation succeeded but the result cannot be read back due to access policy)
    reason?: string;
}
```
