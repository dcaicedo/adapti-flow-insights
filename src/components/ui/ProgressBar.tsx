import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = 'primary',
  showLabel = true,
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses: Record<string, string> = {
    'primary': 'bg-primary',
    'adaptativa-blue': 'bg-adaptativa-blue',
    'adaptativa-blue-light': 'bg-adaptativa-blue-light',
    'culture-yellow': 'bg-culture-yellow',
    'culture-yellow-light': 'bg-culture-yellow-light',
    'business-blue': 'bg-business-blue',
    'business-blue-light': 'bg-business-blue-light',
    'structure-magenta': 'bg-structure-magenta',
    'structure-magenta-light': 'bg-structure-magenta-light',
    'entrepreneurship-green': 'bg-entrepreneurship-green',
    'entrepreneurship-green-light': 'bg-entrepreneurship-green-light',
    'status-success': 'bg-status-success',
    'status-warning': 'bg-status-warning',
    'status-critical': 'bg-status-critical',
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={cn("flex-1 rounded-full bg-muted overflow-hidden", heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn("h-full rounded-full", colorClasses[color] || 'bg-primary')}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground w-10 text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}