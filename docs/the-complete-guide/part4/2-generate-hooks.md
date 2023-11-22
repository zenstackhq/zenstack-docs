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

### Adding TanStack Query Plugin

Now add the plugin to the ZModel schema:

```zmodel title="schema.zmodel"
plugin hooks {
  provider = '@zenstackhq/tanstack-query'
  target = 'react'
  version = 'v5'
  output = 'src/lib/hooks'
}
```

TanStack Query is a multi-framework library and supports React, Vue, and Svelte. The "target" field specifies the frontend framework to generate hooks for. The "version" field specifies the version of TanStack Query to target. Here, we're using the latest "v5" version.

Then, rerun generation and observe that the hooks code is generated in the `src/lib/hooks` directory.

```bash
npx zenstack generate
```

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
