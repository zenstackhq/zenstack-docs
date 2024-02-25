---
description: Guide to securely integrating supabase with zenstack - how to protect unauthorized access.
sidebar_position: 3
sidebar_label: Secure Supabase with ZenStack
---


# Ensuring Security When Integrating Supabase Auth with ZenStack

Supabase can be a great choice for authentication with zenstack as it also provides provides other complementary backend services such as file uploads and local docker development using the supabase cli.

However, it is essential to take some precautions when using zenstack with supabase to ensure that the zenstack authorization layer cannot be bypassed using direct HTTP access.


## Understanding the Risk

Supabase allows anonymous requests to access the database by default, assuming Row Level Security (RLS) is in place. 

ZenStack's authorization can effectively serve as an in-application security layer, but **direct HTTP requests to your Supabase API could still leave your database exposed.**

Don't panic - your database isn't necessarily 'at risk' if you haven't already followed these steps. You can skip to steps 2/3 to check before running step 1.


## 1. Revoke Default Privileges

Start by revoking all default privileges from the `anon` role to prevent unauthenticated access. 

In the Supabase dashboard inside the SQL Editor tab, execute the following:

```sql
-- Revoke default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;

-- Revoke current privileges
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE USAGE ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;
```

Note: If you are using supabase local, then create a local migration file with `pnpm supabase db migration new disable-anon-access` to prevent accidental rollbacks. (this creates a new local sql migration file, 'disable-anon-access' can be replaced)

## 2. Verify Role Configurations

In the Supabase dashboard under the Database > Roles section, confirm the following:

**Anon Role:** Disable all permissions to prevent unauthenticated database operations.
**Authenticated Role:** Also disable all permissions, providing access through specific roles.
**Postgres Role:** Ensure it retains the ability to bypass RLS for necessary backend tasks.

By disabling permissions for `anon` and `authenticated` roles, you prevent direct public access to your database, relying instead on your application logic and ZenStack's authorization to control access.

## 3. Test direct HTTP request access

To manually test your database's security:

1. **Sign In:**
   - Perform a sign-in operation on your front end and inspect the network request in your browser's developer tools.

2. **Capture Request Details:**
   - Locate the authentication request and note down the URL and headers, specifically the API key and authorization token.

3. **Change the auth request to a rest request:**
   - Use the captured details to construct a new request to your database. For example:
     ```
     https://projectid.supabase.co/rest/v1/User?select=*
     ```
     note: change projectid and User to reflect your database.

4. **Send the Request:**
   - Use an API client (such as postman or VS Code thunder client) to send the modified request. Ensure that you include the API key and authorization token in the request headers.

5. **Check the Response:**
   - If your database is secure, you should receive a permission denied error, such as:
     ```json
     {
       "code": "42501",
       "details": null,
       "hint": null,
       "message": "permission denied for table User"
     }
     ```

## Conclusion

By revoking default privileges and ensuring correct role configurations, you protect your database from unauthorized access while using Supabase Auth with ZenStack. Regularly test your security settings to maintain an effective and appropriate access control for your application.

