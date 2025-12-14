import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { teams, objectives, skills } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkillIndicator } from '@/components/ui/SkillIndicator';
import { 
  Users, 
  Target, 
  Sparkles, 
  TrendingUp, 
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Teams() {
  const { t, language } = useLanguage();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const getTeamObjectives = (teamId: string) => 
    objectives.filter(obj => obj.teamId === teamId);
  
  const getTeamSkills = (skillIds: string[]) => 
    skills.filter(s => skillIds.includes(s.id));

  const getTeamInvestment = (teamId: string) => 
    getTeamObjectives(teamId).reduce((sum, obj) => sum + obj.investment, 0);

  const getTeamProgress = (teamId: string) => {
    const teamObjs = getTeamObjectives(teamId);
    if (teamObjs.length === 0) return 0;
    return Math.round(teamObjs.reduce((sum, obj) => sum + obj.progress, 0) / teamObjs.length);
  };

  const getAlignmentColor = (alignment: number) => {
    if (alignment >= 80) return 'status-success';
    if (alignment >= 60) return 'status-warning';
    return 'status-critical';
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
      className="p-6 lg:p-8 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-business-cyan" />
          {t('teams.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'es' 
            ? 'Vista general de equipos, objetivos y habilidades' 
            : 'Overview of teams, objectives, and skills'}
        </p>
      </motion.div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => {
          const teamObjectives = getTeamObjectives(team.id);
          const teamSkills = getTeamSkills(team.skillIds);
          const teamInvestment = getTeamInvestment(team.id);
          const teamProgress = getTeamProgress(team.id);
          const isSelected = selectedTeam === team.id;
          const alignmentColor = getAlignmentColor(team.alignment);

          return (
            <motion.div key={team.id} variants={itemVariants}>
              <Card 
                className={cn(
                  "shadow-sm cursor-pointer transition-all overflow-hidden",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedTeam(isSelected ? null : team.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-business-cyan/10 rounded-lg">
                        <Users className="h-5 w-5 text-business-cyan" />
                      </div>
                      <div>
                        <span className="block">{language === 'es' ? team.nameEs : team.name}</span>
                        <span className="text-sm text-muted-foreground font-normal">
                          {team.members} {language === 'es' ? 'miembros' : 'members'}
                        </span>
                      </div>
                    </CardTitle>
                    <ChevronRight className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      isSelected && "rotate-90"
                    )} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{t('teams.objectives')}</span>
                      </div>
                      <p className="text-lg font-bold">{teamObjectives.length}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{t('teams.skillMaturity')}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {teamSkills.slice(0, 4).map(skill => (
                          <SkillIndicator key={skill.id} value={skill.currentValue} size="sm" />
                        ))}
                        {teamSkills.length > 4 && (
                          <span className="text-xs text-muted-foreground">+{teamSkills.length - 4}</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{t('teams.alignment')}</span>
                      </div>
                      <p className={cn("text-lg font-bold", `text-${alignmentColor}`)}>{team.alignment}%</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{t('teams.roi')}</span>
                      </div>
                      <p className="text-lg font-bold">${(teamInvestment / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {language === 'es' ? 'Progreso General' : 'Overall Progress'}
                      </span>
                      <span className="font-medium">{teamProgress}%</span>
                    </div>
                    <ProgressBar value={teamProgress} color="business-cyan" showLabel={false} />
                  </div>

                  {/* Expanded Content */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-border space-y-4"
                    >
                      {/* Objectives */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3">
                          {language === 'es' ? 'Objetivos del Equipo' : 'Team Objectives'}
                        </h4>
                        <div className="space-y-2">
                          {teamObjectives.map(obj => (
                            <div key={obj.id} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <p className="text-sm font-medium truncate flex-1">
                                  {language === 'es' ? obj.titleEs : obj.title}
                                </p>
                                <StatusBadge status={obj.status} size="sm" />
                              </div>
                              <ProgressBar value={obj.progress} size="sm" showLabel={false} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3">
                          {language === 'es' ? 'Habilidades del Equipo' : 'Team Skills'}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {teamSkills.map(skill => (
                            <div key={skill.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <span className="text-sm truncate">
                                {language === 'es' ? skill.nameEs : skill.name}
                              </span>
                              <SkillIndicator value={skill.currentValue} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
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
        <Card className="shadow-sm bg-gradient-to-r from-business-cyan/5 to-business-cyan/10">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Total de Equipos' : 'Total Teams'}
                </p>
                <p className="text-3xl font-bold">{teams.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Total de Miembros' : 'Total Members'}
                </p>
                <p className="text-3xl font-bold">{teams.reduce((sum, t) => sum + t.members, 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Alineación Promedio' : 'Average Alignment'}
                </p>
                <p className="text-3xl font-bold text-status-success">
                  {Math.round(teams.reduce((sum, t) => sum + t.alignment, 0) / teams.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}