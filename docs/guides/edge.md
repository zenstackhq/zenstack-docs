---
description: Guide for deploying ZenStack to edge runtime.
sidebar_position: 12
---

# Deploying to Edge Runtime (Preview)

## Introduction

Edge Runtime is a kind of JavaScript runtime environment that allows code to run closer to the user's location, typically at the "edge" of the network. It can help improve the performance of web applications by reducing latency and increasing the speed of content delivery.

ZenStack is tested to work with Vercel Edge Runtime and Cloudflare Workers. Please [let us know](https://discord.gg/Ykhr738dUe) if you would like to see support for other environments.


## Edge-Compatible Database Drivers

ZenStack is built above Prisma, and Prisma's edge support was added recently and still evolving. The first thing you need to check is to make sure you use a edge-compatible database driver and Prisma adapter, or a traditional database with [Prisma Accelerate](https://www.prisma.io/docs/accelerate). Please check [this documentation](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/overview) for more details.


## Vercel Edge Runtime

[WIP]

### Caveats

`@zenstackhq/runtime` depends on `bcryptjs` which is not fully compatible with Vercel Edge Runtime. You may get the following error during compilation:

```
./node_modules/bcryptjs/dist/bcrypt.js
Module not found: Can't resolve 'crypto' in '.../node_modules/bcryptjs/dist'
```

To workaround this problem, add the following to the "package.json" file to avoid explicitly resolving the "crypto" module:

```json
{
  ...
  "browser": {
    "crypto": false
  }
}
```

## Cloudflare Workers

[WIP]
