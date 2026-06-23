import { createClient } from '@supabase/supabase-js';
import { PortalModuleData, PortalRecord, PortalType } from '@/types/portal';

function mapRowsToRecords(rows: any[], slug: string): PortalRecord[] {
  return rows.slice(0, 8).map((row, index) => ({
    id: String(row.id ?? `${slug}-${index + 1}`),
    title: String(row.title ?? row.name ?? row.subject ?? `Item ${index + 1}`),
    owner: String(row.owner ?? row.assignee ?? row.created_by ?? 'System'),
    status: (row.status ?? 'pending') as PortalRecord['status'],
    dueDate: row.due_date ? String(row.due_date).slice(0, 10) : undefined,
    priority: (row.priority ?? 'medium') as PortalRecord['priority'],
  }));
}

function tableCandidates(portal: PortalType, slug: string) {
  const common = ['activity_logs', 'updates', 'messages'];
  const bySlug: Record<string, string[]> = {
    clients: ['clients', 'projects'],
    'advertising-accounts': ['connected_social_accounts', 'clients', 'projects'],
    team: ['users', 'tasks'],
    tasks: ['tasks'],
    content: ['content_posts'],
    'content-approvals': ['content_approvals', 'content_posts'],
    reports: ['reports', 'analytics_snapshots'],
    billing: ['invoices', 'subscriptions'],
    calendar: ['content_calendar', 'tasks'],
    analytics: ['analytics_snapshots', 'reports'],
    assets: ['assets', 'files'],
    messages: ['messages', 'conversations'],
    'social-accounts': ['connected_social_accounts'],
    'social-crm': ['messages', 'conversations', 'clients', 'activity_logs'],
    'publication-planner': ['content_calendar', 'content_posts', 'tasks'],
    packages: ['packages'],
    'intake-review': ['intake_forms'],
    intake: ['intake_forms'],
    'brand-blueprint': ['brand_blueprints'],
    'brand-blueprints': ['brand_blueprints'],
    settings: ['settings'],
    'audit-logs': ['audit_logs'],
  };

  const portalTables = portal === 'team' ? ['tasks', 'content_posts'] : portal === 'client' ? ['projects', 'content_posts'] : ['clients', 'invoices'];

  return [...(bySlug[slug] || []), ...portalTables, ...common];
}

export async function hydrateModuleFromSupabase(portal: PortalType, moduleData: PortalModuleData) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return moduleData;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const candidates = tableCandidates(portal, moduleData.slug);

  for (const table of candidates) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(8);
      if (!error && data && data.length > 0) {
        const records = mapRowsToRecords(data, moduleData.slug);
        return {
          ...moduleData,
          subtitle: `${moduleData.subtitle} Fuente: ${table}.`,
          records,
        };
      }
    } catch {
      // Ignore and continue with fallback strategy.
    }
  }

  return moduleData;
}
