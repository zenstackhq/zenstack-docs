---
sidebar_label: "The Complete Guide"
sidebar_position: 3
title: "ZenStack: The Complete Guide"
description: The Complete Guide of ZenStack
---

# ZenStack: The Complete Guide

## Introduction

Welcome to *The Complete Guide of ZenStack*. This guide is designed to systematically introduce the key concepts in ZenStack, and guide you through how to use the essential features of it.

## Organization

ZenStack consists of three layers of functionalities, each depends on the previous one. These layers are explained in details in the following three parts.

### Part I: Supercharged Prisma ORM

The first layer works as an extension to Prisma ORM - both for the schema language and the runtime PrismaClient. We made several extensions to the Prisma Schema Language to make it possible to expression more than just the database schema. For example, you can attach access policies to the data models. At runtime, ZenStack creates a transparent proxy around PrismaClient to add extra behavior ot it - one of the best example of which is the automatic access control enforcement.

The extension to Prisma ORM is the foundation of ZenStack and enables all other features above it. These features are also agnostic to the framework you use for the backend. It's simply a drop-in replacement to Prisma.

[Go to Part I](/docs/the-complete-guide/part1)

### Part II: Automatic CRUD APIs

Developers build APIs to support the client-side of their applications. One of the most common types of APIs is the CRUD - Create, Read, Update, and Delete. Building CRUD APIs is a tedious task but error-prone at the same time.

Since ZenStack already secures data access at the ORM layer as we learnt from the previous part, it can automatically generate CRUD APIs for you. You'll learn about the details in this part of the guide.

[Go to Part II](/docs/the-complete-guide/part2)

### Part III: Frontend Data Query

Modern web apps often use data query libraries (like [TanStack Query](https://tanstack.com/query) and [SWR](https://swr.vercel.app/)) to fetch data from the backend. These libraries help you build reactive data binding UI with ease.

ZenStack can generate hooks code that talk to the automatic CRUD API introduced in the previous part, targeting these libraries. The hooks help you implement front-end data query with minimum code and full type safety. Part III focuses on topic.

[Go to Part III](/docs/the-complete-guide/part3)
