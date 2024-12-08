---
description: Integrating with Auth0.
sidebar_position: 6
sidebar_label: 🚧 Auth0
---

# Integrating With Auth0


This guide aims to give some simple examples of using Auth0 to provide authentication when used in conjunction with Zenstack. It will not take into account the different types of authentication that Auth0 offers. The premise is that you have and understanding of Auth0's method of authentication and are able to produce an object as a result of authenticating a user with Auth0. 

## Enhancing the prisma client

The basic premise of applying a custom session object to Zenstack.

Create a user object and provide it to the enhance function when creating the Prisma client.

```
export const getPrisma = async (req) => {
  const user = await getAuthenticatedAuth0User(req);
  return enhance(user);
};
```

You can provide a type in the ZModel to express what the contents of the user object is.

```

type Auth {
  id             String      @id
  specialKey     String
  @@auth
}
```

## Adding Auth0 authentication

You can authenticate an Auth0 user and extract information from the authentication and apply is to the Zenstack session.

Here's an example using a JWT:

```
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

```
@@allow('read, update, create', auth().id == this.id)
```

or

```
@@allow('read, update, create', auth().specialKey == 'SUPERMAN')
```

You can add what you need to this variable and set the types for it as referred to in the *Enhancing the prisma client* section.


## Working along side a user model

You may want to keep a record of User's in your own database.

You can create your application in such a way that a lack of the user existing in the managed database triggers a process to create one, such as a user onboarding flow. 

```
const currentUser = async (req) => {
  const session = await getSession(req);  // get your auth0 auth session

  if (!session?.user.sub) { 
    throw new Error('UNAUTHENTICATED');      // Throw an error if the user isn's authenticated
  }

  const dbUser = await prisma.user.findUnique({    // Find the user in the db
    where: { id: session.user.sub },
  }); 
  
  return {
    id: session.user.sub,
    dbUserExists: !isNull(dbUser),    // Cause onboarding behavior 
  };
};

// Create the client using the currentUser
export const getPrisma = async (req) => {
  const user = await currentUser(req);
  return enhance(user);
};
```

When the client is created, the database is queried using the contents of the Auth0 token.

In this case, the Auth tyoe is what provide authentication, not the User model, for example: 

```
// Specify the auth type
type Auth {
  id             String      @id
  @@auth    // And decorate it
}

// add your user model as a regular model
model User {
  id               String          @id
  name             String?
  email            String?

  @@allow('create, read, update, delete', auth().id == this.id)
}
```

