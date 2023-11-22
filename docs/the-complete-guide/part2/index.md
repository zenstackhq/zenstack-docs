---
sidebar_label: "Part II: Plugin System"
sidebar_position: 2
---

# Part II: Plugin System

Welcome to the second part of *ZenStack: The Complete Guide*!

Like many wonderful tools in the web development world, ZenStack adopts a plugin-based architecture. At the core of the system is the ZModel schema, around which features are implemented as plugins. It's perfectly fine to use ZenStack just as enhanced Prisma ORM, as we explained in Part I. However, plugins enable many other use cases and allow you to extend the system as needed.

A plugin can include the following parts:

- A function that takes the ZModel AST as input and executes custom logic

    The function usually transforms the AST to another format. The [@core/prisma](/docs/reference/plugins/prisma) built-in plugin is a good example. It strips out all ZenStack-specific syntax from the ZModel schema and generates a standard Prisma schema file that can be used with Prisma's toolchain.

- Custom attributes and functions to extend the ZModel language

    For example, the [@zenstackhq/openapi](/docs/reference/plugins/openapi) plugin provides attributes for controlling how an OpenAPI spec is generated from the ZModel schema. The attributes are commonly interpreted by the generator function.

- Runtime modules that are shipped with the app during deployment

    The [@zenstackhq/tanstack-query](/docs/reference/plugins/tanstack-query) plugin is a good example. Besides generating frontend data query hooks from the schema, it also provides a runtime part that facilitates the execution of the hooks.

:::info ZenStack Plugin vs Prisma Generator

If you're experienced with Prisma, you've probably used some generators, like [prisma-erd-generator](https://github.com/keonik/prisma-erd-generator) and [typegraphql-prisma](https://github.com/MichalLytek/typegraphql-prisma). ZenStack's plugins share similarities with Prisma generators but also differ in several ways:

- Ease of programming

    Prisma's generator API uses the internal [DMMF format](https://github.com/prisma/prisma/blob/main/ARCHITECTURE.md#the-dmmf-or-data-model-meta-format) that's undocumented and not very friendly to work with. ZenStack's plugin API uses the ZModel AST, which is much more intuitive. The ZenStack plugin still receives a DMMF object as input in case you need it.

- Extending the schema language

    Prisma's schema language is not open to extension, and the community has been using the [triple slash hack](/docs/guides/existing-prisma#prisma-generators-triple-slash-hack) to inject custom attributes. ZenStack allows plugins to introduce custom attributes and functions directly and type-check their usage at generation time.

Plugins and generators are not mutually exclusive. ZenStack fully supports Prisma generators, and you can use them alongside plugins.

:::

In this part of the guide, we'll explore the following topics:

1. How to use plugins
2. An overview of the built-in plugins
3. How to write your own plugins

As with Part I, we'll continue evolving our Todo project and see how to create a helpful custom plugin. If you're unfamiliar with the project, please first revisit the [Sample Project](/docs/the-complete-guide/#sample-project) part first. You can use the "part1" branch of [the-complete-guide-sample](https://github.com/zenstackhq/the-complete-guide-sample/tree/part1) as a starting point.

Let's roll on.
