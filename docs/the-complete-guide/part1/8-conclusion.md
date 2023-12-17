---
sidebar_label: 8. Conclusion
---

import Requirements from '../../_components/_todo-requirements.md';

#  Conclusion

In this part of the guide, we've focused on the core layer of ZenStack - an enhanced Prisma Client. The enhanced Prisma Client essentially turns the ORM into a fully secured data access layer, enabling the upper layer features like the automatic CRUD APIs and the generation of frontend data query libraries.

The design choice of enhancing Prisma Client makes ZenStack framework-agnostic. It can be used wherever Prisma is used - a CLI application, a Node.js backend, or a full-stack application - as a non-intrusive drop-in replacement.

The completed sample project up to the end of this part can be found in the "part1" branch of the [the-complete-guide-sample](https://github.com/zenstackhq/the-complete-guide-sample/tree/part1) repo. You can clone it and check out to that branch with the following command:

```bash
git clone --branch part1 https://github.com/zenstackhq/the-complete-guide-sample.git my-todo-app
```
