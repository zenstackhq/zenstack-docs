---
sidebar_position: 4
---

# Using ZenStack With NestJS

This guide describes different ways to use ZenStack in a [NestJS](https://nestjs.com/) application.

## As a Plain ORM

ZenStack offers a standard ORM component that you can use in your NestJS application just like any other ORM. To get started, create a `DbService` by extending the `ZenStackClient` constructor:

```ts title="db.service.ts"
import { ZenStackClient } from '@zenstackhq/orm';
import { PostgresDialect } from '@zenstackhq/orm/dialects/postgres';
import { schema, type SchemaType } from './zenstack/schema';
import { Pool } from 'pg';

export class DbService extends ZenStackClient<
  SchemaType,
  ClientOptions<SchemaType>
> {
  constructor() {
    super(schema, {
      dialect: new PostgresDialect({
        pool: new Pool({ connectionString: process.env.DATABASE_URL })
      }),
    });
  }
}
```

You can then register this service as a provider in a module:

```ts title="app.module.ts"
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbService } from './db.service';

@Module({
  controllers: [AppController],
  providers: [DbService],
})
```

Finally, inject the `DbService` in your controllers or other services to access the database:

```ts title="app.controller.ts"
import { Controller, Get } from '@nestjs/common';
import { DbService } from './db.service';

@Controller('api')
export class AppController {
  constructor(private readonly dbService: DbService) {}

  @Get('/posts')
  getPosts() {
    return this.dbService.post.findMany();
  }
}
```

## As an Access-Controlled ORM

To leverage ZenStack's [built-in access control features](../orm/access-control/), you can inject a request-scoped `DbService` that's bound to the current session user (usually extracted from the request).

In the sample below, we provide an access-controlled `DbService` under the name "AUTH_DB":

```ts title="app.module.ts"
import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';
import { DbService } from './db.service';
// your authentication helper
import { getRequestUser } from './auth.util';

@Module({
  controllers: [AppController],
  providers: [
    // the standard (no-access-control) ORM
    DbService,

    // the access-controlled ORM
    {
      provide: 'AUTH_DB',

      // make sure it's request-scoped to capture per-request user context
      scope: Scope.REQUEST,

      useFactory: (req: Request, db: DbService) => {
        // extract the current user from the request, implementation depends on
        // your authentication solution
        const user = getRequestUser(req);

        // install the PolicyPlugin and set the current user context
        return db.$use(new PolicyPlugin()).$setAuth(user);
      },

      inject: [REQUEST, DbService],
    },
  ],
})
```

Now you can choose to use the access-controlled `DbService` in your controllers or services by injecting it with the "AUTH_DB" token:

```ts title="app.controller.ts"
import { Controller, Get, Inject } from '@nestjs/common';
import { DbService } from './db.service';

@Controller('api')
export class AppController {
  // inject the access-controlled DbService
  constructor(@Inject('AUTH_DB') private readonly dbService: DbService) {}

  @Get('/posts')
  getPosts() {
    // only posts accessible to the current user will be returned
    return this.dbService.post.findMany();
  }
}
```

## As an Automatic CRUD Service

ZenStack also provides [API handlers](../service/api-handler/) that process CRUD requests automatically for you. To use it, create a catch-all route in your controller and forward the request to the API handler:

```ts title="app.controller.ts"
import { Controller, All, Inject, Param, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DbService } from './db.service';

@Controller('api')
export class AppController {
  // RESTful API Handler is used here for demonstration. You can also use the
  // RPC-style API handler if preferred. See the API handlers docs for more 
  // details.
  private readonly apiHandler = new RestApiHandler({
    schema,
    endpoint: 'http://localhost:3000/api',
  });

  constructor(@Inject('AUTH_DB') private readonly dbService: DbService) {}

  @All('/*path')
  async handleAll(
    @Req() req: Request,
    @Res() response: Response,
    @Param('path') path: string[],
    @Query() query: Record<string, any>,
  ) {
    // forward the request to the API handler
    const result = await this.apiHandler.handleRequest({
      method: req.method,
      path: path.join('/'),
      query,
      requestBody: req.body,
      client: authDb,
    });

    response.status(result.status).json(result.body);
  }
}
```

With this setup, all requests to `/api/*` will be handled by the ZenStack API handler, which performs the necessary CRUD operations with access control enforced. Refer to the [API handlers documentation](../service/api-handler/) for request and response formats and other details.

