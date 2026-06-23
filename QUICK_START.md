# VELOZZA PLATFORM - QUICK START GUIDE

Welcome! This is your enterprise creative management SaaS platform. Follow these steps to get it running locally in 15 minutes.

## 📋 Prerequisites

- **Node.js 18+** - Download from nodejs.org
- **Supabase Account** - Free at supabase.com
- **npm** or **yarn** package manager

## 🚀 Step 1: Initial Setup (2 minutes)

```bash
# Clone or open the project
cd VelozzaPlatform

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

## 🔑 Step 2: Supabase Configuration (5 minutes)

### 2.1 Create Supabase Project
1. Go to https://supabase.com and create an account
2. Click "New Project"
3. Fill in project name: "velozza-dev"
4. Create database with password: `YourSecurePassword123!`
5. Wait for project to spin up (~2 minutes)

### 2.2 Get API Keys
1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 Paste in `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## 🗄️ Step 3: Create Database Schema (2 minutes)

1. In Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Open file: `supabase/migrations/001_initial_schema.sql`
4. Copy ALL content
5. Paste into Supabase SQL editor
6. Click "Run"
7. Wait for green checkmark ✓

## 🔐 Step 4: Create Test Users (3 minutes)

1. In Supabase, go to **Authentication** → **Users**
2. Click "Create New User"
3. Create TWO users:

**User 1 (Admin)**
- Email: `admin@test.com`
- Password: `Test123456!`

**User 2 (Client)**
- Email: `client@test.com`
- Password: `Test123456!`

### 4.1 Set User Roles
1. Go to **Table Editor** → `users` table
2. For `admin@test.com` row:
   - Set `role` = `admin`
   - Set `organization_id` = (copy from any row or leave empty for now)
3. For `client@test.com` row:
   - Set `role` = `client`
   - Set `organization_id` = (same as above)

## ▶️ Step 5: Start Development Server (1 minute)

```bash
# Start the development server
npm run dev

# Open in browser
# http://localhost:3000
```

## 🔓 Step 6: Test Login (2 minutes)

1. Navigate to: `http://localhost:3000/login`
2. Login with admin credentials:
   - Email: `admin@test.com`
   - Password: `Test123456!`
3. You should see Admin Dashboard at `/admin/dashboard`

### 6.1 Test Client Portal
1. Logout (click Logout button in sidebar)
2. Login with client credentials:
   - Email: `client@test.com`
   - Password: `Test123456!`
3. You should see Client Dashboard at `/client/dashboard`

## ✅ What You Have Now

- ✅ Production-ready Next.js 15 app
- ✅ Supabase backend with 11 tables
- ✅ Authentication system (login, register, logout)
- ✅ Three portals (Admin, Client, Team)
- ✅ Role-based access control (9 roles)
- ✅ Row-level security enabled
- ✅ Dark/gold design system
- ✅ Protected routes with middleware

## 📱 Available Portals

**Admin Portal** - `/admin/dashboard`
- Client management
- Team management
- Content approval
- Billing
- Audit logs

**Client Portal** - `/client/dashboard`
- Brand blueprint builder
- Content approval
- Analytics
- Messages

**Team Portal** - `/team/dashboard`
- Task management
- Content creation
- Client assignments
- Calendar

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 📚 Navigation

- **Marketing site**: `/` (home, servicios, blog, etc.)
- **Login**: `/login`
- **Register**: `/register`
- **Admin portal**: `/admin/dashboard`
- **Client portal**: `/client/dashboard`
- **Team portal**: `/team/dashboard`

## 🐛 Troubleshooting

### "Page not found"
- Make sure you're logged in
- Check the URL is correct
- Clear browser cache

### "Invalid login credentials"
- Make sure email exists in Supabase Users
- Check password is exactly correct
- Look at browser console for errors

### "Unauthorized access"
- Check user role is set in Supabase `users` table
- Make sure `organization_id` is not empty
- Try logging out and back in

### "Database error"
- Verify all migrations ran in Supabase
- Check SQL Editor for any errors
- Verify `.env.local` has correct keys

## 🚀 Next Steps

1. **Customize branding**: Edit `styles/globals.css` variables
2. **Add more content**: Create pages in `app/(protected)/admin/`
3. **Build features**: Check `PLATFORM_BUILD_STATUS.md` for feature list
4. **Deploy**: Follow deployment guide in README.md

## 📖 Documentation

- `PLATFORM_BUILD_STATUS.md` - Full feature roadmap
- `SUPABASE_SETUP.md` - Detailed database setup
- `README.md` - Project overview
- `docs/` - Additional documentation

## 💡 Pro Tips

- Use Supabase local development: `supabase start`
- Enable Supabase real-time for messages
- Use TypeScript for type safety
- Check browser DevTools for errors
- Read component comments for implementation hints

## 🎯 Success Indicators

You're set up correctly when:
- ✅ Visiting `/login` shows the login page
- ✅ Logging in with admin@test.com redirects to `/admin/dashboard`
- ✅ Admin dashboard displays without errors
- ✅ Sidebar navigation appears
- ✅ Logout button works
- ✅ Cannot access `/admin` with client account

---

**Questions?** Check the error message in the browser console or look at the server logs in the terminal.

**Ready to build?** Start with Phase 2 features in `PLATFORM_BUILD_STATUS.md`.
