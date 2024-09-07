---
description: Using ZenStack with Prisma Pulse.
sidebar_position: 14
---

# Using with Prisma Pulse (Preview)

## Introduction

[Prisma Pulse](https://www.prisma.io/data-platform/pulse) is Prisma's cloud offering that allows you to easily subscribe to real-time data change events from your database. It's a great way to build real-time applications without managing a Change Data Capture (CDC) infrastructure.

With Prisma Pulse, you can use the new `stream()` API to subscribe to data change events. For example:

```ts
const stream = await prisma.user.stream()

for await (const event of stream) {
  console.log('just received an event:', event)
}
```

The `stream()` API also allows you to filter only the events you're interested in.

```ts
// Filter for new User records with a non-null value for name
const stream = await prisma.user.stream({
  create: {
    name: { not: null },
  },
});
```

## ZenStack's access policies and Prisma Pulse

TLDR: it just works!

ZenStack's access policies seamlessly work with the `stream()` API without additional configuration. You can simply use an enhanced Prisma client to subscribe to data change events, and the access policies will be enforced automatically.

```ts
const db = enhance(prisma, { user: session.user });

// The event stream is automatically filtered by the access policies
const stream = await db.user.stream(...);
```

Only events that satisfy the "read" policies will be returned. If there are field-level "read" policies, fields that do not satisfy the policies will be stripped from the event payload. Fields marked with `@omit` are also automatically removed.
