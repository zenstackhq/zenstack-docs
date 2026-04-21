The `generateSpec` method accepts an optional `OpenApiSpecOptions` object:

```ts
import type { OpenApiSpecOptions } from '@zenstackhq/server/api';

const spec = await handler.generateSpec({
    title: 'My Blog API',
    version: '2.0.0',
    description: 'API for managing blog posts and users',
    summary: 'Blog API',
    respectAccessPolicies: true,
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'ZenStack Generated API'` | The title of the API shown in the spec's `info.title` field. |
| `version` | `string` | `'1.0.0'` | The version of the API shown in the spec's `info.version` field. |
| `description` | `string` | — | A longer description of the API. |
| `summary` | `string` | — | A short summary of the API. |
| `respectAccessPolicies` | `boolean` | `false` | When `true`, adds `403 Forbidden` responses to operations on models that have access policies defined. |
