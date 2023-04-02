---
description: This post introduces three different approaches to implementing security rules for your web APIs - with application code, using database poicies, and with ORM.
tags: [api, security, javascript]
authors: yiming
image: ./cover.png
date: 2023-04-03
---

# Three Ways to Secure Your Database APIs: Which Is Right for You?

![Cover image](cover.png)

Implementing security is one of those tasks in software engineering, which we all know its importance, but often don't spend enough energy to do it right. Who wants to build features that users can't see? However, the uneasy feeling will just keep haunting you, and someday you'll pay the price for your negligence. Data breaching is one of the best ways to ruin customers' trust and devastate a business. So better be a responsible programmer and implement the necessary measures from the beginning. But how?

<!-- truncate -->

This article explains three different levels at which you can implement security measures for your web APIs and their pros and cons.

## Application Code

Implementing securities in application code means that your code is fully responsible for validating (and rejecting) user requests, and the underlying database trusts whatever queries it gets.

It's obviously the most straightforward way - just write business rules in your application code. Developers have been doing this for decades, and it's still how most web applications and APIs are secured today. It's not a big deal for simple apps with a narrow API surface and unsophisticated rules: most of the time, you can do a pretty good job by consolidating security rules in shared functions and making sure they're consistently called in every API route.

However, things can get combinatorially more complex as your app grows. Imagine you're building a SaaS with many different types of assets on which users can collaborate. You need to have APIs for:

-   Users
-   Groups (maybe)
-   Workspaces (data isolation boundary)
-   Each asset type (e.g., documents, media files, pages, etc.)
-   ...

Each API area may have different CRUD rules, and some APIs may allow you to indirectly access data managed by other APIs (especially when you use GraphQL). It's not uncommon to have dozens or even hundreds of APIs in a large SaaS app; ensuring security rules are consistently enforced can be a nightmare. You can find a great portion of your code deals with permissions.

You can mitigate the pain by using libraries like [accesscontrol](https://github.com/onury/accesscontrol), [express-rbac](https://github.com/CodingGangsta/express-rbac), [django-guardian](https://django-guardian.readthedocs.io/), etc., to manage authorization more declaratively. But making sure nothing leaks is still a significant challenge.

### Pros

-   Straightforward to implement
-   Best flexibility since you can achieve any authorization model you want
-   Security rules collocate with your other business logic

### Cons

-   Hard to maintain as your app and team size grow
-   Very easy to introduce leakage when new APIs are added, or security rules are changed

## Database Policies

Yes, some databases have native support for access control.

Compared to the long history of SQL databases, fine-grained access control is a relatively new feature. Actually, column-level security has been the standard feature of most SQL databases for years. On the contrary, row-level security is relatively new and not widely adopted yet.

In a nutshell, row-level security allows you to define policies that restrict access to rows based on user attributes. Let's look at a simple example first (with PostgreSQL):

```sql
-- source: https://www.2ndquadrant.com/en/blog/application-users-vs-row-level-security/

CREATE TABLE chat (
    message_uuid    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_from    NAME      NOT NULL DEFAULT current_user,
    message_to      NAME      NOT NULL,
    message_subject VARCHAR(64) NOT NULL,
);

CREATE POLICY chat_policy ON chat
    USING ((message_to = current_user) OR (message_from = current_user))
    WITH CHECK (message_from = current_user)
```

In human language, it says:

1. A `chat` row is only visible when the current user is either the sender or the receiver.
1. When a `chat` row is inserted or updated, the sender must be the current user.

From the application's point of view, this means:

-   When you do `select * from chat`, you'll only see rows relevant to the current user
-   When you do `insert into chat` or `update chat` but attempt to change the sender, the database will reject your request.

Row-level security is a powerful weapon for modeling application security rules inside the database. To adopt this approach, you'll usually map your application's user to a database role or a session variable (read more [here](https://www.2ndquadrant.com/en/blog/application-users-vs-row-level-security/)), then rely on the database-side policies to enforce security rules.

Row-level security is the foundation for products like [Supabase](https://supabase.com/), [Postgraphile](https://www.graphile.org/postgraphile), and [PostgREST](https://postgrest.org).

### Pros

-   Compared to securing a wide API surface, you can focus on defining policies on a handful of tables.
-   Your data is secure even if your application code is compromised.
-   Your policies can work across multiple applications that have the same security model.
-   Programming language and framework agnostic

### Cons

-   Mapping application user to a database role (or session variable) is not trivial to implement securely (again, check [here](https://www.2ndquadrant.com/en/blog/application-users-vs-row-level-security/) for details).

-   It's SQL intensive, so your experience depends on how comfortable you're with writing lots of SQL.

-   Insufficient flexibility

    Although column-level + row-level security seems to provide infinite flexibility, it's not the case. For instance, you can't express "column A can be updated when user meets this condition". You can achieve it by using views or triggers, but you'll get deeper and deeper into the "advanced SQL" rabbit hole.

-   Security rules are segregated from application code

    Of course, this is the entire point of implementing security with database policy, but it hurts when you want to have a wholistic of your application because a big chunk of logic does not stay with your source code.

-   Not consistently supported by all database vendors

## ORM

The increasing popularity of ORM offers a new opportunity for implementing security rules. Conceptually, ORM can be considered a big middleware between the application code and the database, translating commands and result sets between the two worlds. By using ORMs, you already model your database schema declaratively, either "code-first" like [TypeoRM](https://typeorm.io/) or "schema-first" like [Prisma](https://prisma.io). So it's a natural thought to extend that model to contain security aspects.

I will illustrate this approach with the [ZenStack](https://zenstack.dev) OSS project we're building. ZenStack is built above the [Prisma ORM](https://prisma.io), and one of its focuses is to add access control capability. Here's an example schema for the same "chat" scenario that we've seen previously:

```prisma
// auth() function returns the current user
// future() function returns the post-update entity value

model User {
  id Int @id @default(autoincrement())
  username String
  sent Chat[] @relation('sent')
  received Chat[] @relation('received')

  // allow user to read his own profile
  @@allow('read', auth() == this)
}

model Chat {
  id Int @id @default(autoincrement())
  subject String
  fromUser User @relation('sent', fields: [fromUserId], references: [id])
  fromUserId Int
  toUser User @relation('received', fields: [toUserId], references: [id])
  toUserId Int

  // allow user to read his own chats
  @@allow('read', auth() == fromUser || auth() == toUser)

  // allow user to create a chat as sender
  @@allow('create', auth() == fromUser)

  // allow sender to update a chat, but disallow to change sender
  @@allow('update', auth() == fromUser && auth() == future().fromUser)
}
```

When the application code uses the ORM to talk to the database, proper filters are injected into queries and mutations to enforce the security rules. For example:

-   When you do `db.chat.findMany()`, only chats related to the current user are returned.
-   When you do `db.chat.create({ fromUserId: 1, toUserId: 2, subject: 'hello' })`, the ORM will reject your request if the current user does not have ID 1.

Check for more information about ZenStack [here](https://zenstack.dev/docs/intro).

### Pros

-   Compared to securing a wide API surface, you can focus on defining policies on a handful of data models.
-   Security rules collocate with your data mode within your codebase.
-   Intuitive and concise syntax
-   Potential for better flexibility than database row-level security because the ORM can do arbitrary query transformation and result validation

### Cons

-   Compared to the other two approaches, it's the newest and least mature.
-   Its applicability depends on the language and ORM toolkit you're using. For example, ZenStack only works with TypeScript and Prisma.

## Wrap Up

In this post, we've looked at three approaches to implementing security rules in a web application, together with their pros and cons. I hope this helps you make a better decision when choosing a security model for your next project.
