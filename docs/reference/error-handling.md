---
description: Error handling
sidebar_position: 6
---

# Error Handling

ZenStack's enhancements to Prisma clients are transparent proxies, so normal errors thrown from a Prisma client simply pass through, and you can handle them the same way as you do in a regular Prisma project. It's good to read these references from Prisma:

-   [Handling exceptions and errors](https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors)
-   [Error message reference](https://www.prisma.io/docs/reference/api-reference/error-reference)

When you use `withPolicy` or `withPresets` enhancements, the wrapped Prisma client can throw extra errors when an operation is rejected by [access policies](/docs/reference/zmodel-language#access-policy) or its data fails [validation rules](/docs/reference/zmodel-language#field-validation). To keep a consistent programming experience, a `PrismaClientKnownRequestError` is thrown with code [`P2004`](https://www.prisma.io/docs/reference/api-reference/error-reference#p2004) is used in such cases:

```ts
throw new PrismaClientKnownRequestError(message, {
    clientVersion: getVersion(),
    code: 'P2004',
});
```
