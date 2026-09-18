import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock3,
  CheckCircle2,
  DollarSign,
  Gauge,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  Play,
  Search,
  Settings2,
  Shirt,
  Sparkles,
  Smartphone,
  SlidersHorizontal,
  Star,
  Target,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react';

export type PremiumIconName =
  | 'target'
  | 'social'
  | 'video'
  | 'analytics'
  | 'bolt'
  | 'ai'
  | 'dashboard'
  | 'search'
  | 'services'
  | 'reports'
  | 'settings'
  | 'support'
  | 'package'
  | 'users'
  | 'revenue'
  | 'performance'
  | 'chevron-left'
  | 'chevron-right'
  | 'logout'
  | 'user'
  | 'check'
  | 'clock'
  | 'star'
  | 'camera'
  | 'play'
  | 'down'
  | 'arrow-right'
  | 'sparkles'
  | 'instagram'
  | 'chat'
  | 'shirt'
  | 'close';

const iconMap: Record<PremiumIconName, LucideIcon> = {
  target: Target,
  social: Smartphone,
  video: Clapperboard,
  analytics: BarChart3,
  bolt: Zap,
  ai: Bot,
  dashboard: LayoutDashboard,
  search: Search,
  services: SlidersHorizontal,
  reports: BarChart3,
  settings: Settings2,
  support: MessageCircle,
  package: Package,
  users: Users,
  revenue: DollarSign,
  performance: Gauge,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  logout: LogOut,
  user: UserRound,
  check: CheckCircle2,
  clock: Clock3,
  star: Star,
  camera: Camera,
  play: Play,
  down: ChevronDown,
  'arrow-right': ArrowRight,
  sparkles: Sparkles,
  instagram: Camera,
  chat: MessageCircle,
  shirt: Shirt,
  close: X,
};

interface PremiumIconProps {
  name: PremiumIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export function PremiumIcon({ name, size = 20, strokeWidth = 1.8, className, style }: PremiumIconProps) {
  const Icon = iconMap[name];

  return <Icon aria-hidden="true" size={size} strokeWidth={strokeWidth} className={className} style={style} />;
}