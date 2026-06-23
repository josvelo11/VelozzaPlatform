import { ModuleStatus } from '@/types/portal';

export function getStatusStyle(status: ModuleStatus) {
  switch (status) {
    case 'active':
      return { bg: 'rgba(42,173,85,0.16)', color: '#58d68d' };
    case 'pending':
      return { bg: 'rgba(241,196,15,0.16)', color: '#f4cf63' };
    case 'review':
      return { bg: 'rgba(52,152,219,0.16)', color: '#5dade2' };
    case 'scheduled':
      return { bg: 'rgba(155,89,182,0.16)', color: '#c39bd3' };
    case 'blocked':
      return { bg: 'rgba(231,76,60,0.16)', color: '#ff6b6b' };
    case 'completed':
      return { bg: 'rgba(46,204,113,0.16)', color: '#7dffb3' };
    case 'archived':
      return { bg: 'rgba(127,140,141,0.16)', color: '#bdc3c7' };
    default:
      return { bg: 'rgba(149,165,166,0.16)', color: '#d5dbdb' };
  }
}
