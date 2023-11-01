---
描述: 自动增查改删 API
sidebar_label: 4. 自动CRUD API
sidebar_position: 4
---

# 自动增查改删 API

许多后端服务都有大块的代码围绕数据库，并提供访问控制的增查改删 API。 这些枯燥的样板代码编写起来很乏味，维护起来也容易出错。

通过“访问策略增强”的 Prisma 客户端，ZenStack 可以通过一组特定于框架的服务器适配器为您的数据模型自动提供一个成熟的增查改删 API。 目前，我们有[Next.js](https://nextjs.org)、[SvelteKit](https://kit.svelte.dev/)、[Express](https://expressjs.com/)和[Fastify](https://www.fastify.io/)的适配器。

让我们以Express为例来看看它是如何工作的。

```ts title='app.ts'

import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import express from 'express';
import { getSessionUser } from './auth'

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// options for creating the Express middleware that provides the CRUD API
const options = {
    // called for every request to get a Prisma Client instance
    getPrisma: (request) => {
        // getSessionUser extracts the current session user from the request,
        // its implementation depends on your auth solution
        const user = getSessionUser(request);

        // return a policy-enhanced Prisma Client
        return enhance(prisma, { user });
    }
}

// mount the middleware to "/api/model" route
app.use(
    '/api/model',
    ZenStackMiddleware(options)
);
```

:::info

对API使用增强的Prisma客户端没有硬性要求，但您应该始终这样做，以确保API在暴露于Internet时受到保护。

:::

通过上面的代码，CRUD API被挂载在路由“/api/model”。 默认情况下，API提供镜像Prisma客户端API的“RPC”样式端点。 例如，您可以像下面这样使用它：

```ts
// Create a post for user#1
POST /api/model/post
{
    "data": {
        "title": "Post 1",
        "author": { "connect": { "id": 1 } }
    }
}

// List all published posts with their authors
GET /api/model/post/findMany?q={"where":{"published":true},"include":{"author":true}}
```

您还可以选择通过使用RESTful API处理程序初始化中间件来提供更“REST”风格的API：

```ts title='app.ts'
import RestApiHandler from '@zenstackhq/server/api/rest';

const options = {
    getPrisma: (request) => {...},
    // use RESTful-style API handler
    handler: RestApiHandler({ endpoint: 'http://myhost/api' })
}

// mount the middleware to "/api/model" route
app.use(
    '/api/model',
    ZenStackMiddleware(options)
);
```

现在API端点遵循RESTful约定（使用[JSON:API](https://jsonapi.org/)传输）：

```ts
// Create a post for user#1
POST /api/model/post
{
    "data": {
        "type": 'post',
        "attributes": {
            "title": "Post 1"
        },
        relationships: {
            author: {
                data: { type: 'user', id: 1 }
            }
        }
    }
}

// 列出所有公开贴文和他们的作者
GET /api/model/post?filter[published]=true&include=author
```
正如您所看到的，只需几行代码，就可以为您的数据模型获得一个成熟的CRUD API。 有关使用特定于您的框架的服务器适配器的详细信息，请参阅[此处](/docs/category/server-adapters)。 您可能还对使用[`@zenstackhq/openapi`](/docs/reference/plugins/openapi)插件生成[OpenAPI](https://www.openapis.org/)规范感兴趣。

有了这些API，您现在可以使用它们来构建用户界面。 在下一节中，让我们看看ZenStack如何通过为前端生成数据访问钩子来简化这一部分。
