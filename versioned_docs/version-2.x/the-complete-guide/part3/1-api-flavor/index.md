---
sidebar_label: 1. API Flavors
---

# API Flavors

API design is a complex topic. While thinking about wrapping CRUD APIs around ORM, we feel there are two main competing goals:

- Query flexibility

    Prisma's API is very flexible, especially regarding nested reads and writes. It'd be nice to preserve this flexibility fully in the derived APIs. This way, you can also carry your knowledge of using Prisma over to using the APIs.

- RESTfulness
  
    When designing CRUD APIs, making it RESTful is a natural choice. Resource-oriented URLs and semantic HTTP verbs match the problem well. While RESTful APIs traditionally suffer from the [N + 1 Problem](https://restfulapi.net/rest-api-n-1-problem/) (as traditionally ORM did, too), there are some conventions we can use to mitigate it.

It is tough to choose one over the other. So, we decided to provide both API flavors. You can choose the one that fits your use case better.
