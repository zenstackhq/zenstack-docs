---
description: Conventional wisdom tells us to never expose database to the internet, but things have been changing gradually.
tags: [database, programming, best-practice, security]
image: ./cover.png
authors: yiming
date: 2023-02-23
---

# Exposing Databases to the Internet: Seriously?

![Cover image](cover.png)

One big piece of conventional wisdom for software operation is "never expose internal-facing services to the public", and databases (especially SQL databases) fall into that category. It's good advice because data stored in them are usually highly sensitive and indispensable to most systems' proper running. Investigations with honeypots showed that publicly open databases are discovered within hours after they become active and start getting attacked within a day. What's scarier than this is you often don't even know you ever had a data breach.

<!--truncate-->

| Database | Region         | Time To First Connection (Hrs) | Time To First Attack (Hrs) | Attack Type                                         |
| -------- | -------------- | ------------------------------ | -------------------------- | --------------------------------------------------- |
| MySQL    | Frankfurt      | 8                              | 10                         | Malware Deployment                                  |
| MariaDB  | Tokyo          | 2                              | 11                         | Massive Brute Force - multiple IPs                  |
| Aurora   | North Virginia | 1                              | 15                         | Malware Deployment                                  |
| Postgres | North Virginia | 4                              | 288                        | Malware Deployment                                  |
| MySQL    | São Paulo      | 1/4                            | 16                         | Massive Brute Force - multiple IPs                  |
| Postgres | Frankfurt      | 6                              | 240                        | Information Gathering: DB version and configuration |

> _Data from [Imperva](https://www.imperva.com/blog/never-leave-your-cloud-database-publicly-accessible/)._

> _Time To First Connection: hours until the database was found and connected_

> _Time To First Attack: hours until the database got its first attach_

But things have been changing gradually during the past decade. The rise of serverless computing made it easy to spin up remote database instances and consume them from over the internet. An obvious bad practice? It's more complicated than a simple yes/no answer.

Let's explore why this is happening, the different ways how it happens, and the risk implications.

## What Drives the Desire for Publicly Accessible Databases?

Is conventional wisdom dead? Or are people now so reckless to push their products to the market ASAP without worrying much about data security? The reality is that security is always a trade-off and never black or white. Sometimes the perceived gain outweighs the higher risks that come with it. Let's look at some of the driving forces.

### Architecture Choice

To **NOT** expose your database to the internet, you'll need to colocate your backend services with it (physically or virtually). From a security point of view, the responsibility of the backend services is to control access and limit the surface of exposure. Instead of opening up full CRUD operations, your APIs do that selectively and conditionally.

This is what people have been doing for decades. But with the rise of cloud computing, there's suddenly such an abundance of choices for computing and storage platforms, and you may not want to use the same vendor for both. Without a private network boundary, you'll need to expose your database to the public network.

### Using Cloud-based Analytics Tools

Another force comes from the need to do flexible analytics. Databases are not only the foundation of your application but also the source of truth for your business analytics. Analysts love the power and autonomy offered by cloud-based BI tools like Tableau, PowerBI, etc., with which they can connect to the databases in seconds and start creating charts and dashboards right away. Apparently, read-only access to your database from the public internet is needed to make this work.

## Two Ways of Exposing Your Database

### Driver-level Direct Connectivity

The most straightforward way to open up your database to the internet is to allow drivers to connect directly. With a traditional virtual-machine based setup in cloud platforms like AWS or Azure, this means assigning a public IP address to the server and allowing inbound connection to the service port in the firewall (if any). However, with PaaS/Serverless database platforms, you usually get it set up for you immediately after an instance is created.

In such a configuration, by default, the only protection your database has is the password, so make sure a strong one is used. Depending on what the hoster supports, you should consider the following measures to reduce the chance of data breach:

-   Enable 2FA for admin access
-   Rotate database password regularly
-   Use separate credentials for different privileges
-   Set up IP whitelist
-   Allow only SSL connections
-   Encrypt data at rest
-   Make full backup regularly

### Automatically Generated APIs

As running web workload becomes the prevailing use case of databases, some new-generation vendors have started to offer web-native solutions. To name a few:

-   [Supabase](/blog/supabase)
-   [PostgREST](/blog/postgrest)
-   [ZenStack](blog/prisma-zenstack)
-   [Hasura](https://hasura.io)
-   [WunderGraph](https://wundergraph.com/)

They differ from traditional databases in several ways:

1.  Instead of using TCP protocol, use HTTP.
1.  Instead of using SQL, use GraphQL or RESTful APIs.
1.  Instead of serving a small number of long-running connections, design for a large number of short-lived ones.

Obviously, the goal is to turn a database into something that fits well into modern web architecture. Such databases are, by design, open to the web. They wrap an API layer around traditional database services, but the APIs essentially support full data access. Of course, you mustn't naively let all requests through; they're almost always integrated with an authentication system and require you to set up security policies to guard access.

This is very different from what people were used to: a naive database behind a carefully implemented secure backend service. In fact, there's no backend service anymore; the clients from the internet are meant to "manipulate" the database directly.

Scary as it sounds, this may be better than the traditional way in terms of security:

-   Modeling access policy at the database level is more robust than at the application level. You can often iterate your application without changing the security model.
-   The web API hides some dangerous power of the database, like making full dump, executing arbitrary SQL, loading and running remote code, etc.

The biggest challenge of this approach is to configure the access policies correctly. It takes work to get it right, and even harder to maintain over time.

## Is The Future of Web Security Doomed?

This is a tricky question. The rule of "never expose your database to the public" was never achieved in the first place. As long as you have any public API that allows CRUD operations, you're already "exposing".

You may say I'm quibbling, but I wanted to make the point (again) that web security is always a trade-off. By moving to the cloud, we - including vendors and buyers, have already collectively traded off the security of our data for convenience and cost-effectiveness. Years ago, cloud companies struggled so badly to convince enterprises to embrace the cloud, but eventually, the invisible hands have made its influence.

For databases, different ways of challenging conventional wisdom need to stand the test of time, but what's for sure is that some of them will help reshape the future of web development.

---

_Cover image licensed from [ShutterStock](https://shutterstock.com)_
