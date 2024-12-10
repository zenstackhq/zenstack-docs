---
description: Integrating with Auth0.
sidebar_position: 6
sidebar_label: Auth0
---

# Integrating With Auth0

This guide provides simple examples of using Auth0 authentication with ZenStack. While Auth0 offers various authentication methods, this guide assumes you understand Auth0's authentication basics and can obtain a user object after authentication.

## Enhancing the prisma client

The basic premise of applying a custom session object to ZenStack.

Create a user object and provide it to the enhance function when creating the Prisma client.

```ts
export const getPrisma = async (req) => {
  const user = await getAuthenticatedAuth0User(req);
  return enhance(user);
};
```

You can provide a type in the ZModel to express what the contents of the user object is.

```prisma
type Auth {
  id             String      @id
  specialKey     String
  @@auth
}
```

## Adding Auth0 authentication

You can authenticate an Auth0 user and extract information from the authentication and apply it to the ZenStack session.

Here's an example using a JWT:

```ts
export const getPrismaJWT = async (req) => {
  try {
    const jwks = jose.createRemoteJWKSet(new URL(process.env.AUTH0_JWKS_URI));
    const token = toString(req.headers.get('authorization')).replace('Bearer ', '');
    const res = await jose.jwtVerify(token, jwks, {
      issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
      audience: process.env.AUTH0_TWIST_API_AUDIENCE,
      algorithms: ['RS256'],
    });
  
    const userId = res.payload.sub;
    const user = {
      id: userId,
      specialKey: res.payload.metadata.specialKey
    };
  
    return enhance(prisma, {user});
  catch (err) {
    // unauthenticated error
  }  
};
```

This would populate your `auth()` in the Zmodel with the object you've just created from auth0; enabling checks like:

```prisma
@@allow('read, update, create', auth().id == this.id)
```

or

```prisma
@@allow('read, update, create', auth().specialKey == 'SUPERMAN')
```

You can add what you need to this variable and set the types for it as referred to in the *Enhancing the prisma client* section.


## Working along side a user model

You may want to keep a record of User's in your own database.

You can create your application in such a way that a lack of the user existing in the managed database triggers a process to create one, such as a user onboarding flow. 

```ts
const currentUser = async (req) => {
  const session = await getSession(req);  // get your auth0 auth session

  if (!session?.user.sub) { 
    throw new Error('UNAUTHENTICATED');      // Throw an error if the user isn't authenticated
  }

  const dbUser = await prisma.user.findUnique({    // Find the user in the db
    where: { id: session.user.sub },
  }); 
  
  return {
    id: session.user.sub,
    dbUserExists: !isNull(dbUser),    // If the user doesn't exist in the database, this variable can be set in the session
  };
};

// Create the client using the currentUser
export const getPrisma = async (req) => {
  const user = await currentUser(req);
  return enhance(user);
};
```

You can use the result of this token to redirect a user to an onboarding flow, such as a signup form:

```ts
app.get('/', async (req, res) => {
  const user = await currentUser(req);
  if (!user.dbUserExists) {
    res.redirect('/onboarding');
  }
  res.send('hello user');
});
```

and create a user record using the ID from the Auth0 session, here's a small example using the Auth0 React SDK:

```ts
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { trigger, isMutating } = useCreateUser();

  const createUser = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');

    await trigger({
      data: {
        id: user.sub,
        name: name,
      },
    });
  }, [trigger, user])

  return <UserForm onSubmit={createUser}/>
};
```


When the client is created, the database is queried using the contents of the Auth0 token.

In this case, the Auth type is what provide authentication, not the User model, for example: 

```prisma
// Specify the auth type
type Auth {
  id             String      @id
  @@auth         // And decorate it with @@auth to tell ZenStack to use this as the session object
}

// add your user model as a regular model
model User {
  id               String          @id
  name             String?
  email            String?

  // You can now use the Auth object, populated by Auth0, to write policies
  @@allow('create, read, update, delete', auth().id == this.id)
}
```

