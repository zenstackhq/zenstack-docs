---
description: How does ZenStack work
sidebar_position: 1
---

# ZenStack vs. Other Tools

ZenStack is not the first tool that aims to simplify backend development for web apps. In this document, we list a few other similar tools/services and try to give an objective comparison between each of them and ZenStack, so as to make it easier for you to make a good decision.

### ZenStack vs. Supabase

[Supabase](https://supabase.com) is an excellent OSS product that packages many OSS tools into a coherent Postgres-centric data platform. ZenStack and Supabase share several commonalities: they both add a RESTful layer above the database, support declarative access policies, and both generate strong-typed frontend libraries.

There're a few key differences, though:

-   Where the data model resides

    ZenStack and Prisma believe that the data model is an application's backbone, so it should reside within the code base and evolve together with the application code. With `schema.zmodel`, you always have a single source of truth for that. Since it stays together with your code base, you can branch it, diff it, pull-request it, and include it in your CI/CD workflows just as other pieces of code.

    While with Suapbase, your data model resides on the Supabase's service side. Although you can store database migrations in your code base, there isn't an easy-to-read "current state" of the data model in the source code. This can be increasingly challenging as your application becomes more complex.

-   How the data model is defined

    ZenStack and Prisma use a DSL to model data. This obviously incurs learning costs, but the expectation is that it pays off soon, thanks to the centralized easy-to-understand data model. Supabase is heavily focused on SQL. It uses DDL to model data tables and Postgres's row-level security to define access policies. Using it well requires solid SQL skills and a good understanding of PostgreSQL.

Supabase has many extra cool features, like real-time API, GraphQL support, and blob storage. These can also contribute to your final decision. Supabase can be used as a standard Postgres database too, and lots of people are using it that way. You can use it together with ZenStack, then.

### ZenStack vs. Firebase

[Firebase](https://firebase.google.com/) is Google's proprietary solution for a data platform without a backend. It allows you to make a new web app up and run very fast. The biggest difference between Firebase and ZenStack is that Firebase is schemaless.

Being a schemaless database has some very big advantages: no trouble to define a schema, no need for migration, easy to accommodate heterogeneous structures in one data store, etc. However, the downside is also very clear: it doesn't scale well. As your app evolves, the advantages can very quickly become troubles: you'll have to carefully deal with multiple versions of your data formats to ensure backward compatibility, and there's no help from the platform to prevent you from ruining data integrity.

### ZenStack vs. Hasura

[Hasura](https://hasura.io/) is an OSS product that automatically serves a GraphQL service above a SQL database. It offers sophisticated mechanisms for configuring access control which combines RBAC and ABAC. After setting up your database schema and access control rules, you can directly manipulate data through the generated GraphQL service from your frontend.

Hasura is a service by itself, separated from the database. So, in a typical full-stack deployment, you'll have a framework like Next.js, which has a backend, a database service, and a Hasura service (either on-prem or cloud). It feels like an overkill for simpler applications. It's true that as a separate service, Hasura has more flexibility to evolve and scale, but that for sure comes with a deployment and maintenance cost.

ZenStack is designed to run well inside of a full-stack or backend framework that the team already chose to use, as a library. It's less intrusive both for development and for operations, and most of the time, the developer's experience is the same as using Prisma - what they're already familiar with.
