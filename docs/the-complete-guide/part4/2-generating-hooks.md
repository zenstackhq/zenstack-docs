---
sidebar_label: 2. Generating Hooks
---

# Generating Hooks

If you use a frontend framework like React or Vue, you probably used or heard of libraries like [TanStack Query](https://tanstack.com/query/latest) and [SWR](https://swr.vercel.app/). These libraries make it a breeze to build data-driven UI by providing excellent encapsulation for reactive data query, cache management, and data invalidation (aka refetching).

ZenStack provides plugins for generating frontend hooks targeting these two libraries. In this guide, we'll focus on using TanStack Query, but the concepts and usage are similar for SWR.

### Installing Dependencies

```bash
npm install @tanstack/react-query @zenstackhq/tanstack-query
```

:::info

The `@zenstackhq/tanstack-query` package contains both the plugin and a runtime part, so it needs to be installed as a regular dependency.

:::

Now add the plugin to the ZModel schema:

```zmodel title="schema.zmodel"
plugin hooks {
    provider = "@zenstackhq/tanstack-query"
    target = "react"
    output = "src/lib/hooks"
}
```

:::info

TanStack Query is a multi-framework library and supports React, Vue, and Svelte. The "target" field specifies the frontend framework to generate hooks for.

:::

Finally, rerun generation and observe that the hooks code is generated in the `src/lib/hooks` directory.

```bash
npx zenstack generate
```

### Setting Up TanStack Query

To use TanStack Query, we need to set up a `QueryClientProvider` context provider in the root component of our app. Update the `src/pages/_app.tsx` file:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import "~/styles/globals.css";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
```
