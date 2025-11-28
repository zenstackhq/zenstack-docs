---
description: Integrating with Supabase Auth.
sidebar_position: 4
sidebar_label: Supabase Auth
---

# Integrating With Supabase Auth

[Supabase](https://supabase.com) is a comprehensive Backend-as-a-Service that offers database, authentication, and other services.

To get access policies to work, ZenStack needs to be connected to the authentication system to get the user's identity. If you use Supabase as your authentication provider, this document will guide you through integrating ZenStack with it. 

## Syncing Supabase Auth users to your database

:::info
This section is only relevant if you're also using Supabase's Database service as the underlying Postgres database of ZenStack.
:::

Supabase Auth stores user data in a separate Postgres schema called "auth". Since that schema is managed by Supabase, it's good idea NOT to directly import it into ZModel and use it in your application. Instead, if you want to have a synchronized copy of the data, refer to [Supabase's user management documentation](https://supabase.com/docs/guides/auth/managing-user-data) for how to set up database triggers and keep your user table in sync with Supabase Auth.

## Creating a user-bound ORM client

Supabase provides the `@supabase/ssr` package to help with server-side authentication. Please refer to [its documentation](https://supabase.com/docs/guides/auth/server-side) for full details. The following example shows how to do it in a Next.js application.

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { db } from '@/lib/db' // your ZenStackClient instance

// create a Supabase SSR client
async function createSupabaseSSRClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) => cookieStore.set(name, value))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// create a user-bound ORM client
async function getUserDb() {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser()

  // you can selectively include fields into the context object
  // depending on what your access policies need
  const contextUser = user ? { id: user.id } : undefined;
  return db.$setAuth(contextUser);
}
```

:::warning
It may be tempting to call the `supabase.auth.getSession()` API to get the current user. However, the data returned is not validated by Supabase's service, so it must not be trusted.
:::

You can then use this user-bound ORM client for CRUD operations governed by the access policies you defined in ZModel.
