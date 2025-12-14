import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatusBadgeProps {
  status: 'on-track' | 'attention' | 'critical';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { t } = useLanguage();
  
  const labels = {
    'on-track': t('objectives.onTrack'),
    'attention': t('objectives.attention'),
    'critical': t('objectives.critical'),
  };

  const styles = {
    'on-track': 'bg-status-success-bg text-status-success',
    'attention': 'bg-status-warning-bg text-status-warning',
    'critical': 'bg-status-critical-bg text-status-critical',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        styles[status],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span className={cn(
        "rounded-full",
        status === 'on-track' && 'bg-status-success',
        status === 'attention' && 'bg-status-warning',
        status === 'critical' && 'bg-status-critical',
        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
      )} />
      {labels[status]}
    </span>
  );
}