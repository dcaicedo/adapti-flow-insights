import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import { getDynamicColorClasses } from '@/utils/dynamicColors';
import type { Dynamic } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { Target, DollarSign } from 'lucide-react';

interface DynamicCardProps {
  dynamic: Dynamic;
  onClick?: () => void;
}

export function DynamicCard({ dynamic, onClick }: DynamicCardProps) {
  const colors = getDynamicColorClasses(dynamic.color);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className={cn("shadow-sm overflow-hidden transition-all hover:shadow-md")}>
        <div className={cn("h-1.5", colors.bg)} />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-xl">{dynamic.icon}</span>
            <span className={colors.text}>{dynamic.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" /> {dynamic.objectiveIds.length} obj
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> ${(dynamic.investment / 1000).toFixed(0)}K
            </span>
          </div>
          <ProgressBar value={dynamic.progress} color={dynamic.color} size="sm" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
