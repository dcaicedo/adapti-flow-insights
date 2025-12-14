import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert } from '@/data/demoData';

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

export function AlertCard({ alert, onClick }: AlertCardProps) {
  const { language } = useLanguage();
  const message = language === 'es' ? alert.messageEs : alert.message;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg cursor-pointer transition-all hover:shadow-md",
        alert.type === 'critical' 
          ? 'bg-status-critical-bg border border-status-critical/20' 
          : 'bg-status-warning-bg border border-status-warning/20'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-1.5 rounded-full",
          alert.type === 'critical' ? 'bg-status-critical/10' : 'bg-status-warning/10'
        )}>
          {alert.type === 'critical' ? (
            <AlertCircle className="h-4 w-4 text-status-critical" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-status-warning" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium mb-1",
            alert.type === 'critical' ? 'text-status-critical' : 'text-status-warning'
          )}>
            {alert.type === 'critical' ? 'Critical' : 'Warning'}
          </p>
          <p className="text-sm text-foreground line-clamp-2">{message}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
    </motion.div>
  );
}