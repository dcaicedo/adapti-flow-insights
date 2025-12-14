import { ChevronRight } from 'lucide-react';
import { DynamicBadge } from './DynamicBadge';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  color?: string;
  icon?: string;
  onClick?: () => void;
}

interface TraceabilityBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function TraceabilityBreadcrumb({ items, className }: TraceabilityBreadcrumbProps) {
  return (
    <nav 
      className={cn(
        "flex items-center gap-2 text-sm bg-muted/30 p-3 rounded-lg overflow-x-auto",
        className
      )}
      aria-label="Traceability breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 shrink-0">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          {item.color ? (
            <DynamicBadge
              name={item.label}
              color={item.color}
              icon={item.icon}
              size="sm"
              onClick={item.onClick}
            />
          ) : (
            <span 
              className={cn(
                "text-muted-foreground",
                item.onClick && "cursor-pointer hover:text-foreground transition-colors"
              )}
              onClick={item.onClick}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
