---
sidebar_position: 100
description: ORM performance benchmark
---

# Performance Benchmark

## Overview

ZenStack maintains a fork of [prisma/orm-benchmarks](https://github.com/prisma/orm-benchmarks) and included ZenStack v3 into the test matrix. This page will be periodically updated with the latest benchmark results.

Please understand ORM performance is a complex topic because different applications may have very different database configurations, data patterns and query profiles. The benchmark results should be used to understand if things are **in the right ballpark**, rather than exact performance numbers you will get in your application.

### Repository

[zenstackhq/orm-benchmarks](https://github.com/zenstackhq/orm-benchmarks)

### Configuration Notes

The Prisma tests are run with the new (Rust-free) [prisma-client](https://www.prisma.io/docs/orm/prisma-schema/overview/generators) generator and with the [relationJoins](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#relation-load-strategies-preview) preview feature. We believe this aligns better with how the majority of users will use Prisma going forward.

### How to Read the Results

The numbers shown are in milliseconds per operation; lower is better. ZenStack's numbers are used as a baseline and compared against other ORMs. The percentage numbers in parentheses show how much faster (negative) or slower (positive) the other ORMs are compared to ZenStack.

## Results

### Local PostgreSQL

> Tests are run against a PostgreSQL database in a local Docker container.

Iteration count: 500  
Dataset size: 1000

|ORM|findMany|findMany-filter-paginate-order|findMany-1-level-nesting|findFirst|findFirst-1-level-nesting|findUnique|findUnique-1-level-nesting|create|nested-create|update|nested-update|upsert|nested-upsert|delete|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|zenstack|1.85|0.81|547.38|2.53|1.40|0.59|1.35|1.53|3.21|0.89|2.24|1.17|2.00|1.38|
|prisma|4.40 (+137.77%)|0.83 (+2.86%)|589.62 (+7.72%)|1.07 (-57.51%)|1.43 (+2.27%)|0.63 (+6.44%)|1.28 (-4.69%)|1.34 (-12.39%)|3.55 (+10.58%)|0.86 (-3.33%)|2.45 (+9.54%)|1.85 (+58.25%)|2.41 (+20.69%)|1.51 (+9.67%)|
|drizzle|3.77 (+103.74%)|0.82 (+2.12%)|527.09 (-3.71%)|1.07 (-57.54%)|1.35 (-3.65%)|0.69 (+16.40%)|1.20 (-10.90%)|1.47 (-4.11%)|3.18 (-1.04%)|0.86 (-3.79%)|2.17 (-3.21%)|0.76 (-34.57%)|1.92 (-3.67%)|1.42 (+3.31%)|
|typeorm|4.00 (+116.46%)|0.57 (-28.82%)|30.08 (-94.50%)|1.97 (-22.22%)|1.49 (+6.69%)|0.38 (-36.09%)|1.26 (-6.15%)|1.71 (+12.04%)|2.50 (-22.05%)|0.57 (-36.09%)|1.53 (-31.55%)|1.54 (+31.77%)|1.87 (-6.46%)|1.14 (-17.38%)|

### Remote PostgreSQL

> Tests are run from a machine in US west against a PostgreSQL database from [Neon](https://neon.com/) in the us-east-1 region.

Iteration count: 20  
Dataset size: 1000

|ORM|findMany|findMany-filter-paginate-order|findMany-1-level-nesting|findFirst|findFirst-1-level-nesting|findUnique|findUnique-1-level-nesting|create|nested-create|update|nested-update|upsert|nested-upsert|delete|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|zenstack|312.47|76.08|655.15|73.44|76.59|75.86|76.95|78.02|470.09|75.72|384.52|230.39|384.86|78.40|
|prisma|355.75 (+13.85%)|75.96 (-0.16%)|696.63 (+6.33%)|74.64 (+1.64%)|75.05 (-2.01%)|76.66 (+1.06%)|75.38 (-2.04%)|74.94 (-3.94%)|521.30 (+10.89%)|77.75 (+2.68%)|460.83 (+19.85%)|379.62 (+64.77%)|526.45 (+36.79%)|78.14 (-0.33%)|
|drizzle|303.62 (-2.83%)|219.17 (+188.07%)|614.18 (-6.25%)|146.22 (+99.11%)|150.06 (+95.93%)|147.49 (+94.43%)|149.38 (+94.12%)|146.58 (+87.89%)|597.02 (+27.00%)|145.94 (+92.74%)|444.78 (+15.67%)|149.66 (-35.04%)|453.70 (+17.89%)|148.27 (+89.12%)|
|typeorm|298.76 (-4.39%)|74.78 (-1.71%)|438.22 (-33.11%)|72.92 (-0.70%)|148.71 (+94.17%)|73.68 (-2.87%)|151.04 (+96.28%)|220.29 (+182.36%)|376.70 (-19.87%)|72.68 (-4.01%)|295.20 (-23.23%)|298.66 (+29.63%)|369.63 (-3.96%)|74.07 (-5.52%)|

## Observations

### Cold Start Overhead

While not readily observable in the numbers, ZenStack has a higher cold start overhead due to the usage of [Zod](https://zod.dev/) for input validation. Zod does JIT compilation of schemas on the first run. This overhead is amortized over multiple operations. The worst-case cold start overhead observed is around 20ms in the test environment.

We'll seek ways to reduce this overhead in the future.
