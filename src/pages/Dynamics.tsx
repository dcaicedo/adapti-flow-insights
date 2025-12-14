import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { dynamics, objectives, organizationInfo } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DynamicBadge } from '@/components/ui/DynamicBadge';
import { getDynamicColorClasses } from '@/utils/dynamicColors';
import { ChevronRight, Target, DollarSign, TrendingUp, ExternalLink, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dynamics() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedDynamic, setSelectedDynamic] = useState<string | null>(null);

  const getObjectivesForDynamic = (dynamicId: string) => {
    return objectives.filter(obj => obj.dynamicId === dynamicId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 sm:p-6 lg:p-8 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">🌀</span>
            {t('dynamics.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {language === 'es' 
              ? 'Las 5 dinámicas adaptativas que impulsan tu organización' 
              : 'The 5 adaptive dynamics driving your organization'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-adaptativa-blue/10 rounded-lg border border-adaptativa-blue/20 shrink-0">
          <Calendar className="h-4 w-4 text-adaptativa-blue" />
          <span className="text-sm font-semibold text-adaptativa-blue">{organizationInfo.currentPeriod}</span>
        </div>
      </motion.div>

      {/* Dynamics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {dynamics.map((dynamic) => {
          const dynamicObjectives = getObjectivesForDynamic(dynamic.id);
          const isSelected = selectedDynamic === dynamic.id;
          const dynamicName = language === 'es' ? dynamic.nameEs : dynamic.name;
          const colors = getDynamicColorClasses(dynamic.color);

          return (
            <motion.div key={dynamic.id} variants={itemVariants}>
              <Card 
                className={cn(
                  "shadow-sm cursor-pointer transition-all overflow-hidden hover:shadow-lg",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedDynamic(isSelected ? null : dynamic.id)}
              >
                {/* Color Indicator */}
                <div className={cn("h-2", colors.bg)} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                          colors.bgLight
                        )}
                      >
                        {dynamic.icon}
                      </div>
                      <span className={cn("text-lg", colors.text)}>{dynamicName}</span>
                    </CardTitle>
                    <ChevronRight className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      isSelected && "rotate-90"
                    )} />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">{dynamicObjectives.length}</p>
                      <p className="text-xs text-muted-foreground">{t('dynamics.objectives')}</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">{dynamic.progress}%</p>
                      <p className="text-xs text-muted-foreground">{t('dynamics.progress')}</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">${(dynamic.investment / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">{t('dynamics.investment')}</p>
                    </div>
                  </div>

                  {/* Progress Bar with inherited color */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{t('dynamics.progress')}</span>
                      <span className="font-medium">{dynamic.progress}%</span>
                    </div>
                    <ProgressBar value={dynamic.progress} color={dynamic.color} showLabel={false} />
                  </div>

                  {/* Expanded Objectives - inheriting dynamic color */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-border space-y-3"
                    >
                      <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {language === 'es' ? 'Objetivos' : 'Objectives'}
                      </h4>
                      {dynamicObjectives.map((obj) => (
                        <div 
                          key={obj.id} 
                          className={cn(
                            "p-3 rounded-lg transition-all cursor-pointer group border-l-4",
                            colors.bgLight,
                            "hover:shadow-sm"
                          )}
                          style={{ borderLeftColor: `hsl(var(--${dynamic.color}))` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/objectives?highlight=${obj.id}`);
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">
                              {language === 'es' ? obj.titleEs : obj.title}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge status={obj.status} size="sm" />
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="mt-2">
                            <ProgressBar 
                              value={obj.progress} 
                              color={dynamic.color} 
                              size="sm" 
                            />
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
        <Card className="shadow-sm bg-gradient-to-r from-muted/50 to-muted/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Dinámicas Activas' : 'Active Dynamics'}
                </p>
                <p className="text-2xl font-bold">{dynamics.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Inversión Total' : 'Total Investment'}
                </p>
                <p className="text-2xl font-bold">
                  ${(dynamics.reduce((sum, d) => sum + d.investment, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Progreso Promedio' : 'Average Progress'}
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(dynamics.reduce((sum, d) => sum + d.progress, 0) / dynamics.length)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Total Objetivos' : 'Total Objectives'}
                </p>
                <p className="text-2xl font-bold">{objectives.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
