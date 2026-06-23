-- VELOZZA PLATFORM DATABASE SCHEMA
-- Multi-tenant SaaS with Row Level Security

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== ORGANIZATIONS =====
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  industry TEXT,
  size TEXT,
  subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trialing', 'paused')),
  subscription_plan TEXT,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- ===== USERS (Extends Supabase Auth) =====
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'account_manager', 'content_strategist', 'designer', 'video_editor', 'copywriter', 'client', 'contractor')),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- ===== CLIENTS =====
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  industry TEXT,
  company_size TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  assigned_account_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

-- ===== INTAKE FORMS =====
CREATE TABLE intake_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  target_audience TEXT,
  current_challenges TEXT,
  marketing_goals TEXT,
  budget_range TEXT,
  timeline TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

-- ===== BRAND BLUEPRINTS =====
CREATE TABLE brand_blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  brand_voice TEXT,
  target_avatar TEXT,
  positioning TEXT,
  messaging TEXT,
  visual_identity TEXT,
  key_differentiators TEXT,
  brand_story TEXT,
  values TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL
);

-- ===== CONNECTED SOCIAL ACCOUNTS =====
CREATE TABLE connected_social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'x', 'pinterest', 'threads', 'google_business', 'whatsapp')),
  account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_handle TEXT,
  status TEXT DEFAULT 'not_connected' CHECK (status IN ('not_connected', 'connected', 'needs_reauthorization', 'token_expired', 'manual_publishing_required', 'api_review_required')),
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  token_last_refreshed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(client_id, platform, account_id)
);

-- ===== CONTENT POSTS =====
CREATE TABLE content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  platforms TEXT[] NOT NULL,
  approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'internal_review', 'client_review', 'revision_requested', 'approved', 'scheduled', 'published', 'failed', 'archived')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approval_comments TEXT
);

-- ===== MESSAGES =====
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  subject TEXT,
  body TEXT NOT NULL,
  attachment_urls TEXT[],
  thread_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== SUBSCRIPTIONS =====
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'trialing' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'paused')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INVOICES =====
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== AUDIT LOGS =====
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_clients_organization ON clients(organization_id);
CREATE INDEX idx_clients_account_manager ON clients(assigned_account_manager_id);
CREATE INDEX idx_intake_forms_client ON intake_forms(client_id);
CREATE INDEX idx_intake_forms_organization ON intake_forms(organization_id);
CREATE INDEX idx_brand_blueprints_client ON brand_blueprints(client_id);
CREATE INDEX idx_social_accounts_client ON connected_social_accounts(client_id);
CREATE INDEX idx_social_accounts_platform ON connected_social_accounts(platform);
CREATE INDEX idx_content_posts_client ON content_posts(client_id);
CREATE INDEX idx_content_posts_status ON content_posts(approval_status);
CREATE INDEX idx_content_posts_scheduled ON content_posts(scheduled_for);
CREATE INDEX idx_messages_organization ON messages(organization_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_timestamp ON messages(created_at DESC);
CREATE INDEX idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at DESC);

-- ===== ROW LEVEL SECURITY (RLS) =====

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations: Super admins see all, others see only their own
CREATE POLICY organizations_super_admin ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY organizations_own ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.organization_id = organizations.id
    )
  );

-- Users: See own profile and team members in same org
CREATE POLICY users_view_own ON users FOR SELECT
  USING (
    id = auth.uid() OR
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY users_update_own ON users FOR UPDATE
  USING (id = auth.uid());

-- Clients: Team members see clients in their org, clients see own data
CREATE POLICY clients_team_view ON clients FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) != 'client'
  );

CREATE POLICY clients_own_view ON clients FOR SELECT
  USING (
    id = (SELECT client_id FROM users WHERE id = auth.uid())
  );

-- Content Posts: Clients see own, team members see clients' in their org
CREATE POLICY content_posts_team ON content_posts FOR ALL
  USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) != 'client'
  );

CREATE POLICY content_posts_client ON content_posts FOR SELECT
  USING (
    client_id = (SELECT client_id FROM users WHERE id = auth.uid())
  );

-- Messages: See messages in own org or direct messages
CREATE POLICY messages_org ON messages FOR SELECT
  USING (
    (from_user_id = auth.uid() OR to_user_id = auth.uid() OR 
     (client_id IS NOT NULL AND client_id = (SELECT client_id FROM users WHERE id = auth.uid())) OR
     organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()))
  );

CREATE POLICY messages_insert ON messages FOR INSERT
  WITH CHECK (from_user_id = auth.uid());

-- Audit Logs: See logs for own org (team only)
CREATE POLICY audit_logs_org ON audit_logs FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin', 'account_manager')
  );
