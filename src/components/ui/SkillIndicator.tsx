import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkillIndicatorProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function SkillIndicator({ value, size = 'md', showValue = true }: SkillIndicatorProps) {
  const getColor = (val: number) => {
    if (val <= 2) return 'bg-status-critical';
    if (val <= 3) return 'bg-status-warning';
    return 'bg-status-success';
  };

  const sizes = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  };

  const dots = Array.from({ length: 5 }, (_, i) => i + 1);

  if (!showValue) {
    return (
      <div className="flex gap-1">
        {dots.map((dot) => (
          <motion.div
            key={dot}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: dot * 0.05 }}
            className={cn(
              "w-2 h-2 rounded-full",
              dot <= value ? getColor(value) : 'bg-muted'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-card",
        sizes[size],
        getColor(value)
      )}
    >
      {value}
    </motion.div>
  );
}