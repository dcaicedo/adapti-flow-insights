import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { objectives, skills, teams, dynamics, getDynamicColor } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkillIndicator } from '@/components/ui/SkillIndicator';
import { 
  Trophy, 
  Plus, 
  Filter, 
  Search, 
  DollarSign, 
  Users, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Objectives() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredObjectives = objectives.filter(obj => {
    const title = language === 'es' ? obj.titleEs : obj.title;
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || obj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTeam = (teamId: string) => teams.find(t => t.id === teamId);
  const getDynamic = (dynamicId: string) => dynamics.find(d => d.id === dynamicId);
  const getSkillsForObjective = (skillIds: string[]) => skills.filter(s => skillIds.includes(s.id));

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

  const colorBgs: Record<string, string> = {
    'adaptativa-blue': 'bg-adaptativa-blue/10',
    'culture-yellow': 'bg-culture-yellow/10',
    'business-cyan': 'bg-business-cyan/10',
    'structure-neutral': 'bg-structure-neutral/10',
    'entrepreneurship-green': 'bg-entrepreneurship-green/10',
  };

  const colorTexts: Record<string, string> = {
    'adaptativa-blue': 'text-adaptativa-blue',
    'culture-yellow': 'text-culture-yellow',
    'business-cyan': 'text-business-cyan',
    'structure-neutral': 'text-structure-neutral',
    'entrepreneurship-green': 'text-entrepreneurship-green',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="h-8 w-8 text-culture-yellow" />
            {t('objectives.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'es' 
              ? 'Gestiona objetivos SMART y habilidades conectadas' 
              : 'Manage SMART objectives and connected skills'}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t('objectives.create')}
        </Button>
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
        <div className="flex gap-2">
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
          const team = getTeam(objective.teamId);
          const dynamic = getDynamic(objective.dynamicId);
          const objectiveSkills = getSkillsForObjective(objective.skills);
          const isExpanded = expandedId === objective.id;
          const dynamicColor = getDynamicColor(objective.dynamicId);

          return (
            <motion.div key={objective.id} variants={itemVariants}>
              <Card className="shadow-sm overflow-hidden">
                <div 
                  className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : objective.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {dynamic && (
                          <span className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded",
                            colorBgs[dynamic.color],
                            colorTexts[dynamic.color]
                          )}>
                            {language === 'es' ? dynamic.nameEs : dynamic.name}
                          </span>
                        )}
                        <StatusBadge status={objective.status} size="sm" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'es' ? objective.titleEs : objective.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {team && (language === 'es' ? team.nameEs : team.name)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${objective.investment.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          {objectiveSkills.length} {language === 'es' ? 'habilidades' : 'skills'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{objective.progress}%</p>
                        <p className="text-xs text-muted-foreground">{t('dynamics.progress')}</p>
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
                      color={dynamicColor} 
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
                    <div className="p-5 space-y-4">
                      {/* SMART Description */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">{t('objectives.smart')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {language === 'es' ? objective.descriptionEs : objective.description}
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3">{t('objectives.skills')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {objectiveSkills.map((skill) => (
                            <div 
                              key={skill.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <span className="text-sm font-medium">
                                {language === 'es' ? skill.nameEs : skill.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <SkillIndicator value={skill.initialValue} size="sm" />
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <SkillIndicator value={skill.currentValue} size="sm" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
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