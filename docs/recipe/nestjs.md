---
sidebar_position: 4
---

# Using ZenStack With NestJS

This guide describes different ways to use ZenStack in a [NestJS](https://nestjs.com/) application.

## As a Plain ORM

ZenStack offers a standard ORM component that you can use in your NestJS application just like any other ORM. To get started, create a `DbService` by extending the `ZenStackClient` constructor:

```ts title="src/db/db.service.ts"
import { ZenStackClient } from '@zenstackhq/orm';
import { schema, type SchemaType } from '../../zenstack/schema';
import { SqliteDialect } from '@zenstackhq/orm/dialects/sqlite';
import SQLite from 'better-sqlite3';

export class DbService extends ZenStackClient<SchemaType> {
  constructor() {
    super(schema, {
      dialect: new SqliteDialect({ database: new SQLite('./zenstack/dev.db') }),
    });
  }
}
```

You can then register this service as a provider in a module:

```ts title="src/app.module.ts"
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbService } from './db/db.service';

@Module({
  controllers: [AppController],
  providers: [DbService],
})
export class AppModule {}
```

Finally, inject the `DbService` in your controllers or other services to access the database:

```ts title="src/app.controller.ts"
import { Controller, Get } from '@nestjs/common';
import { DbService } from './db/db.service';

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

```ts title="src/app.module.ts"
import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbService } from './db/db.service';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';
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
export class AppModule {}
```

Now you can choose to use the access-controlled `DbService` in your controllers or services by injecting it with the "AUTH_DB" token:

```ts title="src/app.controller.ts"
import { Controller, Get, Inject } from '@nestjs/common';
import { DbService } from './db/db.service';

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

```ts title="src/app.controller.ts"
import { Controller, All, Inject, Param, Query, Req, Res } from '@nestjs/common';
import { RestApiHandler } from '@zenstackhq/server/api';
import type { Request, Response } from 'express';
import { DbService } from './db/db.service';
import { schema } from '../zenstack/schema';

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
    @Res() res: Response,
    @Param('path') path: string[],
    @Query() query: Record<string, any>,
  ) {
    // forward the request to the API handler
    const result = await this.apiHandler.handleRequest({
      method: req.method,
      path: path.join('/'),
      query,
      requestBody: req.body,
      client: this.dbService,
    });

    res.status(result.status).json(result.body);
  }
}
```

With this setup, all requests to `/api/*` will be handled by the ZenStack API handler, which performs the necessary CRUD operations with access control enforced. Refer to the [API handlers documentation](../service/api-handler/) for request and response formats and other details.

### Sharing the Handler Across Thin Controllers

A single catch-all controller is the simplest setup, but it makes it hard to attach per-resource NestJS features — guards, interceptors, rate limits, or Swagger decorators. An alternative is to wrap the handler in a service and forward from small, per-resource controllers:

```ts title="src/db/resthandler.service.ts"
import { Inject, Injectable } from '@nestjs/common';
import { RestApiHandler } from '@zenstackhq/server/api';
import type { Request, Response } from 'express';
import { schema, type SchemaType } from '../../zenstack/schema';

@Injectable()
export class RestHandlerService {
  private readonly apiHandler = new RestApiHandler<SchemaType>({
    schema,
    endpoint: 'http://localhost:3000/api',
  });

  constructor(@Inject('AUTH_DB') private readonly dbService: any) {}

  async handleRequest(req: Request, res: Response) {
    // Strip the controller's path prefix so the handler sees a resource-relative
    // path (e.g. "post/1"), matching the catch-all example above.
    const relativePath = req.path.replace(/^\/api\//, '');
    const result = await this.apiHandler.handleRequest({
      method: req.method,
      path: relativePath,
      query: req.query as Record<string, string | string[]>,
      requestBody: req.body,
      client: this.dbService,
    });
    res.status(result.status);
    return result.body;
  }
}
```

```ts title="src/post/post.controller.ts"
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { RestHandlerService } from '../db/resthandler.service';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly rest: RestHandlerService) {}

  // Declaring the methods (rather than a single `@All`) lets you attach
  // guards, Swagger decorators, and rate limits per operation while still
  // delegating the actual work to the shared ZenStack handler.
  @Get(['', '/:id'])
  get(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.rest.handleRequest(req, res);
  }

  @Post()
  create(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.rest.handleRequest(req, res);
  }
}
```

Each controller still delegates all CRUD work to the same handler, so there's no duplicated logic — the controllers exist only to carry NestJS metadata (guards, tags, decorators) for their resource.

## Merging the OpenAPI Spec With NestJS Swagger

The RESTful and RPC API handlers can [generate an OpenAPI spec](../service/openapi/restful.md) at runtime from your ZModel schema. When you also have hand-written NestJS controllers (custom actions, auth endpoints, or the thin delegating controllers above), you'll want a single Swagger UI that documents both. The trick is to generate each spec separately and merge their `paths` and `components`.

Two details make the merge work:

- **Path prefixes differ.** ZenStack paths are relative to the handler's `endpoint` (e.g. `/post/{id}`), while NestJS paths include the [global prefix](https://docs.nestjs.com/faq/global-prefix) (e.g. `/api/post/{id}`). Re-prefix the ZenStack paths before merging.
- **Both contribute component schemas.** Keep ZenStack's resource/error schemas and NestJS's DTO schemas.

```ts title="src/swagger.ts"
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import type { RestApiHandler } from '@zenstackhq/server/api';

export async function setupSwagger(
  app: INestApplication,
  handler: RestApiHandler<any>,
  prefix = 'api',
) {
  // 1. ZenStack's runtime spec. `respectAccessPolicies` prunes fields and
  //    operations the anonymous/base role can't reach, so the published spec
  //    matches what the API actually exposes.
  const zenStackSpec = (await handler.generateSpec({
    title: 'My API',
    respectAccessPolicies: true,
  })) as OpenAPIObject;

  // 2. Re-prefix ZenStack paths ("/post/{id}" -> "/api/post/{id}") so they line
  //    up with NestJS's global prefix.
  const zenStackPaths = Object.fromEntries(
    Object.entries(zenStackSpec.paths ?? {}).map(([path, config]) => [
      `/${prefix}${path}`,
      config,
    ]),
  );

  // 3. NestJS spec from your decorated controllers.
  const nestDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('My API').build(),
  );

  // 4. Merge paths. Where a controller documents the same path+method as
  //    ZenStack, the NestJS operation wins (it carries your guards, headers,
  //    and hand-written descriptions); otherwise ZenStack fills it in.
  const paths: OpenAPIObject['paths'] = { ...zenStackPaths };
  for (const [path, operations] of Object.entries(nestDocument.paths ?? {})) {
    paths[path] = { ...(paths[path] ?? {}), ...operations };
  }

  const merged: OpenAPIObject = {
    ...nestDocument,
    paths,
    components: {
      ...zenStackSpec.components,
      ...nestDocument.components,
      schemas: {
        ...zenStackSpec.components?.schemas,
        ...nestDocument.components?.schemas,
      },
    },
  };

  SwaggerModule.setup(prefix, app, merged);
}
```

Call it from `main.ts` after the app is created (and after `app.setGlobalPrefix(prefix)`), passing the same handler instance your controllers use.

:::tip Going further
The merge step is plain object manipulation, so you can layer on whatever your API needs: merge response objects instead of overwriting them (to keep NestJS-declared headers on ZenStack operations), publish separate public vs. internal specs by filtering operations on a custom `x-*` extension, add security schemes, or prune component schemas that end up unreferenced after filtering. Because the ZenStack spec is regenerated from the schema on every boot, it never drifts from your data model.
:::
