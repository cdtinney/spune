# Supabase Setup

Spune uses Supabase as a managed PostgreSQL host. Only the standard Postgres connection is used — no Supabase-specific features (Auth, Storage, etc.) so the app remains portable to any Postgres instance.

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your database password — you'll need it for the connection string.

## 2. Get the connection string

1. In your project dashboard, go to **Project Settings > Database**.
2. Copy the **URI** connection string. It looks like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```

## 3. Run the migration

In the **SQL Editor** (or via `psql`), run the contents of:

```
packages/server/src/database/migrations/001_create_users.sql
```

This creates the `users` table. The `session` table is created automatically by `connect-pg-simple` on first run.

## 4. Configure the server

Copy the example env file and fill in your connection string:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your Supabase connection string:

```
DATABASE_URL=postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

## 5. Row Level Security (RLS)

Supabase enables RLS by default on tables created via the dashboard, but tables created via SQL (like ours) have RLS disabled.

Since the server connects as the `postgres` role (which bypasses RLS anyway), no policy is strictly required. If you want to enable RLS for defense in depth, run this in the SQL Editor:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow the postgres role full access (server connection)
CREATE POLICY "Server full access" ON users
  FOR ALL
  TO postgres
  USING (true)
  WITH CHECK (true);
```

## Notes

- The `postgres` role has superuser privileges and bypasses RLS by default. RLS policies only matter if you later add restricted roles (e.g., `anon` or `authenticated` via Supabase client).
- To keep the app portable, avoid using Supabase-specific features like `supabase-js`, Supabase Auth, or Storage.
