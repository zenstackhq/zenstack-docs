---
description: ZenStack FAQ.

slug: /faq
sidebar_label: FAQ
sidebar_position: 5
---

# 🙋🏻 常见问题

### ZenStack 是否使用 Postgres RLS（行级安全）实现？

不，它不支持Postgres RLS。 相反，ZenStack通过注入Prisma的查询参数和（在某些情况下）进行查询后过滤来实现访问控制规则。 这种选择带来了几个好处：

1. 忽略数据库：ZenStack可以与Prisma支持的任何数据库一起使用。
2. 更改访问控制规则时无需创建迁移。
3. 与SQL RLS相比，访问控制规则的语法要简单得多。
4. 将访问控制规则与数据模型共置。

### 使用ZenStack是否会增加与数据库的连接？

不。通常会为每个请求创建增强的PrismaClient包装器（用于绑定到不同的用户身份）。 在幕后，所有这些包装器共享相同的PrismaClient实例，因此共用同一个数据库连接。

### ZenStack和框架无关吗？

是的，ZenStack是忽略框架的。 ZenStack运行时的核心是一个透明的代理，它封装了一个PrismaClient，因此它可以在任何可以运行Prisma的框架中使用。 ZenStack已经为流行的框架提供了适配器，如[Next.js]（/docs/reference/server-adapters/next）和[Fastify]（/docs/reference/server-adapters/fastify），并且正在编写更多框架适配器。 自行编写适配器也很容易。

### 如何在monorepo设置中使用ZenStack？

要在monorepo设置中使用ZenStack（比如 pnpm workspace），在`schema.prisma`所在的包中运行`zenstack init`（通常也是导出全局`prisma`实例的地方）。而不需要在工作区级别安装ZenStack相关的包。

### ZModel是否完全兼容Prisma Schema？

ZModel语言被设计为Prisma Schema的超集。 ZModel当前对Prisma模式的主要扩展是：

-   [自定义属性]（/docs/reference/zmodel-language#custom-attributes-and-functions）
-   [插件]（/docs/category/plugins）

使用单独的DSL使我们能够灵活地在将来添加更多的扩展；由于目标是保持“超集”定位，每个有效的`schema.prisma`都是有效的`schema.zmodel`。

在实践中，您可能会遇到ZenStack生成的`schema.prisma`在`prisma` CLI中触发验证错误的问题。这是因为Prisma CLI有许多验证规则，有些非常微妙。 我们尝试在`zenstack` CLI中复制这些规则，但这更像是一种尽力而为的方法。 幸运的是，`prisma` CLI报告的错误通常会给出很好的提示，告诉我们应该在`schema.zmodel`中修改什么。

我们将继续改进ZModel和Prisma Schema在验证规则方面的一致性。

### ZenStack是否要求指定的Prisma版本？

不。ZenStack参考Prisma作为`peer`依赖，应该与Prisma 4.8.0及更高版本一起使用。

### ZenStack支持Prisma迁移吗？

是的 当您运行`zenstack generate`时，它会生成一个标准的Prisma模式文件，可用于Prisma迁移。

### 除了VSCode，还有其他IDE集成吗？

不幸的是，目前VSCode是唯一官方支持的IDE。 关于JetBrains有很多问题。 ZenStack的语言工具是用[Langium]（https：//github.com/langium/langium）构建的，我们需要等待这个[issue]（https：//github.com/langium/langium/issues/999）的解决来评估JetBrains的支持。