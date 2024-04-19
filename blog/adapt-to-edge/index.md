---
title: "Adapting ZenStack to the Edge: Our Struggles and Learnings"
description: This post introduces the nature of edge runtime, and the common problems that you'll face when adapting a project to run on it.
tags: [edge,vercel,cloudflare]
authors: yiming
date: 2024-04-19
image: ./cover.png
---

# Adapting ZenStack to the Edge: Our Struggles and Learnings

![Cover Image](cover.png)

Edge has been a buzzword for web development for a while, but the reality is the ecosystem support is still lagging, many tools and libraries are not ready for it yet. We've recently been working on adapting [ZenStack](https://zenstack.dev) to the edge runtime. As we're wrapping up the work, it's time to share our struggles and learnings with you.

<!--truncate-->

## What is Edge Runtime?

In the context of JavaScript development, edge runtime is a kind of runtime environment that allows code to run closer to the user's location, typically at the "edge" of the network. It can potentially improve the performance of web applications by reducing latency and increasing the speed of content delivery.

For developers, the main mind-warping aspect of edge runtime is that it's a server-side environment, but it offers browser-like APIs. It means you can't enjoy the full power of Node.js or use arbitrary npm packages there. Most hurdles in adapting a project to edge runtime are about going around these limitations. You can get a feeling of what APIs are supported by skimming through [this specification from WinterCG](https://common-min-api.proposal.wintercg.org/). 

## The Hurdles and Solutions

### CommonJS Support

My initial worry was that to run in an edge runtime, your code has to be compiled into ESM. To my surprise, that's not the case. Although the edge runtime itself is not Node.js compatible and doesn't support the `require` API, apparently, the tooling of the hosting environments (like Vercel and Cloudflare) can handle CommonJS modules just fine. This saved us from the immediate trouble of converting our codebase to ESM, although we should do it anyway to keep up with the future trend.

### Loading Modules Dynamically

Being able to use CommonJS doesn't mean there are no restrictions. One of the biggest hurdles we met was that `require` a module from a dynamically calculated path is not supported. We do that in ZenStack for several reasons. For example, to deal with differences between multiple versions of a peer dependency (Prisma ORM specifically), we detect its version and adjust the module load path accordingly. It'll result in errors like:

```plaintext
Error: Dynamic require of "[Module Name]" is not supported.
```

Fortunately, ZenStack has a compiler that generates JavaScript modules (from a DSL) loaded at runtime. We could turn the runtime detection into compile-time and generate the correct module import code for the specific project setup (Prisma version). That way, the module load path is static at runtime and works well with edge runtime.

### Node APIs

Edge runtime is not Node.js compatible, and this is an intentional trade-off made for a lighter footprint and better security. You can avoid using Node-specific APIs in your code, but it can be a harder problem to solve if some of your essential dependencies are using them.

For example, ZenStack relies on [bcryptjs](https://github.com/dcodeIO/bcrypt.js) to hash passwords, which uses Node's `crypto` module. Ironically, `crypto` API is available in the edge runtime, but it's provided as a built-in, meaning you can't explicitly `require` it. To work around the problem, we have to let our users add a "browser" entry into "package.json" to tell Vercel's bundler to ignore the package during resolution:

```json
{
  ...
  "browser": {
    "crypto": false
  }
}
```

It's ugly, but it solves the problem.

Another problem with `bcryptjs` is its async `hash` function uses the `process.nextTick` Node API to yield control to the event loop for better performance. Cloudflare Worker's runtime [provides a shim](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/) for the API, but unfortunately, Vercel doesn't have it. We have to [detect if we're running on Vercel](https://edge-runtime.vercel.app/features/available-apis#addressing-the-runtime) and fall back to the synchronous `hashSync` function.

```ts
const hashFunc = typeof EdgeRuntime === 'string' 
    ? require('bcryptjs').hashSync 
    : require('bcryptjs').hash;
```

### Vendor Maturity and Consistency

If you've read to this point, you've probably already noticed that different edge environments behave differently. Yes, there is a specification about the common APIs to support, but many details remain unspecified, leaving vendors to make their own decisions. We've only tested Vercel and Cloudflare so far and have no idea how other vendors like Netlify Edge or AWS Lambda@Edge may break in other ways 🤔.

So far, the experience working with Cloudflare has been smoother than Vercel (or, more accurately, Next.js?). We've run into numerous issues with Vercel without an actionable error message. For example, the reason for the following is still unknown:

```plaintext
Compiler edge-server unexpectedly exited with code: null and signal: SIGTERM
```

### A Bonus Trap

After getting everything running locally with a Next.js project targeting edge runtime, we excitedly deployed it to Vercel. And it worked, well, sometimes ... and other times the APIs on edge randomly return HTTP 405, 500, and 504 with incomprehensible errors like: 

```plaintext
[GET ] /api/... reason=INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED, status=500, upstream_status=500, user_error=false
[POST] /api/... reason=EDGE_FUNCTION_INVOCATION_TIMEOUT, status=504, user_error=true
```

We created a Vercel ticket, communicated back and forth with their support for a few days, and couldn't identify the cause. Until I accidentally found [this piece of comment](https://github.com/prisma/prisma/issues/20566#issuecomment-2021594203) from Prisma's dev lead [@janpio](https://github.com/janpio):

```
> I also want to know if this way of instantiating a Prisma Client on each function call
> is the best approach, as in other app components I'm using a global prisma client as 
> from the docs

Yes, this is unfortunately a limitation of the edge runtimes. Connections can only be used
in the request where they were created, if you try to reuse them this might initially even
work - but as soon as one worker or environment is called to handle multiple requests at
the same time (which can happen in these environments) your worker will crash with an
exception.
```

Right. As how you usually do in a Node.js application, I had a global `PrismaClient` singleton. After changing to create a new instance for each request, the random errors are gone, and everything works perfectly. 

I still don't know why using a global instance causes such bizarre errors. Please leave a comment if you do, and I'll really appreciate it. The world is amazing - if you try hard enough, you can find a solution to pretty much any problem by some odd coincidence.

## Now That You Can. Should You?

Many excellent posts already analyze whether you should run your API on the edge, and I don't need to repeat them. Just be sure to do the research and make first-hand performance measurements before making a final decision to have your API talk to a database from the edge. [This reflection](https://twitter.com/leeerob/status/1780705942734331983) from [@leeerob](https://twitter.com/leeerob) is a very interesting one to read.
