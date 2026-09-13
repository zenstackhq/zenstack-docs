---
title: Turning Your Database Into an MCP Server With One Click
description: The third post of the MCP series, about what it took to turn the Code Mode approach into something you can switch on for your own database
tags: [ai, mcp, database, authorization, studio]
authors: jiasheng
date: 2026-09-13
image: ./cover.png
---

# Turning Your Database Into an MCP Server With One Click

![Cover Image](cover.png)

<!--
IMAGE PROMPT (cover.png, 1200x630):
Flat vector illustration, clean developer-blog style, warm orange accent on an off-white background.
A single large toggle switch in the "on" position sits in the center. A thin cable runs from the switch
on the left to a simple database cylinder, and on the right to three small rounded tool cards labeled
"schema", "check", "execute". Behind the switch, faded and slightly out of focus, a long tangled
checklist of setup steps trails off the edge of the frame. No logos, no people, no other text.
-->

## Make It Work, Make It Right, Make It…

There is a piece of advice, usually attributed to Kent Beck, that almost every developer has heard at some point:

> Make it work, make it right, make it fast.

Most people read it as a warning about premature optimization. But I always feel it describes the life of any idea that other people are supposed to use. And it happens to describe the MCP series I have been writing for more than a year.

<!--truncate-->

The first post, [Turning Your Database Into an MCP Server With Auth](/blog/database-to-mcp), was the **make it work** part. It built a remote MCP server with OAuth from scratch and turned every CRUD operation of every model into its own tool. It worked, as long as your schema was small.

The second post, [How to Save Bloated MCP with Code Mode](/blog/mcp-code-mode), was the **make it right** part. A user reported that loading a single tool bloated the context window to 400K tokens, so I collapsed the whole thing into three tools: `schema`, `check`, and `execute`. The approach held up well. I closed that post by admitting I was pretty sure you would run into issues with it, and asked you to tell me.

<!--
IMAGE PROMPT (series-triptych.png, 1600x600):
Three-panel horizontal triptych, flat vector, same palette as the cover.
Panel 1 labeled "work": a messy workbench with many small tool icons scattered around a database cylinder.
Panel 2 labeled "right": the same workbench tidied, with just three neat tool cards.
Panel 3 labeled "easy": the workbench gone, replaced by a single toggle switch next to the database.
Thin arrows connect the panels left to right. Only the three labels as text.
-->

So what is the third step? For this series, I don't think it's *fast* in the sense of milliseconds.

## Nobody Runs Sample Repos

Let me be honest about what happened after the second post. The sample repo, [zenstack-code-mode-mcp](https://github.com/jiashengguo/zenstack-code-mode-mcp), has 3 stars as I write this. 😂

I don't think it's because people disliked the idea. Look at what it asks you to do before a single query comes back: clone it, install it, rewrite `schema.zmodel` to match your own database, run the server, find out whether your MCP client connects to remote servers directly or needs the `mcp-remote` proxy, and then decide how to pass the user identity along. And that's the *short* version. The first post also asked you to add models for OAuth clients, authorization codes, access tokens, and refresh tokens, implement three OAuth endpoints, write a login page, and keep a map of session transports.

Every step is reasonable. Together, they are a weekend.

I wrote about this trap a long time ago in a post about [developer experience](/blog/good-dx), borrowing a line from Steve Krug's *Don't Make Me Think*:

> We don't make optimal choices. We satisfice.

A developer who wants Claude to look at last week's orders is not going to compare five MCP architectures. They try the first thing that works in ten minutes. If mine takes a weekend, they will paste a database connection string into the agent's config and hope for the best.

**A solution nobody can set up is just a blog post.**

So the third step of this series is **make it easy**. That's what we have spent the last few months doing, inside ZenStack Studio.

## What One Click Actually Means

[ZenStack Studio](https://studio.zenstack.dev/) started as a GUI for your data: a table editor that understands relations and a query editor that uses the same query API as the ORM. One command gets you there:

```bash
npx @zenstackhq/cli studio
```

It introspects your existing PostgreSQL, MySQL, or SQLite database, generates a `schema.zmodel` from it, and starts a small proxy on your machine. Studio talks to that proxy, and the proxy talks to your database, so your credentials stay on your machine and never reach ZenStack. You don't need to use the ZenStack ORM or change any application code for any of this.

Once the project is open, there is an **MCP Server** entry next to the Table Editor and Query Editor. Switch it on, and Studio hands you a configuration to paste into your MCP client:

```json
{
  "mcpServers": {
    "zenstack": {
      "url": "<your MCP server URL, copied from Studio>",
      "headers": {
        "Authorization": "Bearer <token generated by Studio>"
      }
    }
  }
}
```

If your proxy only runs on localhost, Studio gives you a variant that goes through `@zenstackhq/studio-mcp-remote` to bridge the two. Either way, you copy, paste, and ask Claude Code or Cursor a question.

<!--
IMAGE PROMPT (studio-mcp-flow.gif, 1280x800, ~15 seconds, looping):
NOTE: a real screen recording will be far more convincing here than a generated image.
If generated, a stylized UI walkthrough in four beats, dark-mode UI, no real brand logos:
1) a terminal running "npx @zenstackhq/cli studio" and printing "schema generated" and "proxy running";
2) a web app sidebar with "Table Editor", "Query Editor", "MCP Server"; the cursor clicks "MCP Server" and flips an "Enabled" toggle;
3) the cursor clicks a "Copy" button above a JSON config block;
4) an AI coding assistant chat asks "Which 5 customers spent the most last month?" and replies with a small table.
-->

That's the click. Everything I spent two posts building sits behind it.

## Same Three Tools, Harder to Misuse

Under the hood, it's still the Code Mode design from the previous post. The agent gets `schema`, `check`, and `execute`, whether your database has five models or fifty. But running it against real databases, not just my gym demo, taught us a few things.

### `check` asks the TypeScript compiler

When the agent composes a call like `db.order.findMany({ ... })`, `check` doesn't guess whether the arguments are valid. It builds a small TypeScript program in memory from your schema's types, drops the call into it, and runs the compiler. If the agent misspells a field or passes a string where a date belongs, it gets the same error you would see in your editor, before anything touches the database.

### Skipping `check` no longer matters for safety

Remember the confession Claude gave me in the previous post, after I noticed it had never called `check`:

> I got lucky that the queries happened to be valid, but that's not the right approach.

Adding a MUST to the prompt helped, and Studio's server instructions still insist on `check` first. But a prompt is a request, not a guarantee. So `execute` now runs the permission check again itself. An agent that skips `check` only misses the helpful type errors. It cannot get around a rule by skipping a step. That's the "high cohesion, low coupling" point I made last time, applied one level further.

### You choose what the agent can see

The **Exposed Models** page is a table with a switch for `read`, `insert`, `update`, and `delete` on every model. A model with every switch off disappears from what the `schema` tool returns, as if it didn't exist.

<!--
IMAGE PROMPT (exposed-models.png, 1400x700):
NOTE: a real screenshot of the Exposed Models page is preferable.
If generated: a clean dark-mode settings table titled "Exposed Models" with a search box.
Columns: Model, Read, Insert, Update, Delete. Rows: Customer, Order, OrderItem, Invoice, AuditLog.
Most toggles are on; AuditLog has every toggle off; Invoice has only Read on.
-->

There is a subtle part here. The strength of the query API is that one call can traverse relations, which is exactly what bloated the context in the first place. Here, the same strength could turn into a back door. So `check` and `execute` follow every `include` and `select` in the call, not just the top-level model:

```tsx
// Order is exposed, Customer is not
db.order.findMany({ include: { customer: true } })
```

The agent gets back:

```
Model 'Customer' is not exposed by this MCP server.
```

## Who Is Asking?

Model switches answer *what* the agent can touch. For MCP, I think the more interesting question is *who* the agent is acting for.

Studio gives you two choices when connecting. **Full access** applies no rules at all, which is fine for poking around your own local database. **Specific user** means every query runs as if that user had made it, so your ZenStack access policies apply. Studio generates the schema from your database, and you can add policies to it, like this:

```zmodel
model User {
  id     String  @id
  role   String
  orders Order[]

  // users can read their own profile
  @@allow('read', auth() == this)
}

model Order {
  id      String  @id
  total   Decimal
  owner   User    @relation(fields: [ownerId], references: [id])
  ownerId String

  // users can only read their own orders
  @@allow('read', auth() == owner)

  // support staff can read all orders
  @@allow('read', auth().role == 'support')
}
```

Connect as `{ "id": "user_42" }`, and when the agent asks for "total spending last month," it only ever sees user_42's orders. Nothing in the prompt makes that happen. Just like in the first post, it holds no matter what arguments the LLM generates, even if it hallucinates a `where` clause that asks for everyone.

The identity travels in the `Authorization` header as a token signed with your project's secret key. Studio generates one for you, but it also shows a short Node.js snippet to sign one yourself, because this is where it gets interesting beyond coding agents. If your backend signs a token per end user, the same MCP server becomes an in-product assistant that answers from live data, scoped to whoever is asking.

<!--
IMAGE PROMPT (two-identities.png, 1600x700):
Flat vector diagram, same palette as the cover. On the left, two chat windows stacked vertically.
The top window has a small badge "dana (support)" and a question "Why did ticket 4471's refund fail?".
The bottom window has a badge "user_42 (customer)" and a question "What did I order last month?".
Both windows connect with lines to a single box in the middle labeled "MCP server", with a small key icon on each line.
On the right, a database cylinder. The line from "dana" to the database lights up a wide set of rows;
the line from "user_42" lights up only two rows. Caption text at the bottom: "same server, different signed token".
-->

Twice now I've complained about Trello not answering "How many cards were done last week?" Twice I built a project to show how that could work. This time it's a toggle and a signed token. 😄

### Wait, What Happened to OAuth?

If you read the previous post, you may remember I called OAuth support one of the best features ever added to MCP, and quoted this line to explain why:

> An engineer leaves your team? Revoke their OAuth token and access to the MCP server; they never had access to other keys and secrets to start with.

So why does Studio use signed tokens instead?

OAuth answers the question "who is sitting at this keyboard?" But the identity an MCP connection should run as isn't always that person. When a support engineer investigates one customer's ticket, or when your backend serves an assistant to thousands of end users, the identity is something *you* decide and attach, not someone who logs in through a browser. A signed claim says that directly.

But every sword has two blades, and the quote above is exactly the blade we gave up. All tokens are signed with one secret per project, and regenerating that secret invalidates every token signed with it. Studio warns you about precisely that before it lets you do it. If you need to cut off one person today, you rotate the key for everyone. That's the trade-off we chose, and I'd rather you hear it from me than find out in production.

## Try It on Your Own Database

The whole thing starts with the same command:

```bash
npx @zenstackhq/cli studio
```

Then open [studio.zenstack.dev](https://studio.zenstack.dev/). The [Studio docs](/docs/studio) cover the rest.

About the price, plainly: Studio and the MCP server are free on localhost, with no credit card. Anything involving identity (signed access keys, running the proxy on a public network, impersonating users in Studio, and scoping the MCP server to a single user) is part of Pro, at $40 a month per organization rather than per seat. The first two posts in this series cost you a weekend. I'll let you decide which is cheaper. 😉

If you connect it and the agent does something surprising, like writing a query `check` should have caught or getting lost in your schema, I really want to hear about it. That's exactly how the second post happened. Find me on [X](https://x.com/jiashenggo) or in [our Discord](https://discord.gg/Ykhr738dUe).

Make it work, make it right, make it easy. I'll leave the *fast* part to you.
