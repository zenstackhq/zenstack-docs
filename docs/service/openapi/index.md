---
sidebar_position: 1
---

# OpenAPI Spec Generation

ZenStack can generate [OpenAPI v3.1](https://spec.openapis.org/oas/v3.1.0) specifications from your ZModel schema. The generated spec describes all CRUD endpoints, custom procedures, request/response schemas, filtering parameters, and relationships — fully reflecting your schema definition.

The generated OpenAPI spec can be used with tools like [Swagger UI](https://swagger.io/tools/swagger-ui/), [Redoc](https://redocly.com/redoc), or any OpenAPI-compatible client generator.

## API Styles

OpenAPI spec generation is available for the following API styles:

| Style | Status | Description |
| --- | --- | --- |
| [RESTful](./openapi/restful) | Available | JSON:API-compliant RESTful endpoints |
| [RPC](./openapi/rpc) | Coming soon | RPC-style endpoints |
