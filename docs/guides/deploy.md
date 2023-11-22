---
sidebar_position: 6
---
# Deploying to Production

After the hard work of building your application, nothing is more exciting than deploying it to production. This guide explains how ZenStack participates in the deployment process.

### Running ZenStack CLI During Deployment

If you use a framework that requires a build step, for example, "next build" for Next.js, you can run `zenstack generate` as the very first step in the build process. It ensures the `schema.prisma` file is up-to-date, and the supporting modules are generated into the `node_modules/.zenstack` directory.

Here's what the build script of our sample Todo app looks like for deploying to Vercel:

```json title='package.json'
{
  "scripts": {
    "vercel-build": "zenstack generate && next build && prisma migrate deploy"
  }
}
```

### Not Using ZenStack CLI During Deployment

There might be cases where you don't want to run the `zenstack` CLI during the deployment process. For example, you may want to avoid installing dev dependencies during the build to keep a clean "node_modules" folder. In such cases, you can run `zenstack generate` with a `--output` option to generate the supporting modules into your source tree and then commit them to your repository.

```bash
npx zenstack generate --output ./zenstack
```

At the runtime, when calling `enhance()`, you need to pass in an extra `loadPath` option to point to the directory where the supporting modules are located:

```ts
const db = enhance(prisma, { user }, { loadPath: './zenstack' })
```

In this way, all information ZenStack needs at runtime is already in the source tree, and you don't need to run `zenstack generate` during deployment.
