---
description: Integrating with Supabase Auth.
sidebar_position: 4
sidebar_label: Supabase Auth
---

# Integrating With Supabase Auth

[Supabase](https://supabase.com) is a comprehensive Backend-as-a-Service that offers database, authentication, and blob services.

To get access policies to work, ZenStack needs to be connected to the authentication system to get the user's identity. If you use Supabase as your authentication provider, this document will guide you through integrating ZenStack with it. 

### Using Prisma with Supabase

:::info
This section is only relevant if you're also using Supabase's Database service as the underlying Postgres database of Prisma/ZenStack.
:::

This section is not directly to integrating authentication, but since ZenStack is based on Prisma, understanding how Prisma and Supabase should be set up appropriately when Supabase Auth is involved is important.

Supabase Auth stores user data in a separate Postgres schema called "auth". Since that schema is managed by Supabase, it's good idea not to directly import it into ZModel and use it in your application, since Supabase team may decide to change table schemas at any time. Instead, a better approach is to define your own `User` model in ZModel, and use database triggers to synchronize user data from Supabase Auth to your `User` table.

**Schema:**

```zmodel title="schema.zmodel"
model User {
    id String @id @db.Uuid
    posts Post[]
    ... // other fields

    @@allow('read', true)
}

model Post {
    id String @id @db.Uuid
    title String
    author User @relation(fields: [authorId], references: [id])
    authorId String @db.Uuid

    @@allow('all', author == auth())
}
```

**Database trigger (for synchronizing new users):**

You can check [here](https://supabase.com/docs/guides/database/postgres/triggers) for a general introduction about triggers in Supabase. The following code shows how to use it to synchronize new users:

```sql
-- inserts a row into public."User"
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

Similarly you can implement more triggers to synchronize user update and delete. Find more information about this approach [here](https://supabase.com/docs/guides/auth/managing-user-data#using-triggers).

With these in place, your own `User` table will be always in sync with Supabase Auth, and in your application, your other entities will have relations to the `User` table instead of pointing to Supabase Auth's internal tables.

### Creating an enhanced Prisma client

To get ZenStack's access policies to work, you need to create an enhanced `PrismaClient` with a current user context. The way to fetch "current user" on the server side depends on the type of server you're using. Supabase provides a set of [auth helpers](https://supabase.com/docs/guides/auth/auth-helpers) for different frameworks. For example, if you're following [this guide] to use Supabase Auth with Next.js (app router), you can create an enhanced `PrismaClient` using `@supabase/auth-helpers-nextjs` like the following:

```ts
import { enhance } from '@zenstackhq/runtime';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@lib/db';

// create a wrapper of Prisma client that enforces access policy,
// data validation, and @password, @omit behaviors
async function getPrisma() {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: user } = await supabase.auth.getUser();
    const uid = user.user?.id;
    // TODO: if you need to access fields other than just "id" in access policies, 
    // you can do a database query here to fetch the full user record
    const contextUser = uid ? { id: uid } : undefined;
    return enhance(prisma, { user: contextUser });
}
```

You can then use this enhanced Prisma client for CRUD operations that you desire to be governed by the access policies you defined in your data models.
