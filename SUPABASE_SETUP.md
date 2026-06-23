# VELOZZA PLATFORM SUPABASE SETUP

## Prerequisites
- Supabase account (https://supabase.com)
- Project created in Supabase
- Access to SQL editor

## Step 1: Run Database Migrations

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run**
7. Wait for completion (should take 10-30 seconds)

## Step 2: Verify Tables Created

In Supabase:
1. Go to **Table Editor**
2. Verify these tables exist:
   - organizations
   - users
   - clients
   - intake_forms
   - brand_blueprints
   - connected_social_accounts
   - content_posts
   - messages
   - subscriptions
   - invoices
   - audit_logs

## Step 3: Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

Find these in Supabase Project Settings → API

## Step 4: Create Initial Admin User

Run this SQL in Supabase SQL Editor:

```sql
-- Create initial admin organization
INSERT INTO organizations (name, email, created_by, subscription_status)
VALUES ('Velozza Creative Works', 'admin@velozzaworks.com', 'admin', 'active');

-- Get the org ID and use it below:
-- Copy the ID from the organizations table

-- Create admin user (replace ORG_ID with actual UUID)
-- Note: You'll need to create the auth user via Supabase UI first
-- Go to Authentication → Users → Create User
```

## Step 5: Authentication Setup

1. In Supabase go to **Authentication** → **Providers**
2. Email/Password is already enabled (default)
3. Optional: Enable social OAuth providers (Google, GitHub, etc.)

## Step 6: Enable Real-time (Optional)

For real-time features (messaging, notifications):
1. Go to your Supabase project settings
2. Enable **Real-time** for the database

## Step 7: Test Connection

Run:
```bash
npm run dev
```

Try to navigate to:
- `/login` - Should load
- `/admin/dashboard` - Should redirect to login (protected)
- `/client/dashboard` - Should redirect to login (protected)

## Step 8: Create Test Users

Via Supabase UI:
1. Go to **Authentication** → **Users**
2. Click **Create New User**
3. Email: `admin@test.com`, Password: `Test123!`
4. Create second user: `client@test.com`, Password: `Test123!`

Then update their roles in the users table:
- admin@test.com → role: 'admin'
- client@test.com → role: 'client'

## Step 9: Test Portals

1. Login as admin: `admin@test.com`
2. Navigate to: `http://localhost:3006/admin/dashboard`
3. Should see admin portal

Then:
1. Logout
2. Login as client: `client@test.com`
3. Navigate to: `http://localhost:3006/client/dashboard`
4. Should see client portal

## Troubleshooting

**"Invalid login credentials"**
- Make sure user exists in Supabase Authentication
- Check that password is correct

**"Unauthorized access"**
- Check that user role is set correctly in `users` table
- Verify organization_id is set

**"Row level security"**
- If you can't see data, RLS policies may be blocking access
- Check Supabase logs for RLS violations

## Next Steps

1. Configure environment variables for all OAuth providers
2. Set up Stripe integration
3. Create additional layouts for specific pages
4. Add more components and features
