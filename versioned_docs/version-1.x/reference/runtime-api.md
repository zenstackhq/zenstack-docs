---
description: Runtime API references
sidebar_position: 3
sidebar_label: Runtime API
---

# Runtime API Reference

This document provides references for runtime APIs exported from the `@zenstackhq/runtime` package.

## Prisma Enhancement API

Enhancement APIs create wrappers around a Prisma client to add additional behavior. These wrappers can be freely combined to fine-tune what behavior to include.

### enhance

#### Description

Calling `enhance` is the simplest way to include all essential enhancements offered by ZenStack, including access policies, field validation, field omission, and password hashing. It's equivalent to calling:

```ts
withOmit(withPassword(withPolicy(prisma, options)));
```

#### Signature

```ts
function enhance<DbClient extends object>(
    prisma: DbClient,
    context?: WithPolicyContext,
    options?: EnhancementOptions
): DbClient;
```

##### Parameter `prisma`

The PrismaClient instance to enhance.

##### Parameter `context`

The context to for evaluating access policies with the following typing.

```ts
type WithPolicyContext = {
    user?: Record<string, unknown>
};
```

| Field | Description |
| ----- | ----------- |
| user  | The user object that provides value for the `auth()` function call in access policies. If provided. Its shape should be consistent with the `User` model in your ZModel, with all fields optional except for id field(s). Pass `undefined` to represent an anonymous user, and the `auth()` function call will evaluate to `null` in that case. |

##### Parameter `options`

Options with the following typing.

```ts
type EnhancementOptions = {
    loadPath?: string;
    policy?: PolicyDef;
    modelMeta?: ModelMeta;
    logPrismaQuery?: boolean;
};
```

| Field          | Description                                                                                      | Default                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| loadPath       | Path for loading CLI-generated code, including model metadata, access policies, and zod schemas. | node_modules/.zenstack                                                          |
| policy         | The access policy data, generated by `@core/access-policy` plugin.                               | Loaded from the default location or the path specified by the "loadPath" option |
| modelMeta      | The model metadata, generated by `@core/model-meta` plugin.                                      | Loaded from the default location or the path specified by the "loadPath" option |
| zodSchemas     | The zod schemas, generated by `@core/zod` plugin.                                                | Loaded from the default location or the path specified by the "loadPath" option |
| logPrismaQuery | Whether to log queries sent to Prisma client. Log will be emitted with "info" level, so please make sure you [turn that level on](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging#log-to-stdout) when creating Prisma client | false                        |

#### Example

```ts
const session = getSession();
const enhancedClient = enhance(prisma, { user: session.user });
```

### withPresets

#### Description

:::warning
This API is equivalent to [`enhance`](#enhance) and will be deprecated soon.
:::

### withPolicy

Use `withPolicy` to include enhancements of access policy (`@@allow` and `@@deny`) and field validation (`@length`, `@email`, etc.).

Access policies and validation rules are processed by the `@core/access-policy` plugin, which transforms the attributes into objects that can be loaded at runtime by default into `node_modules/.zenstack` folder. `withPolicy` function also loads from there by default.

If your access policy rules use the `auth()` function, evaluating it requires access to the current user's identity. You need to pass in a context user object that at least contains the user id.

#### Signature

```ts
function withPolicy<DbClient extends object>(
    prisma: DbClient,
    context?: WithPolicyContext,
    options?: WithPolicyOptions
): DbClient;
```

##### Parameter `prisma`

The PrismaClient instance to enhance.

##### Parameter `context`

The context to for evaluating access policies with the following typing.

```ts
type WithPolicyContext = {
    user?: Record<string, unknown>
};
```

| Field | Description | Default |
| ----- | ----------- | ------- |
| user  | The user object that provides value for the `auth()` function call in access policies. If provided. Its shape should be consistent with the `User` model in your ZModel, with all fields optional except for id field(s). Pass `undefined` to represent an anonymous user, and the `auth()` function call will evaluate to `null` in that case. | undefined |

##### Parameter `options`

Options with the following typing.

```ts
type WithPolicyOptions = {
    loadPath?: string;
    policy?: PolicyDef;
    modelMeta?: ModelMeta;
    logPrismaQuery?: boolean;
};
```

| Field          | Description                                                                                      | Default                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| loadPath       | Path for loading CLI-generated code, including model metadata, access policies, and zod schemas. | node_modules/.zenstack                                                          |
| policy         | The access policy data, generated by `@core/access-policy` plugin.                               | Loaded from the default location or the path specified by the "loadPath" option |
| modelMeta      | The model metadata, generated by `@core/model-meta` plugin.                                      | Loaded from the default location or the path specified by the "loadPath" option |
| zodSchemas     | The zod schemas, generated by `@core/zod` plugin.                                                | Loaded from the default location or the path specified by the "loadPath" option |
| logPrismaQuery | Whether to log queries sent to Prisma client. Log will be emitted with "info" level, so please make sure you [turn that level on](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging#log-to-stdout) when creating Prisma client | false                        |

#### Example

```zmodel
// ZModel
model Post {
    id String @id
    title String
    author User @relation(fields: [authorId], references: [id])
    authorId String

    @@allow('read', auth() == author)
}
```

```ts
const session = getSession();
const enhanced = withPolicy(prisma, { user: session.user });
// only posts belonging to the current user are returned
const posts = enhanced.post.findMany();
```

### withOmit

Use `withOmit` function to include support for the `@omit` attribute. Fields marked with the attribute will be removed from the entities when they're returned.

#### Signature

```ts
function withOmit<DbClient extends object>(
    prisma: DbClient,
    options?: WithOmitOptions
): DbClient;
```

##### Parameter `prisma`

The PrismaClient instance to enhance.

##### Parameter `options`

Options with the following typing.

```ts
type WithOmitOptions = {
    loadPath?: string;
    modelMeta?: ModelMeta;
};
```

| Field          | Description                                                                                      | Default                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| loadPath       | Path for loading CLI-generated code, including model metadata, access policies, and zod schemas. | node_modules/.zenstack                                                          |
| modelMeta      | The model metadata, generated by `@core/model-meta` plugin. Only need to pass it if you configured the plugin to generate into custom location.        | Loaded from default location |

#### Example

```zmodel
// ZModel
model User {
    id String @id
    email String
    password String @omit
}
```

```ts
const enhanced = withOmit(prisma);
// password field is removed from user entities
const user = enhanced.user.findMany();
```

### withPassword

Use `withPassword` function to include support for the `@password` attribute. Fields marked with the attribute will be automatically hashed (using [bcryptjs](https://www.npmjs.com/package/bcryptjs)) before being stored.

#### Signature

```ts
function withPassword<DbClient extends object = any>(
    prisma: DbClient,
    options?: WithPasswordOptions
): DbClient;
```

##### Parameter `prisma`

The PrismaClient instance to enhance.

##### Parameter `options`

Options with the following typing.

```ts
type WithPasswordOptions = {
    loadPath?: string;
    modelMeta?: ModelMeta;
};
```

| Field          | Description                                                                                      | Default                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| loadPath       | Path for loading CLI-generated code, including model metadata, access policies, and zod schemas. | node_modules/.zenstack                                                          |
| modelMeta      | The model metadata, generated by `@core/model-meta` plugin.                                      | Loaded from the default location or the path specified by the "loadPath" option |

#### Example

```zmodel
// ZModel
model User {
    id String @id
    email String
    password String @password
}
```

```ts
const enhanced = withPassword(prisma);
// password field is hashed before stored into the database
const user = enhanced.user.create({
    data: { email: 'foo@bar.com', password: 'mysecurepassword' },
});
```