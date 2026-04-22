import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { objectives, organizationInfo, getDynamicById, getKeyResultsForObjective, getTeamById, getSkillById } from '@/data/demoData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DynamicBadge } from '@/components/ui/DynamicBadge';
import { TraceabilityBreadcrumb } from '@/components/ui/TraceabilityBreadcrumb';
import { KRCard } from '@/components/ui/KRCard';
import { getDynamicColorClasses } from '@/utils/dynamicColors';
import { 
  Trophy, 
  Plus, 
  Search, 
  DollarSign, 
  Users, 
  ChevronDown,
  ChevronUp,
  Target,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Objectives() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auto-expand objective if highlighted via URL param
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      setExpandedId(highlightId);
      setTimeout(() => {
        const element = document.getElementById(`objective-${highlightId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [searchParams]);

  const filteredObjectives = objectives.filter(obj => {
    const title = language === 'es' ? obj.titleEs : obj.title;
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || obj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      className="page-container"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-culture-yellow" />
            {t('objectives.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {language === 'es' 
              ? 'Objetivos estratégicos y sus Resultados Clave' 
              : 'Strategic objectives and their Key Results'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-adaptativa-blue/10 rounded-lg border border-adaptativa-blue/20">
            <Calendar className="h-4 w-4 text-adaptativa-blue" />
            <span className="text-sm font-semibold text-adaptativa-blue">{organizationInfo.currentPeriod}</span>
          </div>
          <Button className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            {t('objectives.create')}
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={statusFilter === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            {language === 'es' ? 'Todos' : 'All'}
          </Button>
          <Button 
            variant={statusFilter === 'on-track' ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter('on-track')}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-status-success" />
            {t('objectives.onTrack')}
          </Button>
          <Button 
            variant={statusFilter === 'attention' ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter('attention')}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-status-warning" />
            {t('objectives.attention')}
          </Button>
          <Button 
            variant={statusFilter === 'critical' ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter('critical')}
            className="gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-status-critical" />
            {t('objectives.critical')}
          </Button>
        </div>
      </motion.div>

      {/* Objectives List */}
      <motion.div variants={containerVariants} className="space-y-4">
        {filteredObjectives.map((objective) => {
          const dynamic = getDynamicById(objective.dynamicId);
          const objectiveKeyResults = getKeyResultsForObjective(objective.id);
          const isExpanded = expandedId === objective.id;
          const colors = dynamic ? getDynamicColorClasses(dynamic.color) : getDynamicColorClasses('adaptativa-blue');
          const inheritedColor = dynamic?.color || 'adaptativa-blue';

          const totalInvestment = objectiveKeyResults.reduce((sum, kr) => sum + kr.investment, 0);
          const totalTeams = [...new Set(objectiveKeyResults.flatMap(kr => kr.teamIds))];

          return (
            <motion.div key={objective.id} variants={itemVariants} id={`objective-${objective.id}`}>
              <Card className={cn(
                "shadow-sm overflow-hidden transition-all hover:shadow-md",
                searchParams.get('highlight') === objective.id && "ring-2 ring-primary"
              )}>
                {/* Color indicator - inherits from dynamic */}
                <div className={cn("h-1", colors.bg)} />
                
                <div 
                  className="p-4 sm:p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : objective.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {dynamic && (
                          <DynamicBadge
                            name={language === 'es' ? dynamic.nameEs : dynamic.name}
                            color={dynamic.color}
                            icon={dynamic.icon}
                            size="sm"
                            onClick={() => navigate('/dynamics')}
                          />
                        )}
                        <StatusBadge status={objective.status} size="sm" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        {language === 'es' ? objective.titleEs : objective.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                          {objectiveKeyResults.length} {language === 'es' ? 'KRs' : 'KRs'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          {totalTeams.length} {language === 'es' ? 'equipos' : 'teams'}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                          ${totalInvestment.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-bold">{objective.progress}%</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">{t('dynamics.progress')}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <ProgressBar 
                      value={objective.progress} 
                      color={inheritedColor} 
                      showLabel={false}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-4 sm:p-5 space-y-5">
                      {/* Traceability Breadcrumb */}
                      <TraceabilityBreadcrumb
                        items={[
                          {
                            label: dynamic ? (language === 'es' ? dynamic.nameEs : dynamic.name) : 'Dynamic',
                            color: dynamic?.color,
                            icon: dynamic?.icon,
                            onClick: () => navigate('/dynamics')
                          },
                          {
                            label: language === 'es' ? objective.titleEs : objective.title,
                          },
                          {
                            label: `${objectiveKeyResults.length} ${language === 'es' ? 'Resultados Clave' : 'Key Results'}`,
                          }
                        ]}
                      />

                      {/* Objective Description */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {language === 'es' ? 'Descripción SMART' : 'SMART Description'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {language === 'es' ? objective.descriptionEs : objective.description}
                        </p>
                      </div>

                      {/* Key Results - all inherit dynamic color */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          {language === 'es' ? 'Resultados Clave' : 'Key Results'}
                        </h4>
                        <div className="space-y-3">
                          {objectiveKeyResults.map((kr) => {
                            const krTeams = kr.teamIds.map(id => getTeamById(id));
                            const krSkills = kr.skills.map(id => getSkillById(id));

                            return (
                              <KRCard
                                key={kr.id}
                                keyResult={kr}
                                dynamic={dynamic}
                                teams={krTeams}
                                skills={krSkills}
                                language={language}
                                inheritedColor={inheritedColor}
                                onTeamClick={(teamId) => navigate(`/teams?highlight=${teamId}&kr=${kr.id}`)}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button variant="outline" size="sm">{t('objectives.edit')}</Button>
                        <Button variant="outline" size="sm">{t('objectives.history')}</Button>
                        <Button variant="outline" size="sm" className="text-muted-foreground">
                          {t('objectives.archive')}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredObjectives.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {language === 'es' 
              ? 'No se encontraron objetivos con los filtros actuales' 
              : 'No objectives found with current filters'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
