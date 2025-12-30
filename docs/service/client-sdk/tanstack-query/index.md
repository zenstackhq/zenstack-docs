---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import PackageInstall from '../../../_components/PackageInstall';
import StackBlitzGithub from '@site/src/components/StackBlitzGithub';
import OptimisticBehavior from './_optimistic-behavior.md';
import OptimisticLimitation from './_optimistic-limitation.md';
import FineGrainedOptimistic from './_fine-grained-optimistic.md';
import Invalidation from './_invalidation.md';

# TanStack Query Client

## Overview

[TanStack Query](https://tanstack.com/query) is a powerful data-fetching library for the web frontend, supporting multiple UI frameworks like React, Vue, and Svelte.

:::info
TanStack Query integration only works with the RPC style API. Currently supported frameworks are: react, vue, and svelte.

This documentation assumes you have a solid understanding of TanStack Query concepts.
:::

ZenStack's TanStack Query integration helps you derive a set of fully typed query and mutation hooks from your data model. The derived hooks work with the [RPC style](../../api-handler/rpc.md) API and pretty much 1:1 mirror the ORM query APIs, allowing you to enjoy the same excellent data query DX from the frontend.

The integration provides the following features

- Query and mutation hooks like `useFindMany`, `useUpdate`, etc.
- All hooks accept standard TanStack Query options, allowing you to customize their behavior.
- Standard, infinite, and suspense queries.
- Automatic query invalidation upon mutation.
- Automatic optimistic updates (opt-in).

## Framework Compatibility

### React

- `@tanstack/react-query`: v5+
- `react` v18+

### Vue

- `@tanstack/vue-query`: v5+
- `vue` v3+

### Svelte

- `@tanstack/svelte-query`: v6+
- `svelte` v5.25.0+

:::warning

`@tanstack/svelte-query` v6 leverages Svelte 5's [runes](https://svelte.dev/docs/svelte/what-are-runes) reactivity system. ZenStack is not compatible with prior versions that uses Svelte stores.

:::

### Angular

Not supported yet (need to migrate implementation from ZenStack v2).

### Solid

Not supported yet.

## Installation

<PackageInstall dependencies={['@zenstackhq/tanstack-query']} />

## Context Provider

You can configure the query hooks by setting up context. The following options are available on the context:

- endpoint

    The endpoint to use for the queries. Defaults to "/api/model".

- fetch

    A custom `fetch` function to use for the queries. Defaults to using built-in `fetch`. 

- logging

    Logging configuration. Pass `true` to log with `console.log`. Pass a `(message) => void` function for custom logging.

Example for using the context provider:

<Tabs>

<TabItem value="react" label="React">

```tsx title='_app.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuerySettingsProvider, type FetchFn } from '@zenstackhq/tanstack-query/react';

// custom fetch function that adds a custom header
const myFetch: FetchFn = (url, options) => {
  options = options ?? {};
  options.headers = {
    ...options.headers,
    'x-my-custom-header': 'hello world',
  };
  return fetch(url, options);
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <QuerySettingsProvider value={{ endpoint: '/api/model', fetch: myFetch }}>
        <AppContent />
      </QuerySettingsProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
```

</TabItem>

<TabItem value="vue" label="Vue">

```html title='App.vue'
<script setup lang="ts">
import { provideQuerySettingsContext, type FetchFn } from '@zenstackhq/tanstack-query/vue';

const myFetch: FetchFn = (url, options) => {
  options = options ?? {};
  options.headers = {
    ...options.headers,
    'x-my-custom-header': 'hello world',
  };
  return fetch(url, options);
};

provideQuerySettingsContext({
  endpoint: 'http://localhost:3000/api/model',
  fetch: myFetch
});
</script>

<template>
    <!-- App Content -->
</template>
```
</TabItem>

<TabItem value="svelte" label="Svelte">

```svelte title='+layout.svelte'
<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { setQuerySettingsContext, type FetchFn } from '@zenstackhq/tanstack-query/svelte';

  // custom fetch function that adds a custom header
  const myFetch: FetchFn = (url, options) => {
    options = options ?? {};
    options.headers = {
      ...options.headers,
      'x-my-custom-header': 'hello world',
    };
    return fetch(url, options);
  };

  setQuerySettingsContext({
    endpoint: '/api/model',
    fetch: myFetch,
  });

  const queryClient = new QueryClient();
</script>

<div>
  <QueryClientProvider client={queryClient}>
    <slot />
  </QueryClientProvider>
</div>
```
</TabItem>

</Tabs>

The provided configuration can be overridden at query time. See [Configuration Overrides](#configuration-overrides) for details.

## Using the Query Hooks

Call the `useClientQueries` hook to get a root object to access CRUD hooks for all models. From there, using the hooks is pretty much the same as using `ZenStackClient` in backend code.

<Tabs>

<TabItem value="react" label="React">

```ts
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema-lite.ts';

const client = useClientQueries(schema);

// `usersWithPosts` is typed `User & { posts: Post[] }`
const { data: usersWithPosts } = client.user.useFindMany({
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
});

const createPost = client.post.useCreate();

function onCreate() {
  createPost.mutate({ title: 'Some new post' });
}
```

</TabItem>

<TabItem value="vue" label="Vue">

:::info
If you want the queries to be reactive, make sure to pass reactive objects as arguments when calling the hooks. See [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/vue/reactivity) for details.
:::

```ts title="app.vue"
<script setup lang="ts">
  import { useClientQueries } from '@zenstackhq/tanstack-query/vue';
  import { schema } from '~/zenstack/schema-lite.ts';
  
  const client = useClientQueries(schema);
  
  // `usersWithPosts` is typed `Ref<User & { posts: Post[] }>`
  const { data: usersWithPosts } = client.user.useFindMany({
    include: { posts: true },
    orderBy: { createdAt: 'desc' },
  });
  
  const createPost = client.post.useCreate();
  
  function onCreate() {
    createPost.mutate({ title: 'Some new post' });
  }
</script>
```

</TabItem>

<TabItem value="svelte" label="Svelte">

:::info
Arguments to the query hooks must be wrapped in a function to make the result reactive. Please check this [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/svelte/migrate-from-v5-to-v6) if you are migrating from `@tanstack/svelte-query` v5 to v6.
:::

```ts title="App.svelte"
<script lang="ts">
  import { useClientQueries } from '@zenstackhq/tanstack-query/svelte';
  import { schema } from '~/zenstack/schema-lite.ts';

  const client = useClientQueries(schema);

  // `usersWithPosts` is typed `Ref<User & { posts: Post[] }>`
  const { data: usersWithPosts } = client.user.useFindMany(
    () => ({
      include: { posts: true },
      orderBy: { createdAt: 'desc' }})
  );
</script>
```

</TabItem>

</Tabs>

The `useClientQueries` takes the schema as an argument, and it uses it for both type inference and runtime logic (e.g., automatic query invalidation). This may bring security concerns, because the schema object contains sensitive content like access policies. Using it in the frontend code will expose such information.

To mitigate the risk, you can pass the additional `--lite` option when running `zen generate`. With that flag on, the CLI will generate an additional "lite" schema object in `schema-lite.ts` with all attributes removed. The lite schema contains all information needed by the query hooks. Check the [CLI Reference](../../../reference/cli.md#generate) for details.

## Configuration Overrides

The query configurations (as described in the [Context Provider](#context-provider) section) can be overridden in a hierarchical manner.

When calling `useClientQueries`, you can pass the `endpoint`, `fetch`, etc. options to override the global configuration for all hooks returned from the call.

```ts
const client = useClientQueries(schema, { endpoint: '/custom-endpoint' });
```

Similarly, when calling an individual query or mutation hook, you can also pass the same options to override the configuration for that specific call.

```ts
const { data } = client.user.useFindMany(
  { where: { active: true } },
  { endpoint: '/another-endpoint' }
);
```

## Optimistic Update

### Automatic Optimistic Update

Optimistic update is a technique that allows you to update the data cache immediately when a mutation executes while waiting for the server response. It helps achieve a more responsive UI. TanStack Query provides the [infrastructure for implementing it](https://tanstack.com/query/v5/docs/react/guides/optimistic-updates).

The ZenStack-generated mutation hooks allow you to opt-in to "automatic optimistic update" by passing the `optimisticUpdate` option when calling the hook. When the mutation executes, it analyzes the current queries in the cache and tries to find the ones that need to be updated. When the mutation settles (either succeeded or failed), the queries are invalidated to trigger a re-fetch.

Here's an example:

```ts
const { mutate: create } = useCreatePost({ optimisticUpdate: true });

function onCreatePost() {
  create({ ... })
}
```

When `mutate` executes, if there are active queries like `client.post.useFindMany()`, the data of the mutation call will be optimistically inserted into the head of the query result.

#### Details of the optimistic behavior

<OptimisticBehavior />

#### Limitations

<OptimisticLimitation />

### Fine-Grained Optimistic Update

<FineGrainedOptimistic />

### Opt-out

By default, all queries opt into automatic optimistic update. You can opt-out on a per-query basis by passing `false` to the `optimisticUpdate` option.

```ts
const { data } = client.post.useFindMany(
  { where: { published: true } },
  { optimisticUpdate: false }
);
```

When a query opts out, it won't be updated by a mutation, even if the mutation is set to update optimistically.

## Infinite Query

The `useFindMany` hook has an "infinite" variant that helps you build pagination or infinitely scrolling UIs.

<Tabs>
<TabItem value="react" label="React">

Here's a quick example of using infinite query to load a list of posts with infinite pagination. See [TanStack Query documentation](https://tanstack.com/query/v5/docs/react/guides/infinite-queries) for more details.

```tsx title='/src/components/Posts.tsx'
import { useClientQueries } from '@zenstackhq/tanstack-query/react';

// post list component with infinite loading
const Posts = () => {

  const client = useClientQueries(schema);

  const PAGE_SIZE = 10;

  const fetchArgs = {
    include: { author: true },
    orderBy: { createdAt: 'desc' as const },
    take: PAGE_SIZE,
  };

  const { data, fetchNextPage, hasNextPage } = client.post.useInfiniteFindMany(
    fetchArgs, 
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < PAGE_SIZE) {
          return undefined;
        }
        const fetched = pages.flatMap((item) => item).length;
        return {
          ...fetchArgs,
          skip: fetched,
        };
      }
    }
  );    

  return (
    <>
      <ul>
        {data?.pages.map((posts, i) => (
          <React.Fragment key={i}>
            {posts?.map((post) => (
              <li key={post.id}>
                {post.title} by {post.author.email}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          Load more
        </button>
      )}
    </>
  );
};
```

</TabItem>

<TabItem value="vue" label="Vue">

Here's a quick example of using infinite query to load a list of posts with infinite pagination. See [TanStack Query documentation](https://tanstack.com/query/v5/docs/vue/guides/infinite-queries) for more details.

```html title='/src/components/Posts.vue'
<script setup lang="ts">
// post list component with infinite loading

import { useClientQueries } from '@zenstackhq/tanstack-query/vue';

const client = useClientQueries(schema);

const PAGE_SIZE = 10;

const fetchArgs = {
  include: { author: true },
  orderBy: { createdAt: 'desc' as const },
  take: PAGE_SIZE,
};

const { data, hasNextPage, fetchNextPage } = client.post.useInfiniteFindMany(
  fetchArgs,
  {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      const fetched = pages.flatMap((item) => item).length;
      return {
        ...fetchArgs,
        skip: fetched,
      };
    },
  }
);
</script>

<template>
  <div>
    <ul v-if="data">
      <template v-for="(posts, i) in data.pages" :key="i">
        <li v-for="post in posts" :key="post.id">
          {{ post.title }} by {{ post.author.email }}
        </li>
      </template>
    </ul>
  </div>

  <button v-if="hasNextPage" @click="() => fetchNextPage()">Load More</button>
</template>

```

</TabItem>

<TabItem value="svelte" label="Svelte">

Here's a quick example of using infinite query to load a list of posts with infinite pagination. See [TanStack Query documentation](https://tanstack.com/query/v5/docs/framework/svelte/examples/load-more-infinite-scroll) for more details.

```svelte title='/src/components/Posts.svelte'
<script lang="ts">
  // post list component with infinite loading

  import { useClientQueries } from '@zenstackhq/tanstack-query/svelte';

  const client = useClientQueries(schema);

  const PAGE_SIZE = 10;

  const fetchArgs = {
    include: { author: true },
    orderBy: { createdAt: 'desc' as const },
    take: PAGE_SIZE,
  };

  const query = client.post.useInfiniteFindMany(
    () => fetchArgs,
    () => ({
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < PAGE_SIZE) {
          return undefined;
        }
        const fetched = pages.flatMap((item) => item).length;
        return {
          ...fetchArgs,
          skip: fetched,
        };
      }})
    );    
</script>

<div>
  <ul>
    <div>
      {#if $query.data}
        {#each $query.data.pages as posts, i (i)}
          {#each posts as post (post.id)}
            <li>{post.title} by {post.author.email}</li>
          {/each}
        {/each}
      {/if}
    </div>
  </ul>
  {#if $query.hasNextPage}
    <button on:click={() => $query.fetchNextPage()}>
      Load more
    </button>
  {/if}
</div>
```

</TabItem>

</Tabs>

## Advanced Topics

### Query Invalidation

<Invalidation />

:::info

The automatic invalidation is enabled by default, and you can use the `invalidateQueries` option to opt-out and handle revalidation by yourself.

```ts
useCreatePost({ invalidateQueries: false });
```
:::

### Query Key

Query keys serve as unique identifiers for organizing the query cache. The generated hooks use the following query key scheme:

```ts
['zenstack', model, operation, args, flags]
```

For example, the query key for

```ts
useFindUniqueUser({ where: { id: '1' } })
```

will be:

```ts
['zenstack', 'User', 'findUnique', { where: { id: '1' } }, { infinite: false }]
```

You can use the generated `getQueryKey` function to compute it.

The query hooks also return the query key as part of the result object.

```ts
const { data, queryKey } = useFindUniqueUser({ where: { id: '1' } });
```

### Query Cancellation

You can use TanStack Query's [`queryClient.cancelQueries`](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientcancelqueries) API to cancel a query. The easiest way to do this is to use the `queryKey` returned by the query hook.

```ts
const queryClient = useQueryClient();
const { queryKey } = useFindUniqueUser({ where: { id: '1' } });

function onCancel() {
  queryClient.cancelQueries({ queryKey, exact: true });
}
```

When a cancellation occurs, the query state is reset and the ongoing `fetch` call to the CRUD API is aborted.

## Samples

### Interactive Demo

The following live demo shows how to use the query hooks in a React SPA.

<StackBlitzGithub repoPath="zenstackhq/v3-doc-tanstack-query" openFile="src/App.tsx" />

### Full-Stack Samples

#### Next.js

[https://github.com/zenstackhq/zenstack-v3/tree/main/samples/next.js](https://github.com/zenstackhq/zenstack-v3/tree/main/samples/next.js)

#### Nuxt

[https://github.com/zenstackhq/zenstack-v3/tree/main/samples/nuxt](https://github.com/zenstackhq/zenstack-v3/tree/main/samples/nuxt)

#### SvelteKit

[https://github.com/zenstackhq/zenstack-v3/tree/main/samples/sveltekit](https://github.com/zenstackhq/zenstack-v3/tree/main/samples/sveltekit)
