import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dynamic } from '@/data/demoData';
import { ChevronRight } from 'lucide-react';

interface DynamicCardProps {
  dynamic: Dynamic;
  onClick?: () => void;
}

export function DynamicCard({ dynamic, onClick }: DynamicCardProps) {
  const { language, t } = useLanguage();
  const name = language === 'es' ? dynamic.nameEs : dynamic.name;

  const colorBorders: Record<string, string> = {
    'adaptativa-blue': 'border-l-adaptativa-blue',
    'culture-yellow': 'border-l-culture-yellow',
    'business-cyan': 'border-l-business-cyan',
    'structure-neutral': 'border-l-structure-neutral',
    'entrepreneurship-green': 'border-l-entrepreneurship-green',
  };

  const colorBgs: Record<string, string> = {
    'adaptativa-blue': 'bg-adaptativa-blue/10',
    'culture-yellow': 'bg-culture-yellow/10',
    'business-cyan': 'bg-business-cyan/10',
    'structure-neutral': 'bg-structure-neutral/10',
    'entrepreneurship-green': 'bg-entrepreneurship-green/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "bg-card rounded-lg p-5 shadow-sm border border-border cursor-pointer transition-all",
        "border-l-4",
        colorBorders[dynamic.color]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={cn(
            "inline-flex px-2 py-1 rounded text-xs font-medium mb-2",
            colorBgs[dynamic.color]
          )}>
            {name}
          </div>
          <p className="text-sm text-muted-foreground">
            {dynamic.objectives.length} {t('dynamics.objectives')}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{t('dynamics.progress')}</span>
            <span className="font-medium">{dynamic.progress}%</span>
          </div>
          <ProgressBar value={dynamic.progress} color={dynamic.color} showLabel={false} />
        </div>

        <div className="flex justify-between text-sm pt-2 border-t border-border">
          <span className="text-muted-foreground">{t('dynamics.investment')}</span>
          <span className="font-semibold">${dynamic.investment.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}