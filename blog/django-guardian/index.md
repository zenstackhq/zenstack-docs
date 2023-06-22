---
description: A comparison of django-guardian and Prisma + ZenStack for implementing access control
tags: [webdev, django, fullstack, zenstack]
authors: yiming
date: 2023-03-26
image: ./cover.png
---

# Migrating From Django to Next.js: What’s the Equivalent for Django-Guardian?

![Cover image](cover.png)

Django is a popular Python-based web framework. It’s a huge so-called “battery-included” framework covering many aspects of web development: authentication, ORM, forms, admin panels, etc. It’s also a strongly opinionated framework that offers patterns for almost everything you do, making you feel well-guided during development.

<!-- truncate -->

However, in the past few years, Django, like most non-JS stacks, is losing its grounds to JS-based full-stack frameworks like Next.js, Remix, Nuxt, etc. Why? The following post gives an excellent explanation:

> [Why I Ditched Django for NextJS](https://www.billprin.com/articles/why-i-ditched-django-for-nextjs)

Moving from one framework to another takes careful planning and execution, especially when you're changing language at the same time. A popular and powerful Javascript/Typescript equivalent stack for Django can be the following combination:

-   [Next.js](https://nextjs.org/): URL routing, SSR, and page building with ReactJS (Django's view + template layer)
-   [NextAuth](https://next-auth.js.org/): authentication (Django's authentication)
-   [Prisma](https://prisma.io): ORM + database migration (Django's model layer)

These pieces fit together very well and are sufficient for replacing most of the goodies Django provides. However, there's one piece missing. Django has a built-in permissions feature, but it's limited to model-level control, i.e., if a user or group has X access to model type Y. Many users have been using the popular [django-guardian](https://django-guardian.readthedocs.io/) package to implement row-level permissions. It allows you to establish permissions between users/groups and objects, manages the underlying permission database tables, and provides APIs for configuring and checking such permissions.

Fortunately, if you choose to use the Prisma ORM in your new stack, you can use [ZenStack](https://zenstack.dev) to achieve similar functionalities with less effort. ZenStack is a toolkit built as a power extension to Prisma ORM, and one of its focuses is access control. This post briefly compares how django-guardian and ZenStack solve row-level permissions, respectively.

## Assigning Permissions

Suppose we're building a blogging site and have a `Post` model. Django already has built-in `User` and `Group` models and predefined CRUD permissions for each model. With django-guardian, you can use the `assign_perm` API to attach permissions:

```python
from django.contrib.auth.models import User, Group
from guardian.shortcuts import assign_perm

# establishing permission between a user and a post
user1 = User.objects.create(username='user1')
post1 = Post.object.create(title='My Post', slug='post1')
assign_perm('view_post', user1, post1)
assign_perm('change_post', user1, post1)

# establishing permission between a group and a post
group1 = Group.objects.create(name='group1')
user1.groups.add(group1)
assign_perm('view_post', group1, post1)
assign_perm('change_post', group1, post1)
```

Contrary to Django, Next.js + Prisma + ZenStack is an unopinionated framework and doesn’t have built-in models for `User` and `Group`. You need to model them explicitly with ZenStack schema:

```zmodel
model User {
  id Int @id @default(autoincrement())
  username String
  groups Group[]
}

model Group {
  id Int @id @default(autoincrement())
  name String
  users User[]
}
```

The schema not only models data types and relations but also allows you to express permissions in it. Let's see how to model `User` and `Group`'s permissions on `Post`:

```zmodel
model User {
  id Int @id @default(autoincrement())
  username String
  groups Group[]
  posts Post[]
}

model Group {
  id Int @id @default(autoincrement())
  name String
  users User[]
  posts Post[]
}

model Post {
  id Int @id @default(autoincrement())
  title String
  slug String @unique
  groups Group[]
  users User[]

  // if the current user is in the user list of the post, update is allowed
  @@allow('read,update', users?[id == auth().id])

  // if the current user is in any group of the group list of the post,
  // update is allowed
  @@allow('read,update', groups?[users?[id == auth().id]])

  // ... other permissions
}
```

Some explanations:

-   `@@allow` syntax adds access-control metadata to the model. An action is allowed if any of the @@allow rules evaluate to true.
-   `auth()` represents the current login user. You'll see how it's hooked in shortly.
-   The model?[expression] syntax is a predicate over a to-many relation. `users?[id == auth().id]` reads like "whether any element in the users collection has id equal to the id of the current user".

As you can see, the permission modeling approach is quite different for django-guardian and ZenStack. Django-guardian uses imperative code to manage permissions in application code, while ZenStack favors a declarative style within data schema. Also, django-guardian's permission setting and checking (shown in the next section) are separated, while with ZenStack, you model permission data and rules altogether in one place.

## Checking Permissions

As with permission assignment, with django-guardian, permission checking is also done explicitly in the application code, mainly in one of two ways:

**1. Using imperative code**

```python
user1 = User.objects.get(username='user1')
post1 = Post.objects.get(slug='post1')

from guardian.core import ObjectPermissionChecker
checker = ObjectPermissionChecker(user1)
if checker.has_perm('change_post', post1):
  # update logic here
```

**2. Using decorators**

You can also use decorators to enable automatic permission checking on views:

```python
from guardian.decorators import permission_required_or_403

@permission_required_or_403('change_post', (Post, 'slug', 'post_slug'))
def edit_post(request, post_slug):
  # update logic here
```

No matter which method you use, you must ensure checking is added wherever permissions need to be verified.

With ZenStack, permission checking is much simpler because the rules are expressed at the ORM level, so it's automatically applied when the data layer is invoked:

-   When posts are listed, only the ones belonging to the current user or his group are returned.
-   When a post is updated, the operation is rejected if a user doesn't belong to the post or any group of the post.

The only setup needed is to create an access-control-enabled Prisma client wrapper with the current login user as the context:

```ts
// update-post.ts: function for updating a post
import { prisma } from './db';
import { getSessionUser } from './auth';

export function updatePost(request: Request, slug: string, data: PostUpdateInput) {
    const user = await getSessionUser(req);

    // get an access-control enabled Prisma wrapper
    // the "user" context value supports the `auth()`
    // function in the permission rules
    const db = withPresets(prisma, { user });

    // error will be thrown if the current user doesn't
    // have permission
    return db.post.update({ where: { slug }, data });
}
```

## Wrap Up

As you can see, both django-guardian and ZenStack solve row-level permissions problems, although in very different paradigms. Django-guardian relies on imperative code, and it's more a developer's responsibility to ensure proper checking logic is added wherever needed.

On the other hand, ZenStack favors declarative modeling. Since rules are expressed at the ORM level, it automatically applies across all application code that uses the data layer, improving consistency and robustness.

As a relatively new toolkit, ZenStack is not without its limitations. For example, compared to django-guardian, there're two main missing features:

1. Custom permissions

    ZenStack models a fixed set of permissions: CRUD, while django-guardian allows you to define custom permissions. Although all permissions eventually boil down to CRUD, custom permissions can express fine-grained field-level permission control. This is not supported by ZenStack yet.

1. API for explicitly checking permissions

    ZenStack's permission checking is injected into ORM's CRUD APIs. However, sometimes it can be convenient to explicitly check if a user has permission for a specific object, and use it to, for example, dynamically render a UI.

I hope this post provides some help for your journey of transitioning your python stack to the Javascript world and good luck with the endeavor!
