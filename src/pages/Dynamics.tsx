import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { dynamics, objectives, organizationInfo } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getDynamicColorClasses } from '@/utils/dynamicColors';
import { ChevronRight, Target, DollarSign, TrendingUp, ExternalLink, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dynamics() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedDynamic, setSelectedDynamic] = useState<string | null>(null);

  const getObjectivesForDynamic = (dynamicId: string) =>
    objectives.filter(obj => obj.dynamicId === dynamicId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="page-container">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <span className="text-2xl">✨</span>
            {t('dynamics.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {language === 'es' ? 'Las 5 dinámicas adaptativas que impulsan tu organización' : 'The 5 adaptive dynamics driving your organization'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">{organizationInfo.currentPeriod}</span>
        </div>
      </motion.div>

      {/* Dynamics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {dynamics.map((dynamic) => {
          const dynamicObjectives = getObjectivesForDynamic(dynamic.id);
          const isSelected = selectedDynamic === dynamic.id;
          const dynamicName = language === 'es' ? dynamic.nameEs : dynamic.name;
          const colors = getDynamicColorClasses(dynamic.color);

          return (
            <motion.div key={dynamic.id} variants={itemVariants}>
              <Card 
                className={cn(
                  "shadow-sm border-border/60 cursor-pointer transition-all overflow-hidden hover:shadow-md",
                  isSelected && "ring-2 ring-primary/40"
                )}
                onClick={() => setSelectedDynamic(isSelected ? null : dynamic.id)}
              >
                <div className={cn("h-1", colors.bg)} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl", colors.bgLight)}>
                        {dynamic.icon}
                      </div>
                      <span className={cn("text-base font-semibold", colors.text)}>{dynamicName}</span>
                    </CardTitle>
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground/40 transition-transform", isSelected && "rotate-90")} />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Target, value: dynamicObjectives.length, label: t('dynamics.objectives') },
                      { icon: TrendingUp, value: `${dynamic.progress}%`, label: t('dynamics.progress') },
                      { icon: DollarSign, value: `$${(dynamic.investment / 1000).toFixed(0)}K`, label: t('dynamics.investment') },
                    ].map((stat, i) => (
                      <div key={i} className="text-center p-2 bg-muted/40 rounded-lg">
                        <stat.icon className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground/60" />
                        <p className="text-sm font-bold">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <ProgressBar value={dynamic.progress} color={dynamic.color} size="sm" showLabel={false} />

                  {isSelected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-3 border-t border-border/60 space-y-2">
                      <p className="section-label !mb-1.5">{language === 'es' ? 'Objetivos' : 'Objectives'}</p>
                      {dynamicObjectives.map((obj) => (
                        <div 
                          key={obj.id}
                          className={cn("p-2.5 rounded-lg cursor-pointer group border-l-[3px] transition-all hover:shadow-sm", colors.bgLight)}
                          style={{ borderLeftColor: `hsl(var(--${dynamic.color}))` }}
                          onClick={(e) => { e.stopPropagation(); navigate(`/objectives?highlight=${obj.id}`); }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-1">
                              {language === 'es' ? obj.titleEs : obj.title}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <StatusBadge status={obj.status} size="sm" />
                              <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/60 transition-colors" />
                            </div>
                          </div>
                          <div className="mt-1.5">
                            <ProgressBar value={obj.progress} color={dynamic.color} size="sm" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-border/60 bg-muted/30">
          <CardContent className="py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: language === 'es' ? 'Dinámicas Activas' : 'Active Dynamics', value: dynamics.length },
                { label: language === 'es' ? 'Inversión Total' : 'Total Investment', value: `$${(dynamics.reduce((sum, d) => sum + d.investment, 0) / 1000).toFixed(0)}K` },
                { label: language === 'es' ? 'Progreso Promedio' : 'Average Progress', value: `${Math.round(dynamics.reduce((sum, d) => sum + d.progress, 0) / dynamics.length)}%` },
                { label: language === 'es' ? 'Total Objetivos' : 'Total Objectives', value: objectives.length },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
