---
description: ZenStack FAQ.

slug: /faq
sidebar_label: FAQ
sidebar_position: 100
---

# 🙋🏻 FAQ

## What databases are supported?

SQLite (with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) or [sql.js](https://github.com/sql-js/sql.js) driver), PostgreSQL (with [node-postgres](https://github.com/brianc/node-postgres) driver or [@neondatabase/serverless](https://github.com/neondatabase/serverless)), and MySQL (with [mysql2](https://github.com/sidorares/node-mysql2) driver) are supported.There's no plan to support other relational databases or NoSQL databases.

## What JavaScript runtimes are supported?

- Node.js: systematically tested.
- Bun: passed basic end-to-end tests.
- Vercel Edge Runtime: passed basic end-to-end tests.
- Deno: not tested.
