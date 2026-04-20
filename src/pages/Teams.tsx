import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { teams, keyResults, organizationInfo, getKeyResultsForTeam, getSkillsForTeam, getUnitsForTeam, getObjectiveById, getDynamicById } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkillIndicator } from '@/components/ui/SkillIndicator';
import { DynamicBadge } from '@/components/ui/DynamicBadge';
import { TraceabilityBreadcrumb } from '@/components/ui/TraceabilityBreadcrumb';
import { getTeamColor, getDynamicColorClasses } from '@/utils/dynamicColors';
import { 
  Users, 
  Target, 
  Sparkles, 
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Building2,
  User,
  ArrowRight,
  Calendar,
  ExternalLink,
  Search,
  Clock,
  Zap,
  BarChart3,
  Gauge,
  Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';
import type { Team, KeyResult, TeamMetrics } from '@/data/demoData';

export default function Teams() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [highlightedKRId, setHighlightedKRId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState<'all' | 'core' | 'extended'>('all');

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

  const filteredTeams = teams.filter(team => {
    const name = language === 'es' ? team.nameEs : team.name;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = unitFilter === 'all' || team.unitType === unitFilter;
    return matchesSearch && matchesUnit;
  });

  const getTeamKeyResults = (teamId: string) => getKeyResultsForTeam(teamId);
  const getTeamInvestment = (teamId: string) => 
    getTeamKeyResults(teamId).reduce((sum, kr) => sum + kr.investment, 0);
  const getTeamProgress = (teamId: string) => {
    const teamKRs = getTeamKeyResults(teamId);
    if (teamKRs.length === 0) return 0;
    return Math.round(teamKRs.reduce((sum, kr) => sum + kr.progress, 0) / teamKRs.length);
  };

  const getAlignmentColor = (alignment: number) => {
    if (alignment >= 80) return 'text-status-success';
    if (alignment >= 60) return 'text-status-warning';
    return 'text-status-critical';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-adaptativa-blue" />
            {language === 'es' ? 'Adaptive Teams' : 'Adaptive Teams'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {language === 'es' 
              ? 'Equipos, KRs y progreso por período' 
              : 'Teams, KRs and progress by period'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-adaptativa-blue/10 rounded-lg border border-adaptativa-blue/20 shrink-0">
          <Calendar className="h-4 w-4 text-adaptativa-blue" />
          <span className="text-sm font-semibold text-adaptativa-blue">{organizationInfo.currentPeriod}</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'es' ? 'Buscar equipo...' : 'Search team...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setUnitFilter('all')}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all",
              unitFilter === 'all' 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {language === 'es' ? 'Todos' : 'All'}
          </button>
          <button
            onClick={() => setUnitFilter('core')}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              unitFilter === 'core' 
                ? "bg-adaptativa-blue text-primary-foreground" 
                : "bg-adaptativa-blue/10 text-adaptativa-blue hover:bg-adaptativa-blue/20"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Core
          </button>
          <button
            onClick={() => setUnitFilter('extended')}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              unitFilter === 'extended' 
                ? "bg-muted-foreground text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Extended
          </button>
        </div>
      </motion.div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredTeams.map((team) => {
          const teamKeyResults = getTeamKeyResults(team.id);
          const teamInvestment = getTeamInvestment(team.id);
          const teamProgress = getTeamProgress(team.id);
          const teamColor = getTeamColor(team.id);
          const colors = getDynamicColorClasses(teamColor);
          const coreMembers = team.members.filter(m => m.unitType === 'core').length;
          const extendedMembers = team.members.filter(m => m.unitType === 'extended').length;

          return (
            <motion.div key={team.id} variants={itemVariants}>
              <Card 
                className={cn(
                  "shadow-sm cursor-pointer transition-all overflow-hidden hover:shadow-lg group"
                )}
                onClick={() => {
                  setSelectedTeam(team);
                  setHighlightedKRId(null);
                }}
              >
                {/* Color indicator */}
                <div className={cn("h-1.5", colors.bg)} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div 
                        className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", colors.bgLight)}
                      >
                        {team.icon}
                      </div>
                      <div>
                        <span className="block text-base sm:text-lg">{language === 'es' ? team.nameEs : team.name}</span>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-normal">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-adaptativa-blue" />
                            Core: {coreMembers}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                            Ext: {extendedMembers}
                          </span>
                        </div>
                      </div>
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <Target className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                      <p className="text-base font-bold">{teamKeyResults.length}</p>
                      <p className="text-[10px] text-muted-foreground">KRs</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <TrendingUp className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                      <p className="text-base font-bold">{teamProgress}%</p>
                      <p className="text-[10px] text-muted-foreground">{language === 'es' ? 'Progreso' : 'Progress'}</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <Gauge className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                      <p className="text-base font-bold">{team.metrics.velocity}</p>
                      <p className="text-[10px] text-muted-foreground">Velocity</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <span className="text-sm">{team.metrics.happinessIndex >= 8.5 ? '😄' : team.metrics.happinessIndex >= 7 ? '🙂' : '😐'}</span>
                      <p className="text-base font-bold">{team.metrics.happinessIndex.toFixed(1)}</p>
                      <p className="text-[10px] text-muted-foreground">Happiness</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <ProgressBar value={teamProgress} color={teamColor} showLabel={false} />

                  {/* Alignment & Unit Type */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      team.unitType === 'core' 
                        ? "bg-adaptativa-blue/10 text-adaptativa-blue" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {team.unitType === 'core' ? 'Core Unit' : 'Extended Unit'}
                    </span>
                    <span className={cn("text-sm font-semibold", getAlignmentColor(team.alignment))}>
                      {team.alignment}% {language === 'es' ? 'alineado' : 'aligned'}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{language === 'es' ? 'Total Teams' : 'Total Teams'}</p>
                <p className="text-2xl sm:text-3xl font-bold">{teams.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{language === 'es' ? 'Total Miembros' : 'Total Members'}</p>
                <p className="text-2xl sm:text-3xl font-bold">{teams.reduce((sum, t) => sum + t.members.length, 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{language === 'es' ? 'Total KRs' : 'Total KRs'}</p>
                <p className="text-2xl sm:text-3xl font-bold">{keyResults.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{language === 'es' ? 'Alineación Promedio' : 'Avg Alignment'}</p>
                <p className="text-2xl sm:text-3xl font-bold text-status-success">
                  {Math.round(teams.reduce((sum, t) => sum + t.alignment, 0) / teams.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Detail Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => { setSelectedTeam(null); setHighlightedKRId(null); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTeam && (
            <TeamDetailContent 
              team={selectedTeam} 
              language={language}
              navigate={navigate}
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
  navigate: ReturnType<typeof useNavigate>;
  highlightedKRId: string | null;
}

function TeamDetailContent({ team, language, navigate, highlightedKRId }: TeamDetailContentProps) {
  const teamKeyResults = getKeyResultsForTeam(team.id);
  const teamSkills = getSkillsForTeam(team.id);
  const teamUnits = getUnitsForTeam(team.id);
  const teamColor = getTeamColor(team.id);
  const colors = getDynamicColorClasses(teamColor);
  const [expandedKR, setExpandedKR] = useState<string | null>(highlightedKRId);

  useEffect(() => {
    if (highlightedKRId) {
      setExpandedKR(highlightedKRId);
    }
  }, [highlightedKRId]);

  const coreMembers = team.members.filter(m => m.unitType === 'core');
  const extendedMembers = team.members.filter(m => m.unitType === 'extended');

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-3xl", colors.bgLight)}>
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
                "px-2 py-0.5 rounded-full font-medium text-xs",
                team.unitType === 'core' 
                  ? "bg-adaptativa-blue/10 text-adaptativa-blue" 
                  : "bg-muted text-muted-foreground"
              )}>
                {team.unitType === 'core' ? 'Core Unit' : 'Extended Unit'}
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

        {/* Performance Metrics */}
        <TeamMetricsPanel metrics={team.metrics} language={language} />

        {/* Key Results with collapsible and inherited colors */}
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
              const krColor = dynamic?.color || teamColor;
              const krColors = getDynamicColorClasses(krColor);
              
              return (
                <div 
                  key={kr.id} 
                  className={cn(
                    "rounded-lg border border-border overflow-hidden transition-all",
                    highlightedKRId === kr.id && "ring-2 ring-primary"
                  )}
                >
                  {/* KR Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                    onClick={() => setExpandedKR(isExpanded ? null : kr.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {dynamic && (
                          <DynamicBadge
                            name={language === 'es' ? dynamic.nameEs : dynamic.name}
                            color={dynamic.color}
                            icon={dynamic.icon}
                            size="sm"
                          />
                        )}
                        <StatusBadge status={kr.status} size="sm" />
                      </div>
                      <p className="text-sm font-medium">
                        {language === 'es' ? kr.titleEs : kr.title}
                      </p>
                      <div className="mt-2">
                        <ProgressBar value={kr.progress} color={krColor} size="sm" showLabel />
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* KR Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 space-y-3 border-t border-border bg-muted/10">
                          {/* Traceability */}
                          <TraceabilityBreadcrumb
                            items={[
                              {
                                label: dynamic ? (language === 'es' ? dynamic.nameEs : dynamic.name) : '',
                                color: dynamic?.color,
                                icon: dynamic?.icon,
                                onClick: () => navigate('/dynamics')
                              },
                              {
                                label: objective ? (language === 'es' ? objective.titleEs : objective.title) : '',
                                onClick: objective ? () => navigate(`/objectives?highlight=${objective.id}`) : undefined
                              },
                              {
                                label: language === 'es' ? kr.titleEs : kr.title
                              }
                            ]}
                          />
                          
                          <p className="text-sm text-muted-foreground">
                            {language === 'es' ? kr.descriptionEs : kr.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              CA${kr.investment.toLocaleString()}
                            </span>
                            {objective && (
                              <button
                                onClick={() => navigate(`/objectives?highlight=${objective.id}`)}
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {language === 'es' ? 'Ver objetivo' : 'View objective'}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Members by Unit Type */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {language === 'es' ? 'Miembros del Equipo' : 'Team Members'}
            <span className="text-muted-foreground font-normal">({team.members.length})</span>
          </h3>
          
          {/* Core Members */}
          {coreMembers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-adaptativa-blue mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-adaptativa-blue" />
                Core Unit ({coreMembers.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coreMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2 bg-adaptativa-blue/5 rounded-lg border border-adaptativa-blue/10">
                    <div className="w-8 h-8 rounded-full bg-adaptativa-blue/20 flex items-center justify-center text-adaptativa-blue font-semibold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {language === 'es' ? member.roleEs : member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Extended Members */}
          {extendedMembers.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                Extended Unit ({extendedMembers.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {extendedMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground truncate">
                          {language === 'es' ? member.roleEs : member.role}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground truncate">
                          {language === 'es' ? member.areaEs : member.area}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        {teamSkills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              {language === 'es' ? 'Habilidades del Equipo' : 'Team Skills'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teamSkills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <span className="text-sm">{language === 'es' ? skill.nameEs : skill.name}</span>
                  <div className="flex items-center gap-2">
                    <SkillIndicator value={skill.initialValue} size="sm" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <SkillIndicator value={skill.currentValue} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function TrendIcon({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  if (trend === 'improving') return <TrendingUp className="h-3.5 w-3.5 text-status-success" />;
  if (trend === 'declining') return <TrendingDown className="h-3.5 w-3.5 text-status-critical" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

function TeamMetricsPanel({ metrics, language }: { metrics: TeamMetrics; language: 'en' | 'es' }) {
  const getHappinessColor = (v: number) => {
    if (v >= 8) return 'text-status-success';
    if (v >= 6) return 'text-status-warning';
    return 'text-status-critical';
  };

  const getHappinessEmoji = (v: number) => {
    if (v >= 8.5) return '😄';
    if (v >= 7) return '🙂';
    if (v >= 5) return '😐';
    return '😟';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'hsl(var(--status-success))';
    if (trend === 'declining') return 'hsl(var(--status-critical))';
    return 'hsl(var(--muted-foreground))';
  };

  const metricItems = [
    {
      icon: <Clock className="h-4 w-4" />,
      label: 'Lead Time',
      value: `${metrics.leadTime}d`,
      description: language === 'es' ? 'Idea → Entrega' : 'Idea → Delivery',
      trend: metrics.leadTimeTrend,
      dataKey: 'leadTime' as const,
      invertTrend: true,
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: 'Cycle Time',
      value: `${metrics.cycleTime}d`,
      description: language === 'es' ? 'Inicio → Hecho' : 'Start → Done',
      trend: metrics.cycleTimeTrend,
      dataKey: 'cycleTime' as const,
      invertTrend: true,
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: 'Throughput',
      value: `${metrics.throughput}`,
      description: language === 'es' ? 'Items / sprint' : 'Items / sprint',
      trend: metrics.throughputTrend,
      dataKey: 'throughput' as const,
      invertTrend: false,
    },
    {
      icon: <Gauge className="h-4 w-4" />,
      label: 'Velocity',
      value: `${metrics.velocity} pts`,
      description: language === 'es' ? 'Puntos / sprint' : 'Points / sprint',
      trend: metrics.velocityTrend,
      dataKey: 'velocity' as const,
      invertTrend: false,
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        {language === 'es' ? 'Métricas de Rendimiento' : 'Performance Metrics'}
      </h3>
      
      {/* Flow Metrics with sparklines */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {metricItems.map((item) => (
          <div key={item.label} className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{item.icon}</span>
              <TrendIcon trend={item.trend} />
            </div>
            <p className="text-xl font-bold tracking-tight">{item.value}</p>
            <p className="text-[11px] font-medium text-muted-foreground leading-tight">{item.label}</p>
            {/* Sparkline */}
            <div className="h-8 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.history}>
                  <defs>
                    <linearGradient id={`grad-${item.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={getTrendColor(item.trend)} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={getTrendColor(item.trend)} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey={item.dataKey}
                    stroke={getTrendColor(item.trend)}
                    strokeWidth={1.5}
                    fill={`url(#grad-${item.dataKey})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Happiness Index - featured card with chart */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">{getHappinessEmoji(metrics.happinessIndex)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Happiness Index</p>
              <TrendIcon trend={metrics.happinessTrend} />
            </div>
            <p className={cn("text-2xl font-bold", getHappinessColor(metrics.happinessIndex))}>
              {metrics.happinessIndex.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground"> / 10</span>
            </p>
          </div>
          {/* Mini bar */}
          <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                metrics.happinessIndex >= 8 ? "bg-status-success" :
                metrics.happinessIndex >= 6 ? "bg-status-warning" : "bg-status-critical"
              )}
              style={{ width: `${metrics.happinessIndex * 10}%` }}
            />
          </div>
        </div>
        {/* Happiness trend chart */}
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.history}>
              <defs>
                <linearGradient id="grad-happiness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--status-warning))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--status-warning))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <RechartsTooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [value.toFixed(1), 'Happiness']}
                labelFormatter={(label) => `Sprint ${label}`}
              />
              <Area
                type="monotone"
                dataKey="happinessIndex"
                stroke="hsl(var(--status-warning))"
                strokeWidth={2}
                fill="url(#grad-happiness)"
                dot={{ r: 2, fill: 'hsl(var(--status-warning))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
