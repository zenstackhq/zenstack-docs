---
sidebar_position: 10
description: Polymorphic models in ZModel
---

import ZModelVsPSL from '../_components/ZModelVsPSL';

# Polymorphism

<ZModelVsPSL>
Polymorphism is a ZModel feature and doesn't exist in PSL.
</ZModelVsPSL>

## Introduction

When modeling non-trivial applications, the need of an "Object-Oriented" kind of polymorphism often arises:
- Something **IS-A** more abstract type of thing.
- Something **HAS-A/HAS-many** a more abstract type of thing(s).

Imagine we're modeling a content library system where users own different types of content: posts, videos, images, etc. They share some common traits like name, creation date, owner, etc., but have different specific fields.

It may be tempting to use mixins to share the common fields, however it's not an ideal solution because:

- The `User` table will have relations to each of the content types.
- There's no efficient and clean way to query all content types together (e.g., all content owned by a user).
- Consequently, whenever you add a new content type, you'll need to modify the `User` model, and probably lots of query code too.

A true solution involves having a in-database model of polymorphism, where we really have a `Content` table that serves as an intermediary between `User` and the concrete content types. This is what ZModel polymorphism is about.

:::info
There are [two main ways](https://www.prisma.io/docs/orm/prisma-schema/data-model/table-inheritance) to model polymorphism in relational databases: single-table inheritance (STI) and multi-table inheritance (MTI, aka. delegate types). ZModel only supports MTI.
:::

## Modeling polymorphism
