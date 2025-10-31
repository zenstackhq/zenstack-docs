# API Handler

API handlers are components that implement different API design specifications, such as REST and RPC as we'll see in the following sections. An API handler is responsible for understanding the incoming requests, translating them into ORM queries, and formatting the results into proper responses.

API handlers are framework-agnostic, meaning that they only deal with "logical" requests and responses that are neutral to any specific web framework. The framework-specific details are handled by [Server Adapters](./server-adapter). This decoupled design allows you to mix and match any API specification with any supported web framework.

ZenStack currently provides two built-in API handlers: [RPC API Handler](./api-handler/rpc.md) and [RESTful API Handler](./api-handler/rest.md).