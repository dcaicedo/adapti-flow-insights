import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, DollarSign, Users, Sparkles, ArrowRight, ExternalLink, Wallet, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import { SkillIndicator } from './SkillIndicator';
import { DynamicBadge } from './DynamicBadge';
import { Button } from './button';
import type { KeyResult, Dynamic, Team, Skill } from '@/data/demoData';

interface KRCardProps {
  keyResult: KeyResult;
  dynamic?: Dynamic | null;
  teams?: (Team | undefined)[];
  skills?: (Skill | undefined)[];
  language: 'en' | 'es';
  inheritedColor: string;
  isExpanded?: boolean;
  isHighlighted?: boolean;
  onToggle?: () => void;
  onTeamClick?: (teamId: string) => void;
}

export function KRCard({
  keyResult,
  dynamic,
  teams = [],
  skills = [],
  language,
  inheritedColor,
  isExpanded = false,
  isHighlighted = false,
  onToggle,
  onTeamClick,
}: KRCardProps) {
  const validTeams = teams.filter(Boolean) as Team[];
  const validSkills = skills.filter(Boolean) as Skill[];
  
  const budgetUsed = keyResult.investment;
  const totalBudget = keyResult.budget;
  const budgetRemaining = totalBudget - budgetUsed;
  const budgetUsedPercent = Math.round((budgetUsed / totalBudget) * 100);

  return (
    <div 
      className={cn(
        "rounded-lg border border-border overflow-hidden transition-all",
        isHighlighted && "ring-2 ring-primary shadow-md"
      )}
    >
      {/* Header - Always visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {dynamic && (
                <DynamicBadge
                  name={language === 'es' ? dynamic.nameEs : dynamic.name}
                  color={dynamic.color}
                  icon={dynamic.icon}
                  size="sm"
                />
              )}
              <StatusBadge status={keyResult.status} size="sm" />
            </div>
            <p className="text-sm font-medium">
              {language === 'es' ? keyResult.titleEs : keyResult.title}
            </p>
            <div className="mt-3">
              <ProgressBar 
                value={keyResult.progress} 
                color={inheritedColor} 
                size="sm" 
                showLabel 
              />
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-4 border-t border-border bg-muted/10">
              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {language === 'es' ? keyResult.descriptionEs : keyResult.description}
              </p>

              {/* Budget Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Presupuesto Total' : 'Total Budget'}
                    </p>
                    <p className="text-sm font-semibold">${totalBudget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-destructive/10">
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Utilizado' : 'Used'} ({budgetUsedPercent}%)
                    </p>
                    <p className="text-sm font-semibold">${budgetUsed.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-full",
                    budgetRemaining > 0 ? "bg-green-500/10" : "bg-destructive/10"
                  )}>
                    <DollarSign className={cn(
                      "h-4 w-4",
                      budgetRemaining > 0 ? "text-green-500" : "text-destructive"
                    )} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Pendiente' : 'Remaining'}
                    </p>
                    <p className={cn(
                      "text-sm font-semibold",
                      budgetRemaining > 0 ? "text-green-600" : "text-destructive"
                    )}>
                      ${budgetRemaining.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teams Section */}
              {validTeams.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {language === 'es' ? 'Equipos Responsables' : 'Responsible Teams'}
                    </div>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {validTeams.length} {language === 'es' ? 'equipos' : 'teams'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {validTeams.map((team) => (
                      <Button
                        key={team.id}
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTeamClick?.(team.id);
                        }}
                        className="h-8 gap-1.5 hover:bg-primary/10 hover:border-primary"
                      >
                        <span className="text-base">{team.icon}</span>
                        <span>{language === 'es' ? team.nameEs : team.name}</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {validSkills.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Sparkles className="h-3 w-3" />
                    {language === 'es' ? 'Habilidades' : 'Skills'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {validSkills.map(skill => (
                      <div 
                        key={skill.id} 
                        className="flex items-center gap-2 px-2 py-1 bg-background rounded border border-border"
                      >
                        <span className="text-xs font-medium">
                          {language === 'es' ? skill.nameEs : skill.name}
                        </span>
                        <SkillIndicator value={skill.initialValue} size="sm" />
                        <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                        <SkillIndicator value={skill.currentValue} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}