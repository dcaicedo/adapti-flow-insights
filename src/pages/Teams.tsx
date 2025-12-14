import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { teams, keyResults, organizationInfo, getKeyResultsForTeam, getSkillsForTeam, getUnitsForTeam, getObjectiveById, getDynamicById, dynamics } from '@/data/demoData';
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
  ChevronDown,
  Building2,
  User,
  ArrowRight,
  Calendar,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Team, KeyResult } from '@/data/demoData';

// Team color mapping for consistent visualization
const teamColors: Record<string, string> = {
  'team-1': 'adaptativa-blue',
  'team-2': 'culture-yellow',
  'team-3': 'business-blue',
  'team-4': 'structure-magenta',
  'team-5': 'entrepreneurship-green',
  'team-6': 'culture-yellow',
  'team-7': 'business-blue',
  'team-8': 'structure-magenta',
  'team-9': 'adaptativa-blue',
  'team-10': 'entrepreneurship-green',
};

export default function Teams() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [highlightedKRId, setHighlightedKRId] = useState<string | null>(null);

  // Auto-open team detail if highlighted via URL param
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    const krId = searchParams.get('kr');
    if (highlightId) {
      const team = teams.find(t => t.id === highlightId);
      if (team) {
        setSelectedTeam(team);
        if (krId) {
          setHighlightedKRId(krId);
        }
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

  const getTeamColor = (teamId: string) => teamColors[teamId] || 'primary';

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
      {/* Header with Period */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-adaptativa-blue" />
            {language === 'es' ? 'Adaptive Teams' : 'Adaptive Teams'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'es' 
              ? 'Tablero de objetivos y resultados clave por equipo' 
              : 'Objectives and key results board by team'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-adaptativa-blue/10 rounded-lg border border-adaptativa-blue/20">
          <Calendar className="h-5 w-5 text-adaptativa-blue" />
          <span className="font-semibold text-adaptativa-blue">{organizationInfo.currentPeriod}</span>
        </div>
      </motion.div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => {
          const teamKeyResults = getTeamKeyResults(team.id);
          const teamInvestment = getTeamInvestment(team.id);
          const teamProgress = getTeamProgress(team.id);
          const alignmentColor = getAlignmentColor(team.alignment);
          const teamColor = getTeamColor(team.id);
          const coreMembers = team.members.filter(m => m.unitType === 'core').length;
          const extendedMembers = team.members.filter(m => m.unitType === 'extended').length;

          return (
            <motion.div key={team.id} variants={itemVariants}>
              <Card 
                className={cn(
                  "shadow-sm cursor-pointer transition-all overflow-hidden hover:shadow-lg group",
                  `border-t-4 border-t-${teamColor}`
                )}
                style={{ borderTopColor: `hsl(var(--${teamColor}))` }}
                onClick={() => {
                  setSelectedTeam(team);
                  setHighlightedKRId(null);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-muted"
                        style={{ backgroundColor: `hsl(var(--${teamColor}) / 0.1)` }}
                      >
                        {team.icon}
                      </div>
                      <div>
                        <span className="block text-lg">{language === 'es' ? team.nameEs : team.name}</span>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground font-normal">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-adaptativa-blue" />
                            Core: {coreMembers}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                            Extended: {extendedMembers}
                          </span>
                        </div>
                      </div>
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{teamKeyResults.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'es' ? 'KRs' : 'KRs'}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{teamProgress}%</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'es' ? 'Progreso' : 'Progress'}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">${(teamInvestment / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'es' ? 'Inversión' : 'Investment'}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {language === 'es' ? 'Progreso' : 'Progress'}
                      </span>
                      <span className="font-medium">{teamProgress}%</span>
                    </div>
                    <ProgressBar value={teamProgress} color={teamColor} showLabel={false} />
                  </div>

                  {/* Alignment Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Alineación' : 'Alignment'}
                    </span>
                    <span className={cn("text-sm font-semibold", `text-${alignmentColor}`)}>
                      {team.alignment}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm bg-gradient-to-r from-adaptativa-blue/5 to-adaptativa-blue/10">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Total Adaptive Teams' : 'Total Adaptive Teams'}
                </p>
                <p className="text-3xl font-bold">{teams.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Total Miembros' : 'Total Members'}
                </p>
                <p className="text-3xl font-bold">{teams.reduce((sum, t) => sum + t.members.length, 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Total KRs' : 'Total KRs'}
                </p>
                <p className="text-3xl font-bold">{keyResults.length}</p>
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
      <Dialog open={!!selectedTeam} onOpenChange={() => {
        setSelectedTeam(null);
        setHighlightedKRId(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTeam && (
            <TeamDetailContent 
              team={selectedTeam} 
              language={language} 
              teamColor={getTeamColor(selectedTeam.id)}
              highlightedKRId={highlightedKRId}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

interface TeamDetailContentProps {
  team: Team;
  language: 'en' | 'es';
  teamColor: string;
  highlightedKRId: string | null;
}

function TeamDetailContent({ team, language, teamColor, highlightedKRId }: TeamDetailContentProps) {
  const teamKeyResults = getKeyResultsForTeam(team.id);
  const teamSkills = getSkillsForTeam(team.id);
  const teamUnits = getUnitsForTeam(team.id);
  const [expandedKR, setExpandedKR] = useState<string | null>(highlightedKRId);

  useEffect(() => {
    if (highlightedKRId) {
      setExpandedKR(highlightedKRId);
    }
  }, [highlightedKRId]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `hsl(var(--${teamColor}) / 0.1)` }}
          >
            {team.icon}
          </div>
          <div>
            <span>{language === 'es' ? team.nameEs : team.name}</span>
            <div className="flex items-center gap-4 mt-1 text-sm font-normal">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {organizationInfo.currentPeriod}
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded-full font-medium",
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

        {/* Key Results with Collapsible */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            {language === 'es' ? 'Resultados Clave del Adaptive Team' : 'Adaptive Team Key Results'}
            <span className="text-muted-foreground font-normal">({teamKeyResults.length})</span>
          </h3>
          <div className="space-y-2">
            {teamKeyResults.map(kr => {
              const objective = getObjectiveById(kr.objectiveId);
              const dynamic = objective ? getDynamicById(objective.dynamicId) : null;
              const isExpanded = expandedKR === kr.id;
              
              return (
                <div 
                  key={kr.id} 
                  className={cn(
                    "rounded-lg border border-border overflow-hidden transition-all",
                    highlightedKRId === kr.id && "ring-2 ring-primary"
                  )}
                >
                  {/* KR Header - Always visible */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                    onClick={() => setExpandedKR(isExpanded ? null : kr.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {dynamic && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded font-medium"
                            style={{ 
                              backgroundColor: `hsl(var(--${dynamic.color}) / 0.1)`,
                              color: `hsl(var(--${dynamic.color}))`
                            }}
                          >
                            {dynamic.icon} {language === 'es' ? dynamic.nameEs : dynamic.name}
                          </span>
                        )}
                        <StatusBadge status={kr.status} size="sm" />
                      </div>
                      <p className="text-sm font-medium truncate">
                        {language === 'es' ? kr.titleEs : kr.title}
                      </p>
                      <div className="mt-2">
                        <ProgressBar value={kr.progress} color={teamColor} size="sm" showLabel />
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* KR Details - Collapsible */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/20 space-y-4">
                          {/* Traceability Path */}
                          <div className="flex items-center gap-2 text-xs">
                            <Layers className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {language === 'es' ? 'Trazabilidad:' : 'Traceability:'}
                            </span>
                            {dynamic && (
                              <>
                                <span 
                                  className="px-2 py-0.5 rounded font-medium"
                                  style={{ 
                                    backgroundColor: `hsl(var(--${dynamic.color}) / 0.1)`,
                                    color: `hsl(var(--${dynamic.color}))`
                                  }}
                                >
                                  {language === 'es' ? dynamic.nameEs : dynamic.name}
                                </span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              </>
                            )}
                            {objective && (
                              <span className="text-foreground truncate max-w-[200px]">
                                {language === 'es' ? objective.titleEs : objective.title}
                              </span>
                            )}
                          </div>

                          {/* SMART Description */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              {language === 'es' ? 'Descripción SMART' : 'SMART Description'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === 'es' ? kr.descriptionEs : kr.description}
                            </p>
                          </div>

                          {/* Investment */}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {language === 'es' ? 'Inversión:' : 'Investment:'}
                              </span>
                              <span className="font-semibold">${kr.investment.toLocaleString()}</span>
                            </span>
                          </div>
                          
                          {/* Contributing Teams */}
                          {kr.teamIds.length > 1 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {language === 'es' ? 'Adaptive Teams contribuyentes:' : 'Contributing Adaptive Teams:'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {kr.teamIds.map(tid => {
                                  const t = teams.find(x => x.id === tid);
                                  return t && (
                                    <span key={tid} className={cn(
                                      "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                                      tid === team.id 
                                        ? "bg-adaptativa-blue/10 text-adaptativa-blue font-medium" 
                                        : "bg-muted text-muted-foreground"
                                    )}>
                                      {t.icon} {language === 'es' ? t.nameEs : t.name}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            {language === 'es' ? 'Habilidades del Adaptive Team' : 'Adaptive Team Skills'}
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
              <span className="text-muted-foreground">Extended:</span>
              <span className="font-medium">{team.members.filter(m => m.unitType === 'extended').length}</span>
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {team.members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? member.roleEs : member.role}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    member.unitType === 'core' 
                      ? "bg-adaptativa-blue/10 text-adaptativa-blue font-medium" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {member.unitType === 'core' ? 'Core' : 'Extended'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {language === 'es' ? member.areaEs : member.area}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}