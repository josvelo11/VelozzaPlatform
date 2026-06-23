# VELOZZA PLATFORM - ARCHITECTURE DOCUMENTATION

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                     │
│  (Marketing Site + SaaS Portals + API Routes)               │
└────────────┬────────────────────────────────────┬────────────┘
             │                                    │
             v                                    v
    ┌────────────────┐                 ┌──────────────────┐
    │  Supabase Auth │                 │  Supabase DB     │
    │  (JWT/Session) │                 │  (PostgreSQL)    │
    └────────────────┘                 └──────────────────┘
             │                                    │
             └────────────┬─────────────────────┘
                          v
                  ┌───────────────────┐
                  │  RLS Policies     │
                  │  (Row-Level Sec)  │
                  └───────────────────┘
```

## Directory Architecture

### `app/` - Page Routes
- **`(public)/`** - Marketing content (public routes)
  - `page.tsx` (home)
  - `servicios/` (services)
  - `blog/` (blog posts)
  - All inherit global layout

- **`(auth)/`** - Authentication flows (public but auth-specific)
  - `login/page.tsx`
  - `register/page.tsx`
  - `forgot-password/page.tsx`

- **`(protected)/`** - Multi-tenant portals (requires auth)
  - `admin/` - Admin portal (super_admin, admin, account_manager)
    - `dashboard/page.tsx`
    - `clients/` (client management)
    - `team/` (team management)
    - `content/` (approval queue)
    - `billing/` (subscriptions)
  
  - `client/` - Client portal (client role only)
    - `dashboard/page.tsx`
    - `brand-blueprint/` (intake form)
    - `content/` (approvals)
    - `analytics/` (view only)
    - `messages/` (communications)
  
  - `team/` - Team portal (all non-client roles)
    - `dashboard/page.tsx`
    - `tasks/` (work queue)
    - `content/` (creation interface)
    - `calendar/` (scheduling)

- **`api/`** - API routes for backend logic
  - `auth/` - Auth webhook handlers
  - `webhooks/` - Stripe, social media callbacks
  - `cron/` - Scheduled jobs (Next.js jobs)

### `components/` - Reusable UI
- **`ui/`** - Base components (atomic design)
  - `Button.tsx`
  - `Input.tsx`
  - `Card.tsx`
  - `Modal.tsx`
  - `Table.tsx`

- **`layouts/`** - Page layout wrappers
  - `ProtectedLayout.tsx` - Sidebar + auth check
  - `PublicLayout.tsx` - Public page layout

- **`dashboard/`** - Portal-specific components
  - `AdminDashboard.tsx`
  - `ClientDashboard.tsx`
  - `TeamDashboard.tsx`

- **`forms/`** - Complex forms
  - `IntakeForm.tsx`
  - `BrandBlueprintForm.tsx`
  - `ContentApprovalForm.tsx`

- **`seo/`** - Existing SEO components
  - Schema.json components
  - Meta tags
  - Structured data

### `lib/` - Utility Code
- **`types/index.ts`** - All TypeScript interfaces
  - User roles (9 types)
  - Entity interfaces (Client, IntakeForm, etc.)
  - Status enums (ContentApprovalStatus, etc.)

- **`auth/`** - Authentication utilities
  - `server.ts` - Server-side helpers
    - `getSession()` - Get current user session
    - `requireAuth(role?)` - Protect server components
    - `getUserWithProfile()` - Get user + database profile
    - `getOrganization()` - Get current org
  - `permissions.ts` - Role-based access control
    - `canAccessPortal(role, portal)` - Portal access
    - `canManageContent(role)` - Content permissions
    - `canApproveContent(role)` - Approval permissions
    - Permission hierarchy

- **`db/`** - Database helpers (planned)
  - `clients.ts` - Client CRUD operations
  - `users.ts` - User management
  - `content.ts` - Content queries
  - Query builders with org_id filtering

- **`validations/`** - Input validation schemas (planned)
  - `auth.ts` - Email/password validation
  - `client.ts` - Client form validation
  - `content.ts` - Content validation
  - Uses Zod for runtime validation

- **`seo/`** - Existing SEO utilities
  - Schema generation
  - Meta helpers

### `styles/` - Global Styling
- `globals.css` - CSS variables (dark/gold theme)
  - `--bg: #0b0b0b` (background)
  - `--accent: #f4cf63` (gold)
  - `--surface: rgba(18,18,18,0.92)` (cards)
  - Utility classes (.hero-shell, .glass-card, etc.)

### `supabase/` - Database
- `migrations/001_initial_schema.sql`
  - 11 tables with foreign keys
  - 13 performance indexes
  - 8 Row-Level Security policies
  - UUID primary keys throughout

### `docs/` - Documentation
- API reference
- Database schema diagrams
- Deployment guides

## Database Architecture

### Tables (11 Total)

```sql
organizations          -- Tenants (one per company)
├── id (UUID PK)
├── name, email
├── subscription_status (enum)
├── created_by (FK → users.id)

users                 -- Team members
├── id (UUID PK)
├── email, full_name
├── role (enum: 9 roles)
├── organization_id (FK)

clients               -- End customers
├── id (UUID PK)
├── organization_id (FK)
├── name, email, phone
├── status (active/inactive/paused)

intake_forms          -- Client onboarding
├── id (UUID PK)
├── client_id (FK)
├── status (draft/submitted/approved)
├── data (JSON)

brand_blueprints      -- Client brand guidelines
├── id (UUID PK)
├── client_id (FK)
├── logo_url, colors
├── voice_guidelines (JSON)

connected_social_accounts  -- OAuth integrations
├── id (UUID PK)
├── user_id (FK)
├── platform (enum)
├── token_encrypted (E2E)
├── status (active/expired)

content_posts         -- Social media content
├── id (UUID PK)
├── client_id (FK)
├── status (draft/pending_approval/approved/published)
├── platforms (JSON array)

messages              -- Internal communications
├── id (UUID PK)
├── sender_id (FK)
├── thread_id
├── body
├── attachments (JSON)

subscriptions         -- Billing
├── id (UUID PK)
├── organization_id (FK)
├── plan_id
├── status (active/canceled/paused)
├── stripe_subscription_id

invoices              -- Payments
├── id (UUID PK)
├── organization_id (FK)
├── amount, currency
├── status (draft/sent/paid/overdue)
├── stripe_invoice_id

audit_logs            -- Compliance
├── id (UUID PK)
├── organization_id (FK)
├── user_id (FK)
├── action
├── changed_data (JSON)
├── timestamp
```

### Row-Level Security (RLS)

**Eight Policies Enforce:**

1. **Super Admin** - See all data across all orgs
2. **Org Admin** - See all data in their organization only
3. **Team Members** - See org data + assigned clients only
4. **Clients** - See only their own data
5. **Audit Logs** - Only super admin can view
6. **Social Accounts** - Only owner or org admin can access
7. **Messages** - Only participants or org admin can view
8. **Subscriptions** - Only org members can view their org's subscription

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Visits App                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           v
                  ┌─────────────────┐
                  │  Middleware.ts  │
                  │  (check session)│
                  └────────┬─────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
             PUBLIC              PROTECTED
                │                     │
                v                     v
         ┌────────────┐         ┌─────────────┐
         │ Page shows │         │  Session?   │
         │ normally   │         └────┬────────┘
         └────────────┘              │
                              ┌──────┴──────┐
                           YES│            │NO
                              │            v
                              │   ┌─────────────────┐
                              │   │Redirect to login│
                              │   └─────────────────┘
                              │
                              v
                       ┌──────────────┐
                       │ Get user role│
                       │ from database│
                       └──────┬───────┘
                              │
                       ┌──────┴──────────┐
                       │                 │
                    Admin           Not Admin
                       │                 │
                       v                 v
              ┌─────────────────┐  ┌─────────────┐
              │Can access admin?│  │Redirect to  │
              └────┬────────────┘  │appropriate  │
                   │               │portal/error │
              YES  │  NO           └─────────────┘
                   │  │
                   │  v
                   │  401
                   │
                   v
            ┌────────────────┐
            │Show admin page │
            │with data       │
            └────────────────┘
```

## Multi-Tenancy Architecture

**Key Principle**: All queries MUST be filtered by `organization_id`

### Tenant Isolation Strategy

1. **Database Level** (RLS Policies)
   - Every SELECT, UPDATE, DELETE checks organization_id
   - Super admin bypasses org check
   - Cannot see other org's data even with direct SQL

2. **Application Level**
   - `requireAuth()` gets user's org_id
   - All queries filtered by that org_id
   - Sidebar shows only org's clients/team

3. **Session Level**
   - JWT token contains user_id
   - Server looks up org_id from database
   - Passed to all queries

### Example Tenant-Safe Query
```typescript
const { data: clients } = await supabase
  .from('clients')
  .select('*')
  .eq('organization_id', userOrgId)  // ← CRITICAL
  .eq('status', 'active');
```

## Deployment Architecture

```
┌──────────────────────────┐
│  Vercel (Next.js Hosting)│
│  - App Router            │
│  - API Routes            │
│  - Edge Middleware       │
│  - Serverless Functions  │
└───────────┬──────────────┘
            │
            v
┌──────────────────────────┐
│ Supabase (Backend)       │
│ - PostgreSQL Database    │
│ - JWT Auth               │
│ - RLS Engine             │
│ - Real-time Socket       │
└───────────┬──────────────┘
            │
     ┌──────┴──────┐
     v             v
┌──────────┐ ┌──────────┐
│ Stripe   │ │OAuth2    │
│(Payments)│ │(Social)  │
└──────────┘ └──────────┘
```

## Security Practices

### Authentication
- ✅ JWT tokens (Supabase)
- ✅ HTTPOnly cookies (automatic)
- ✅ CSRF protection (Next.js)

### Data Protection
- ✅ RLS at database level
- ✅ Organization isolation enforced
- ✅ Role-based access control
- ✅ Audit logging on changes
- ✅ Encrypted social tokens (planned)

### API Security
- ⚠️ Rate limiting (planned)
- ⚠️ Input validation (planned)
- ✅ Type-safe queries
- ✅ No SQL injection (Supabase client)

## Error Handling

### Database Errors
```typescript
try {
  const data = await supabase.from('table').select();
} catch (error) {
  if (error.code === '42P01') console.error('Table not found');
  if (error.code === '42501') console.error('RLS policy violation');
}
```

### Auth Errors
```typescript
if (!session) redirect('/login');
if (!hasPermission) redirect('/unauthorized');
```

### API Errors
```typescript
return NextResponse.json(
  { error: 'Unauthorized' },
  { status: 401 }
);
```

## Performance Optimizations

1. **Database Indexing**
   - 13 indexes on frequently queried columns
   - Composite indexes for common filters
   - organization_id indexed everywhere

2. **Query Optimization**
   - Supabase realtime disabled by default
   - Enable only on specific tables
   - Pagination on large datasets

3. **Caching**
   - User role cached in session
   - Organization data cached
   - Content approval counts cached

4. **Code Splitting**
   - Each portal is separate route bundle
   - Components lazy-loaded
   - UI components shared across portals

## Feature Flags Architecture (Planned)

```typescript
interface FeatureFlags {
  enableSocialMediaIntegration: boolean;
  enableAIInsights: boolean;
  enableAnalyticsDashboard: boolean;
  enableBillingPortal: boolean;
}

// Stored in database with org-level granularity
const flags = await getFeatureFlags(organizationId);
```

## Monitoring & Logging

### Server-Side
- Error logging to console (development)
- Structured logging to logs service (production)
- Audit log in database

### Client-Side
- Browser console errors
- Sentry integration (planned)
- User analytics (Google Analytics ready)

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 | Full-stack, serverless ready, great DX |
| Auth | Supabase | Built-in RLS, PostgreSQL, real-time |
| Database | PostgreSQL | ACID compliance, JSON support, RLS policies |
| ORM | Supabase Client | No query builder needed, type-safe |
| Styling | Tailwind + CSS Vars | Dark mode, consistent theming |
| Hosting | Vercel | Native Next.js support, automatic scaling |
| Payments | Stripe | Industry standard, webhooks, subscriptions |

## Future Considerations

1. **Caching Layer** - Redis for session/org data
2. **Message Queue** - Bull/BullMQ for async jobs
3. **File Storage** - S3-compatible for media
4. **Search** - Elasticsearch for content search
5. **Real-time** - Supabase Realtime for collaboration
6. **GraphQL** - Consider as alternative API layer
7. **Microservices** - If org count exceeds 100K
