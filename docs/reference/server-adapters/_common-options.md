-   getPrisma: `(request: FastifyRequest, reply: FastifyReply) => unknown | Promise<unknown>`

    A callback for getting a PrismaClient instance for talking to the database. Usually you'll use an enhanced instance created with ZenStack's [`withPresets`](/docs/reference/runtime-api#withpresets) or [`withPolicy`](/docs/reference/runtime-api#withpolicy) APIs to ensure access policies are enforced.

-   zodSchemas: `ModelZodSchema | boolean | undefined`

    Provides the Zod schemas used for validating CRUD request input. The Zod schemas can be generated with the `@core/zod` plugin. Pass `true` for this option to load the schemas from the default location. If you configured `@core/zod` plugin to output to a custom location, you can load the schemas explicitly and pass the loaded module to this option.

    Not passing this option or passing in `undefined` disables input validation.
