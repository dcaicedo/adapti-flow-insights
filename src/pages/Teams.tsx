import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { teams, keyResults, skills, objectives, dynamics, getKeyResultsForTeam, getSkillsForTeam, getUnitsForTeam, getObjectiveById, getDynamicById } from '@/data/demoData';
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
  ChevronRight,
  Building2,
  Layers,
  User,
  ArrowRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Team } from '@/data/demoData';

export default function Teams() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Auto-open team detail if highlighted via URL param
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      const team = teams.find(t => t.id === highlightId);
      if (team) {
        setSelectedTeam(team);
      }
    }
  }, [searchParams]);

  const getTeamKeyResults = (teamId: string) => getKeyResultsForTeam(teamId);
  
  const getTeamSkills = (teamId: string) => getSkillsForTeam(teamId);

  const getTeamInvestment = (teamId: string) => 
    getTeamKeyResults(teamId).reduce((sum, kr) => sum + kr.investment, 0);

  const getTeamProgress = (teamId: string) => {
    const teamKRs = getTeamKeyResults(teamId);
    if (teamKRs.length === 0) return 0;
    return Math.round(teamKRs.reduce((sum, kr) => sum + kr.progress, 0) / teamKRs.length);
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
            ? 'Vista general de equipos, resultados clave y habilidades' 
            : 'Overview of teams, key results, and skills'}
        </p>
      </motion.div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => {
          const teamKeyResults = getTeamKeyResults(team.id);
          const teamSkills = getTeamSkills(team.id);
          const teamInvestment = getTeamInvestment(team.id);
          const teamProgress = getTeamProgress(team.id);
          const alignmentColor = getAlignmentColor(team.alignment);
          const teamUnits = getUnitsForTeam(team.id);

          return (
            <motion.div key={team.id} variants={itemVariants}>
              <Card 
                className="shadow-sm cursor-pointer transition-all overflow-hidden hover:shadow-md"
                onClick={() => setSelectedTeam(team)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-business-cyan/10 rounded-lg">
                        <Users className="h-5 w-5 text-business-cyan" />
                      </div>
                      <div>
                        <span className="block">{language === 'es' ? team.nameEs : team.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground font-normal">
                            {team.members.length} {language === 'es' ? 'miembros' : 'members'}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            team.unitType === 'core' 
                              ? "bg-adaptativa-blue/10 text-adaptativa-blue" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {team.unitType === 'core' 
                              ? (language === 'es' ? 'Unidad Core' : 'Core Unit')
                              : (language === 'es' ? 'Unidad Extendida' : 'Extended Unit')
                            }
                          </span>
                        </div>
                      </div>
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {language === 'es' ? 'Resultados Clave' : 'Key Results'}
                        </span>
                      </div>
                      <p className="text-lg font-bold">{teamKeyResults.length}</p>
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

                  {/* Units Badge */}
                  {teamUnits.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                      {teamUnits.map(unit => unit && (
                        <span 
                          key={unit.id}
                          className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                        >
                          {language === 'es' ? unit.nameEs : unit.name}
                        </span>
                      ))}
                    </div>
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
                <p className="text-3xl font-bold">{teams.reduce((sum, t) => sum + t.members.length, 0)}</p>
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

      {/* Team Detail Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTeam && (
            <TeamDetailContent team={selectedTeam} language={language} />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function TeamDetailContent({ team, language }: { team: Team; language: 'en' | 'es' }) {
  const teamKeyResults = getKeyResultsForTeam(team.id);
  const teamSkills = getSkillsForTeam(team.id);
  const teamUnits = getUnitsForTeam(team.id);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-business-cyan/10 rounded-lg">
            <Users className="h-6 w-6 text-business-cyan" />
          </div>
          <div>
            <span>{language === 'es' ? team.nameEs : team.name}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-sm px-2 py-0.5 rounded-full font-medium",
                team.unitType === 'core' 
                  ? "bg-adaptativa-blue/10 text-adaptativa-blue" 
                  : "bg-muted text-muted-foreground"
              )}>
                {team.unitType === 'core' 
                  ? (language === 'es' ? 'Unidad Core' : 'Core Unit')
                  : (language === 'es' ? 'Unidad Extendida' : 'Extended Unit')
                }
              </span>
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Strategic Units */}
        {teamUnits.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {language === 'es' ? 'Pertenece a' : 'Belongs to'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {teamUnits.map(unit => unit && (
                <div key={unit.id} className="px-3 py-2 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">{language === 'es' ? unit.nameEs : unit.name}</p>
                  <p className="text-xs text-muted-foreground">{language === 'es' ? unit.descriptionEs : unit.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Results with Traceability */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            {language === 'es' ? 'Resultados Clave del Equipo' : 'Team Key Results'}
          </h3>
          <div className="space-y-3">
            {teamKeyResults.map(kr => {
              const objective = getObjectiveById(kr.objectiveId);
              const dynamic = objective ? getDynamicById(objective.dynamicId) : null;
              
              return (
                <div key={kr.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                  {/* Traceability Path */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    {dynamic && (
                      <>
                        <span className={cn(
                          "px-2 py-0.5 rounded font-medium",
                          `bg-${dynamic.color}/10 text-${dynamic.color}`
                        )}>
                          {language === 'es' ? dynamic.nameEs : dynamic.name}
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                    {objective && (
                      <span className="truncate max-w-[200px]">
                        {language === 'es' ? objective.titleEs : objective.title}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-medium">
                      {language === 'es' ? kr.titleEs : kr.title}
                    </p>
                    <StatusBadge status={kr.status} size="sm" />
                  </div>
                  <ProgressBar value={kr.progress} size="sm" showLabel />
                  
                  {/* Contributing Teams */}
                  {kr.teamIds.length > 1 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {language === 'es' ? 'Equipos contribuyentes:' : 'Contributing teams:'}
                      </span>
                      <div className="flex gap-1">
                        {kr.teamIds.map(tid => {
                          const t = teams.find(x => x.id === tid);
                          return t && (
                            <span key={tid} className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              tid === team.id ? "bg-business-cyan/10 text-business-cyan" : "bg-muted text-muted-foreground"
                            )}>
                              {language === 'es' ? t.nameEs : t.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            {language === 'es' ? 'Habilidades del Equipo' : 'Team Skills'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {teamSkills.map(skill => (
              <div key={skill.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm truncate">
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

        {/* Team Members */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {language === 'es' ? 'Integrantes' : 'Team Members'} ({team.members.length})
          </h3>
          
          {/* Member counts by unit type */}
          <div className="flex gap-4 mb-3 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-adaptativa-blue" />
              <span className="text-muted-foreground">Core:</span>
              <span className="font-medium">{team.members.filter(m => m.unitType === 'core').length}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">{language === 'es' ? 'Extendida' : 'Extended'}:</span>
              <span className="font-medium">{team.members.filter(m => m.unitType === 'extended').length}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
            {team.members.map(member => (
              <div key={member.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  member.unitType === 'core' 
                    ? "bg-adaptativa-blue/10 text-adaptativa-blue" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate">
                      {language === 'es' ? member.roleEs : member.role}
                    </p>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                      member.unitType === 'core' 
                        ? "bg-adaptativa-blue/10 text-adaptativa-blue" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {member.unitType === 'core' ? 'Core' : (language === 'es' ? 'Ext' : 'Ext')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
