---
sidebar_position: 18
description: ORM performance benchmark
---

# Performance Benchmark

## Overview

ZenStack maintains a fork of [prisma/orm-benchmarks](https://github.com/prisma/orm-benchmarks) and included ZenStack v3 into the test matrix. This page will be periodically updated with the latest benchmark results.

Please understand ORM performance is a complex topic because different applications may have very different database configurations, data patterns and query profiles. The benchmark results should be used to understand if things are **in the right ballpark**, rather than exact performance numbers you will get in your application.

### Repository

https://github.com/zenstackhq/orm-benchmarks

### Configuration Notes

The Prisma tests are run with the new (Rust-free) [prisma-client](https://www.prisma.io/docs/orm/prisma-schema/overview/generators) generator and with the [relationJoins](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#relation-load-strategies-preview) preview feature. We believe this aligns better with how the majority of users will use Prisma going forward.

### How to Read the Results

The numbers shown are in milliseconds per operation; lower is better. ZenStack's numbers are used as a baseline and compared against other ORMs. The percentage numbers in parentheses show how much faster (negative) or slower (positive) the other ORMs are compared to ZenStack.

## Results

### Local PostgreSQL

> Tests are run against a PostgreSQL database in a local Docker container.

Iteration count: 100  
Dataset size: 500

|ORM|findMany|findMany-filter-paginate-order|findMany-1-level-nesting|findFirst|findFirst-1-level-nesting|findUnique|findUnique-1-level-nesting|create|nested-create|update|nested-update|upsert|nested-upsert|delete|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|zenstack|3.62|1.23|118.28|1.08|1.10|0.64|0.95|2.10|4.48|1.70|2.64|1.42|2.53|2.02|
|prisma|3.04 (-15.95%)|1.35 (+9.86%)|134.43 (+13.66%)|1.37 (+26.98%)|1.53 (+39.37%)|0.97 (+52.42%)|1.53 (+61.20%)|1.84 (-12.67%)|4.98 (+11.30%)|1.22 (-27.88%)|3.10 (+17.41%)|2.70 (+90.26%)|2.74 (+8.18%)|1.53 (-24.27%)|
|drizzle|8.42 (+132.62%)|0.97 (-21.18%)|94.88 (-19.78%)|1.09 (+1.39%)|1.15 (+4.82%)|0.74 (+15.88%)|1.15 (+21.70%)|1.61 (-23.57%)|3.72 (-16.84%)|0.88 (-47.98%)|2.25 (-14.80%)|0.77 (-45.54%)|2.08 (-17.96%)|1.28 (-36.74%)|
|typeorm|1.73 (-52.10%)|0.73 (-40.98%)|23.24 (-80.35%)|0.87 (-19.29%)|1.30 (+18.26%)|0.37 (-42.66%)|1.06 (+11.64%)|1.80 (-14.13%)|2.80 (-37.41%)|0.51 (-69.89%)|1.41 (-46.69%)|1.60 (+12.60%)|2.02 (-20.07%)|0.91 (-54.96%)|

### Remote PostgreSQL

> Tests are run from a local machine against a PostgreSQL database from [Neon](https://neon.com/) in the us-east-1 region.

Iteration count: 20  
Dataset size: 500

|ORM|findMany|findMany-filter-paginate-order|findMany-1-level-nesting|findFirst|findFirst-1-level-nesting|findUnique|findUnique-1-level-nesting|create|nested-create|update|nested-update|upsert|nested-upsert|delete|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|zenstack|266.88|89.09|379.77|83.93|89.51|87.56|89.48|261.96|719.56|257.24|438.89|264.01|430.05|256.50|
|prisma|349.80 (+31.07%)|173.51 (+94.76%)|485.73 (+27.90%)|171.33 (+104.15%)|179.38 (+100.41%)|173.32 (+97.95%)|180.36 (+101.57%)|175.17 (-33.13%)|1043.86 (+45.07%)|174.61 (-32.12%)|681.50 (+55.28%)|613.88 (+132.52%)|603.02 (+40.22%)|178.72 (-30.32%)|
|drizzle|1067.94 (+300.16%)|177.13 (+98.83%)|284.89 (-24.98%)|174.92 (+108.42%)|178.58 (+99.51%)|176.94 (+102.08%)|180.89 (+102.16%)|183.68 (-29.88%)|716.85 (-0.38%)|179.00 (-30.42%)|532.09 (+21.24%)|176.24 (-33.25%)|540.86 (+25.77%)|180.24 (-29.73%)|
|typeorm|268.19 (+0.49%)|87.74 (-1.51%)|473.78 (+24.76%)|86.04 (+2.52%)|182.50 (+103.90%)|88.06 (+0.57%)|175.96 (+96.66%)|265.91 (+1.51%)|436.68 (-39.31%)|88.39 (-65.64%)|348.48 (-20.60%)|355.76 (+34.75%)|443.17 (+3.05%)|88.53 (-65.48%)|

## Observations

### Cold Start Overhead

While not readily observable in the numbers, ZenStack has a higher cold start overhead due to the usage of [Zod](https://zod.dev/) for input validation. Zod does JIT compilation of schemas on the first run. This overhead is amortized over multiple operations. The worst-case cold start overhead observed is around 20ms in the test environment.
  
### Why Is ZenStack Slower for Simple Mutations?

Right now, ZenStack wraps every mutation in an explicit transaction. Although it doesn't make a real difference on the database side because PostgreSQL will do it anyway behind the scenes, it adds communication overhead between the client and the database server.

There'll be optimizations for this in the future.
