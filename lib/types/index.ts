// User roles
export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'account_manager'
  | 'content_strategist'
  | 'designer'
  | 'video_editor'
  | 'copywriter'
  | 'client'
  | 'contractor';

export type ContentApprovalStatus =
  | 'draft'
  | 'internal_review'
  | 'client_review'
  | 'revision_requested'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'archived';

export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'x'
  | 'pinterest'
  | 'threads'
  | 'google_business'
  | 'whatsapp';

export type SocialAccountStatus =
  | 'not_connected'
  | 'connected'
  | 'needs_reauthorization'
  | 'token_expired'
  | 'manual_publishing_required'
  | 'api_review_required';

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'trialing'
  | 'paused';

// Database types
export interface Organization {
  id: string;
  name: string;
  email: string;
  website?: string;
  logo_url?: string;
  description?: string;
  industry?: string;
  size?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  subscription_status: SubscriptionStatus;
  subscription_plan?: string;
  subscription_end_date?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  organization_id: string;
  client_id?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  company_size?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  status: 'active' | 'inactive' | 'archived';
  assigned_account_manager_id?: string;
}

export interface IntakeForm {
  id: string;
  client_id: string;
  organization_id: string;
  business_name: string;
  target_audience: string;
  current_challenges: string;
  marketing_goals: string;
  budget_range?: string;
  timeline?: string;
  additional_info?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface BrandBlueprint {
  id: string;
  client_id: string;
  organization_id: string;
  brand_voice?: string;
  target_avatar?: string;
  positioning?: string;
  messaging?: string;
  visual_identity?: string;
  key_differentiators?: string;
  brand_story?: string;
  values?: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ConnectedSocialAccount {
  id: string;
  client_id: string;
  organization_id: string;
  platform: SocialPlatform;
  account_id: string;
  account_name: string;
  account_handle: string;
  status: SocialAccountStatus;
  access_token_encrypted?: string;
  refresh_token_encrypted?: string;
  token_expires_at?: string;
  token_last_refreshed?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ContentPost {
  id: string;
  client_id: string;
  organization_id: string;
  title: string;
  content: string;
  media_urls?: string[];
  platforms: SocialPlatform[];
  approval_status: ContentApprovalStatus;
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approval_comments?: string;
}

export interface Message {
  id: string;
  organization_id: string;
  from_user_id: string;
  to_user_id?: string;
  client_id?: string;
  subject?: string;
  body: string;
  attachment_urls?: string[];
  thread_id?: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
}

export interface Subscription {
  id: string;
  organization_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id?: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
