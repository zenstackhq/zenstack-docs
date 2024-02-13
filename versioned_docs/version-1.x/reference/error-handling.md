---
description: Error handling
sidebar_position: 6
---

# Error Handling

ZenStack's enhancements to Prisma clients are transparent proxies, so normal errors thrown from a Prisma client simply pass through, and you can handle them the same way as you do in a regular Prisma project. It's good to read these references from Prisma:

-   [Handling exceptions and errors](https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors)
-   [Error message reference](https://www.prisma.io/docs/reference/api-reference/error-reference)

The enhanced Prisma client can throw extra errors when an operation is rejected by [access policies](/docs/reference/zmodel-language#access-policy) or its data fails [validation rules](/docs/reference/zmodel-language#data-validation). To keep a consistent programming experience, a `PrismaClientKnownRequestError` is thrown with code [`P2004`](https://www.prisma.io/docs/reference/api-reference/error-reference#p2004) is used in such cases:

```ts
throw new PrismaClientKnownRequestError(message, {
    clientVersion: getVersion(),
    code: 'P2004',
    meta: ...
});
```

The error contains a `meta` field providing more information about the error. It contains the following fields:

- `reason`
    
    A string field indicating the detailed reason of the rejection. Its value can be one of the following:

    - *ACCESS_POLICY_VIOLATION*
  
        CRUD failed because of access policy violation.

    - *RESULT_NOT_READABLE*
  
        CRUD succeeded but the result was not readable (violating "read" access policies).

    - *DATA_VALIDATION_VIOLATION*
    
        CRUD failed because of a [data validation](/docs/reference/zmodel-language#data-validation) error.

- `zodErrors`
  
    An object field containing the raw Zod validation errors. Only present if the `reason` is `DATA_VALIDATION_VIOLATION`. See [Zod documentation](https://zod.dev/?id=error-handling) for more details.
