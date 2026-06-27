export type PortalType = 'admin' | 'client' | 'team';

export type ModuleStatus =
  | 'active'
  | 'pending'
  | 'review'
  | 'scheduled'
  | 'blocked'
  | 'completed'
  | 'draft'
  | 'archived';

export interface PortalMetric {
  label: string;
  value: string;
  trend?: string;
}

export interface PortalRecord {
  id: string;
  title: string;
  owner: string;
  status: ModuleStatus;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface WorkflowStage {
  label: string;
  status: ModuleStatus;
  count: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  owner?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'delivery' | 'approval' | 'note';
}

export interface QuickAction {
  label: string;
  hint: string;
}

export interface PortalModuleData {
  slug: string;
  title: string;
  subtitle: string;
  variant?: 'dashboard' | 'client' | 'crm' | 'calendar' | 'content' | 'ops';
  metrics: PortalMetric[];
  records: PortalRecord[];
  primaryAction: string;
  secondaryAction: string;
  workflow: WorkflowStage[];
  checklist: ChecklistItem[];
  timeline: TimelineEvent[];
  quickActions: QuickAction[];
}
