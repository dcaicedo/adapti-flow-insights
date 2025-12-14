import { cn } from '@/lib/utils';
import { getDynamicColorClasses } from '@/utils/dynamicColors';

interface DynamicBadgeProps {
  name: string;
  color: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function DynamicBadge({ name, color, icon, size = 'md', onClick }: DynamicBadgeProps) {
  const colors = getDynamicColorClasses(color);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-all",
        colors.bgLight,
        colors.text,
        sizeClasses[size],
        onClick && "cursor-pointer hover:opacity-80"
      )}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      {name}
    </span>
  );
}
