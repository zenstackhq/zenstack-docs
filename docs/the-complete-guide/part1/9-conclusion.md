---
sidebar_label: 9. Conclusion
---

import Requirements from '../../_components/_todo-requirements.md';

#  Part I Conclusion

In this part of the guide, we've focused on the core layer of ZenStack - an enhanced Prisma Client. The enhanced Prisma Client essentially turns the ORM into a fully secured data access layer, and it is what enables the upper layer features like the automatic CRUD APIs and the generation of frontend data query libraries.

### Sample Project

Through out this guide, we'll use a multi-tenant Todo application to demonstrate the concepts and features of ZenStack. The requirements of the app are as follows:

<Requirements />

You can find a ready-to-run "headless" implementation of the above requirements in this repo:

[https://github.com/zenstackhq/sample-todo-headless](https://github.com/zenstackhq/sample-todo-headless)

Check how the requirements are modeled in the ZModel schema. Feel free to play with the test script, try out different scenarios, and observe how the access policies and data validation rules are enforced in action.
