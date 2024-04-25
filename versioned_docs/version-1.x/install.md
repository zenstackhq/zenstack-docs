---
description: Installation
slug: /install
sidebar_label: Installation
sidebar_position: 2
---

import ZenStackInit from './_components/_zenstack-init.md';

# Installing ZenStack

You can install ZenStack to your project using one of the following methods.

### Using `zenstack init`

The easiest way to install ZenStack is to use the `zenstack init` command. In an existing TypeScript project folder, run the following command:

```bash
npx zenstack@1 init
```

<ZenStackInit />

### Manually

The following steps show how to install using "npm" as package manager. Replace it with the one you use for your project (like pnpm or yarn).

1. Make sure Prisma is installed
2. Install the `zenstack` CLI package as a dev dependency
   
   ```bash
   npm install --save-dev zenstack@1
   ```
3. Install the `@zenstackhq/runtime` package as a regular dependency
   
   ```bash
   npm install @zenstackhq/runtime@1
   ```
4. Bootstrap ZModel from Prisma schema
    
    If you have a Prisma schema file, copy it to `schema.zmodel` in the project root folder. Remember, you should edit the `schema.zmodel` moving forward. The `prisma/schema.prisma` file will automatically regenerate when you run `zenstack generate`.
