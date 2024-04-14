---
sidebar_label: 2. Generating Hooks
---

# 🛠️ Generating Hooks

If you use a frontend framework like React or Vue, you've probably used or heard of libraries like [TanStack Query](https://tanstack.com/query/latest) and [SWR](https://swr.vercel.app/). These libraries make it a breeze to build data-driven UI by providing excellent encapsulation for reactive data query, cache management, and data invalidation (aka refetching).

ZenStack provides plugins for generating frontend hooks targeting these two libraries. In this guide, we'll focus on using TanStack Query, but the concepts and usage are similar for SWR.

### Installing Dependencies

```bash
npm install @tanstack/react-query @zenstackhq/tanstack-query
```

The `@zenstackhq/tanstack-query` package contains both the plugin and a runtime part, so it needs to be installed as a regular dependency.

### Setting Up TanStack Query

To use TanStack Query, we need to set up a `QueryClientProvider` context provider in the root component of our app. First, create a file `src/components/QueryClientProvider.tsx` with the following content:

```tsx title="src/components/QueryClientProvider.tsx"
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

function Provider({ children }: Props) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default Provider;
```

Then, update the `src/app/layout.tsx` file to use it:

```tsx title="src/app/layout.tsx"
import QueryClientProvider from '~/components/QueryClientProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <QueryClientProvider>
          <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### Adding TanStack Query Plugin

Now add the plugin to the ZModel schema:

```zmodel title="schema.zmodel"
plugin hooks {
  provider = '@zenstackhq/tanstack-query'
  target = 'react'
  output = 'src/lib/hooks'
}
```

TanStack Query is a multi-framework library and supports React, Vue, and Svelte. The "target" field specifies the frontend framework to generate hooks for.

Then, rerun generation and observe that the hooks code is generated in the `src/lib/hooks` directory.

```bash
npx zenstack generate
```

### A Peek Into the Hooks

The generated hooks allow you to query and mutate data without worrying about the API details. They're designed to fully preserve the Prisma query syntax you already know. Here are some quick examples of their usage:

- Nested read with filtering and sorting

    ```tsx
    // `data` is typed as `(Todo & { list: List })[]`
    const { data } = useFindManyTodo({
      where: { owner: { id: 1 } },
      include: { list: true },
      orderBy: { createdAt: 'desc' }
    });
    ```

- Nested create

    ```tsx
    const { mutate } = useCreateList();

    function onCreateList() {
      mutate({
        data: { 
          title: 'My List',
          todos: {
            create: [
              { name: 'Todo 1' },
              { name: 'Todo 2' }
            ]
          }
        }
      })
    }
    ```

- Count

    ```tsx
    const { data } = useCountTodo({ where: { owner: { id: 1 } } });
    ```

We'll cover the usage of the hooks in detail in the upcoming chapters.
