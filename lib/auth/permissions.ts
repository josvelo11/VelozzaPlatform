import { UserRole } from '@/lib/types';

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 90,
  account_manager: 80,
  content_strategist: 70,
  designer: 60,
  video_editor: 55,
  copywriter: 50,
  contractor: 40,
  client: 10,
};

// Role-based access control
export const canAccessPortal = (userRole: UserRole, portal: 'admin' | 'client' | 'team'): boolean => {
  switch (portal) {
    case 'admin':
      return ['super_admin', 'admin', 'account_manager'].includes(userRole);
    case 'team':
      return ['super_admin', 'admin', 'account_manager', 'content_strategist', 'designer', 'video_editor', 'copywriter', 'contractor'].includes(userRole);
    case 'client':
      return userRole === 'client';
    default:
      return false;
  }
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return ['super_admin', 'admin'].includes(userRole);
};

export const canManageClients = (userRole: UserRole): boolean => {
  return ['super_admin', 'admin', 'account_manager'].includes(userRole);
};

export const canManageContent = (userRole: UserRole): boolean => {
  return ['super_admin', 'admin', 'account_manager', 'content_strategist', 'copywriter', 'designer', 'video_editor'].includes(userRole);
};

export const canApproveContent = (userRole: UserRole): boolean => {
  return ['super_admin', 'admin', 'account_manager', 'content_strategist'].includes(userRole);
};

export const canViewAnalytics = (userRole: UserRole): boolean => {
  return ['super_admin', 'admin', 'account_manager', 'client'].includes(userRole);
};

export const canManageBilling = (userRole: UserRole): boolean => {
  return ['super_admin', 'admin'].includes(userRole);
};

export const hasHigherRole = (userRole: UserRole, compareToRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[compareToRole];
};

export const getPermissionLevel = (userRole: UserRole): number => {
  return ROLE_HIERARCHY[userRole] || 0;
};
