:::info

The command installs a few NPM dependencies. If the project already has a Prisma schema at `prisma/schema.prisma`, it's copied over to `schema.zmodel`. Otherwise, a sample `schema.zmodel` file is created.

Moving forward, you will keep updating `schema.zmodel` file, and `prisma/schema.prisma` will be automatically generated from it.

:::
