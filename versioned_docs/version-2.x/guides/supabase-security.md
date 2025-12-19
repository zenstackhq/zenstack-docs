---
description: Guide to securely integrating Supabase with ZenStack - how to prevent unauthorized access.
sidebar_position: 11
sidebar_label: Secure Supabase with ZenStack
---


# Ensuring Security When Integrating Supabase with ZenStack

Integrating Supabase with ZenStack can be a great choice as Supabase provides authentication as well as database hosting and file uploads.

However, it is essential to take some precautions when using ZenStack with Supabase to ensure that the ZenStack authorization layer cannot be bypassed via requests to the Supabase API url.

This article will help you to understand the risk, how to test if your database is exposed, and how to prevent it.

## 1.  Understanding the Risk

Supabase allows anonymous requests to the Supabase rest API access the database by default, assuming Row Level Security (RLS) is in place. 

ZenStack's authorization can effectively serve as an in-application security layer, but **direct HTTP requests to your Supabase API could still leave your database exposed.**

This poses a potential risk because Supabase API URL and anon key are both public and can easily be found eg by inspecting the url/headers of a Supabase authentication network request.


## 2. How to test if your database is exposed to direct Supabase API requests

Use Bash or an API client (such as postman or VS Code thunder client) to send a HTTP request with these details:

```bash
curl '{SUPABASE_PROJECT_URL}/rest/v1/{DATABASE_TABLE}?select=*' \
-H "apikey: SUPABASE_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_ANON_KEY"
```

For example:

```bash
curl 'https://jypbzsozorjnogibmfhu.supabase.co/rest/v1/User?select=*' \
-H "apikey: eyOiJIUzJhbGciI1..." \
-H "Authorization: Bearer eyOiJIUzJhbGciI1..."
```

Note:
- Your Supabase project URL should look like this: `https://projectid.supabase.co`
- You can find both of these values inside Supabase dashboard > settings > api

As previously mentioned, all the detailed needed to make this request are public and could be accessed eg by inspecting the url/headers of a Supabase authentication network request.

If your database is secure, you should receive a permission denied error, such as:

```json
{
   "code": "42501",
   "details": null,
   "hint": null,
   "message": "permission denied for table User"
}
```

If you have RLS enabled on the table, you may get a response with an empty array instead of a permission denied error. This means RLS filtering is effective, and it's preventing you from reading rows that are not granted access. However, it's still recommended to fully revoke anonymous access permissions for better security

## 3. How to prevent direct Supabase API requests

### Revoke default & current privileges

Start by revoking all privileges from the `anon` role to prevent unauthenticated access, and changing the defauts to ensure future objects are also protected.

In the Supabase dashboard inside the SQL Editor tab, execute the following:

```sql
-- Revoke current privileges
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE USAGE ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Revoke default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
```

Note: If you are using Supabase cli for local development, then create a migration file with `pnpm supabase db migration new disable-anon-access` to prevent accidental rollbacks. (this creates a new local sql migration file, 'disable-anon-access' can be replaced)

### Verify Role Configurations

In the Supabase dashboard under the Database > Roles section, confirm the following:

**Anon Role:**  All permissions should be disabled.
**Authenticated Role:** All permissions should be also disabled here.
**Postgres Role:** Ensure it retains the ability to bypass RLS for necessary backend tasks.


## Conclusion

By disabling permissions for `anon` and `authenticated` roles, you prevent direct public access to your database, relying instead on your application logic and ZenStack's authorization to control access.

Remember to regularly test your application security to ensure effective and appropriate access control for your application.



