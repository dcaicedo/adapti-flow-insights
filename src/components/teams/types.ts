import type { Team, MetricsSnapshot, DevOpsSnapshot } from '@/data/demoData';
import type { MemberMetrics } from '@/data/metricsData';

export interface DashboardFilters {
  teamId: string;
  sprintRange: [number, number]; // indices into history
  memberId: string | null; // null = all members
}

export interface DashboardContext {
  team: Team;
  filters: DashboardFilters;
  memberMetrics: MemberMetrics[];
  language: 'en' | 'es';
  onFilterChange: (f: Partial<DashboardFilters>) => void;
}
