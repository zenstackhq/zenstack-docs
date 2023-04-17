---
title: Business Logic Inside Database - How Evil Is It?
description: a retrospection to the "never put business logic inside the database" mantra
tags: [database, webdev]
authors: yiming
date: 2023-04-17
image: ./cover.png
---

# Business Logic Inside Database - How Evil Is It?

![Cover Image](cover.png)

Database for storing data; application code for implementing business logic - the distinctions seem straightforward. Yet, after so many years of evolution, modern (relational) databases are quite capable of running "logic" - extensions, stored procedures, triggers, etc. <!-- truncate --> So a "best practice" is invented to fight against it:

-   "Never put business logic inside the database!"
-   "It’s going to make a mess, and you’ll regret it and pay the price to fix it in the future!"
-   "Keep your database dumb!"

Like many other things in the software engineering domain, things are seldom black or white, and conventional wisdom doesn’t hold universally. I do agree with the general opinion that abusing databases with too much logic causes scaling (CPU & memory intensive tasks) and maintenance (business logic scattered in multiple places) problems. Still, there’re cases where putting sense into the database can be a good idea.

## Use cases

### Triggering a workflow on data change

Modern web applications often involve orchestrating multiple 3rd-party services. For example, when a user makes an order, you may want to send a confirmation email to her with Intercom and also notifies your support team via Slack. Though you can implement all these with application code, there’re several drawbacks:

1. If you trigger the 3rd-party workflows when your application code successfully creates a new order, you need to ensure this happens consistently in all places where an order can be made (different channels, admin consoles, etc.). This can be challenging for complex applications.

1. If you do it by polling the database for new orders, you need to weigh how frequently you carefully do the polling so that the database is not overloaded and the delay is not too large.

A much nicer solution is to rely on the database’s native trigger feature to achieve this. It happens right inside the database, so it has minimal latency and overhead. The trigger feature of databases like PostgreSQL is very powerful, and you can do lots of things by using extensions inside the trigger functions, like calling HTTP APIs.

### Subscribing to live data

Applications that focus on multi-user collaboration desire real-time UI updates with very low latency. Although you can manage this through application-level messaging and synchronization, since very often the source of truth is the database, initiating an update from there might be a better idea. Similar to the previous use case, you can use the trigger feature to achieve this. Instead of calling a 3rd-party API, you notify the database clients that something they're interested in has happened, so the clients can pull the updated data and refresh the UI.

By relying on the database’s ability, you can save yourself from introducing a new middleware and achieve a better result with a simpler and more reliable architecture.

### Authorization

Security is a tough topic. Traditionally the burden almost all falls onto the shoulder of the application code. The app holds a full-access connection to the database and ensures permissions are checked before sending commands to the database. The database (hidden behind a private network) trusts whatever requests it gets.

An obvious problem with this approach is that when your application gets more complex, the size of its API surface grows with it. As a result, it becomes increasingly challenging to ensure authorization rules are properly checked everywhere, and it's even harder when you need to make changes to some rules.

But it doesn’t have to work this way. Some modern databases support a feature called "row-level security". It allows you to define access control policies at the row level based on the current user’s attributes (id, role, group membership, etc.). As long as the application can securely pass the current user’s identity to the database, it can leave all authorization checking to the database. And since the rules are defined at the table level instead of the API level, it has a much smaller surface to protect. The "row-level security" feature is the foundation of products like [PostgREST](https://postgrest.org/), [PostGraphile](https://www.graphile.org/), and [Supabase](https://supabase.com).

### Performance-critical complex queries

OLTP databases are meant for quickly processing simple queries and mutations. It’s usually a good idea to avoid running complex queries, as it can significantly slow down the servers and cause slow user experiences and even timeouts. Instead, it's better to conduct CPU or memory-intensive tasks on the application servers because web servers are much easier to scale than databases. However, there’re cases where letting the database do the job is the best solution.

For example, let’s say you’re implementing a tree-structured asset manager (like google drive). Each folder can be granted access to users, and during navigation, a user sees a paginated list of asset items that he has access to under the current folder.

There isn’t really a way to implement this by keeping the database "dumb" and doing all the complex filtering inside the application code - you’ll end up with either under-fetching or over-fetching. However, you can implement a fairly efficient solution by fully leveraging the database's power of joining and indexing.

## The Blurring Boundary

Another problem with the "Never put business logic inside the database" practice is that, as time goes on, it’s becoming increasingly difficult to understand its scope. For example, does ORM count as the database or the application? It’s a big piece of middleware sitting in between them. It’s application code but specifically for dealing with the database. How about doing authorization inside the ORM? That’s exactly what the [ZenStack](https://zenstack.dev) project that we’re building does. Check it out if you like the idea of keeping access control rules closer to the database but don’t want to mess with SQL too much.
