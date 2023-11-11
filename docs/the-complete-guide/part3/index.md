---
sidebar_label: "Part III: Automatic CRUD API"
sidebar_position: 3
---

# Part III: Automatic CRUD API

In Part I, we've learned how ZenStack extended Prisma ORM on the schema language and the runtime level. By making these extensions, ZenStack turned unleash many new potentials of the ORM, and turned it into a data access layer that enforces access control and additional data integrity.

One interesting side effect of this extension is that we can now automatically derive CRUD APIs from the schema. The data models tell us how the input/output of the APIs should look like, and the enhanced Prisma Client ensures that they are secure.

In this part of the guide, we'll learn how such automatic APIs work - the general architecture, the different flavors of APIs, and the way how they are integrated to the framework of your choice.

We'll also continue evolving our Todo project and turn it into a fully functional backend service. If you're not familiar with the project, please check out the [Sample Project](/docs/the-complete-guide/#sample-project) part first. You can use the "part2" branch of [the-complete-guide-sample](https://github.com/zenstackhq/the-complete-guide-sample/tree/part2) as a starting point.

Let's get started.
