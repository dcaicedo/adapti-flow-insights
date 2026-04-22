import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  teams, 
  objectives, 
  dynamics, 
  strategicUnits, 
  getKeyResultsForObjective, 
  getTeamById 
} from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DynamicBadge } from '@/components/ui/DynamicBadge';
import { getDynamicColorClasses, getTeamColor } from '@/utils/dynamicColors';
import { 
  Network, 
  Target, 
  Users,
  ChevronRight,
  ChevronDown,
  Building2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Structure() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [expandedDynamic, setExpandedDynamic] = useState<string | null>(null);
  const [expandedObjective, setExpandedObjective] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
          <Network className="h-8 w-8 text-structure-magenta" />
          {language === 'es' ? 'Estructura Adaptativa' : 'Adaptive Structure'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'es' 
            ? 'Trazabilidad completa: Dinámicas → Objetivos → Resultados Clave → Equipos' 
            : 'Full traceability: Dynamics → Objectives → Key Results → Teams'}
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
        {dynamics.map(dynamic => {
          const colors = getDynamicColorClasses(dynamic.color);
          return (
            <div key={dynamic.id} className="flex items-center gap-2">
              <span className="text-lg">{dynamic.icon}</span>
              <span className={cn("text-sm font-medium", colors.text)}>
                {language === 'es' ? dynamic.nameEs : dynamic.name}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Dynamics -> Objectives -> Key Results -> Teams */}
      <div className="space-y-4">
        {dynamics.map((dynamic) => {
          const dynamicObjectives = objectives.filter(obj => obj.dynamicId === dynamic.id);
          const isExpanded = expandedDynamic === dynamic.id;
          const colors = getDynamicColorClasses(dynamic.color);

          return (
            <motion.div key={dynamic.id} variants={itemVariants}>
              <Card className="shadow-sm overflow-hidden">
                {/* Dynamic Header - Color indicator */}
                <div className={cn("h-1.5", colors.bg)} />
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedDynamic(isExpanded ? null : dynamic.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", colors.bgLight)}>
                        <span className="text-xl">{dynamic.icon}</span>
                      </div>
                      <div>
                        <h3 className={cn("font-semibold", colors.text)}>
                          {language === 'es' ? dynamic.nameEs : dynamic.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dynamicObjectives.length} {language === 'es' ? 'objetivos' : 'objectives'} • {dynamic.progress}% {language === 'es' ? 'progreso' : 'progress'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block w-32">
                        <ProgressBar value={dynamic.progress} color={dynamic.color} size="sm" showLabel={false} />
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded: Objectives */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-border"
                  >
                    <div className="p-4 space-y-4 bg-muted/20">
                      {dynamicObjectives.map((objective) => {
                        const objKeyResults = getKeyResultsForObjective(objective.id);
                        const isObjExpanded = expandedObjective === objective.id;

                        return (
                          <div key={objective.id} className={cn("bg-background rounded-lg border overflow-hidden", colors.border, "border-opacity-30")}>
                            {/* Objective Header */}
                            <div 
                              className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                              onClick={() => setExpandedObjective(isObjExpanded ? null : objective.id)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <Target className={cn("h-5 w-5 mt-0.5", colors.text)} />
                                  <div>
                                    <h4 className="font-medium text-foreground">
                                      {language === 'es' ? objective.titleEs : objective.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {objKeyResults.length} {language === 'es' ? 'Resultados Clave' : 'Key Results'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <StatusBadge status={objective.status} size="sm" />
                                  <span className="text-sm font-medium">{objective.progress}%</span>
                                  {isObjExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Expanded: Key Results */}
                            {isObjExpanded && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-t border-border bg-muted/30"
                              >
                                <div className="p-4 space-y-3">
                                  {objKeyResults.map((kr) => {
                                    const krTeams = kr.teamIds.map(id => getTeamById(id)).filter(Boolean);

                                    return (
                                      <div key={kr.id} className="bg-background p-4 rounded-lg border border-border">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                          <div className="flex items-start gap-2">
                                            <div className={cn("w-2 h-2 rounded-full mt-2", colors.bg)} />
                                            <div>
                                              <p className="font-medium text-sm">
                                                {language === 'es' ? kr.titleEs : kr.title}
                                              </p>
                                              <p className="text-xs text-muted-foreground mt-1">
                                                {language === 'es' ? kr.descriptionEs : kr.description}
                                              </p>
                                            </div>
                                          </div>
                                          <StatusBadge status={kr.status} size="sm" />
                                        </div>

                                        <ProgressBar value={kr.progress} color={dynamic.color} size="sm" showLabel />

                                        {/* Teams contributing */}
                                        <div className="mt-3 pt-3 border-t border-border">
                                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {krTeams.length} {language === 'es' ? 'Equipos contribuyentes:' : 'Contributing Teams:'}
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                            {krTeams.map(team => team && (
                                              <Button
                                                key={team.id}
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  navigate(`/teams?highlight=${team.id}&kr=${kr.id}`);
                                                }}
                                                className={cn(
                                                  "h-8 gap-1.5 hover:bg-primary/10 hover:border-primary",
                                                  team.unitType === 'core' 
                                                    ? "border-adaptativa-blue/30 bg-adaptativa-blue/5"
                                                    : "border-border bg-muted/30"
                                                )}
                                              >
                                                <span className="text-base">{team.icon}</span>
                                                <span className="font-medium">
                                                  {language === 'es' ? team.nameEs : team.name}
                                                </span>
                                                <span className={cn(
                                                  "text-xs px-1.5 py-0.5 rounded",
                                                  team.unitType === 'core' 
                                                    ? "bg-adaptativa-blue/10 text-adaptativa-blue"
                                                    : "bg-muted text-muted-foreground"
                                                )}>
                                                  {team.unitType === 'core' ? 'Core' : 'Ext.'}
                                                </span>
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Strategic Units Overview */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              {language === 'es' ? 'Unidades Estratégicas' : 'Strategic Units'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategicUnits.map(unit => {
                const unitTeams = teams.filter(t => t.parentUnitIds.includes(unit.id));
                const coreTeams = unitTeams.filter(t => t.unitType === 'core');
                const extendedTeams = unitTeams.filter(t => t.unitType === 'extended');

                return (
                  <div key={unit.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h4 className="font-semibold mb-1">{language === 'es' ? unit.nameEs : unit.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === 'es' ? unit.descriptionEs : unit.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-adaptativa-blue" />
                        <span className="text-xs text-muted-foreground">
                          {coreTeams.length} {language === 'es' ? 'Unidades Core' : 'Core Units'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        <span className="text-xs text-muted-foreground">
                          {extendedTeams.length} {language === 'es' ? 'Unidades Extendidas' : 'Extended Units'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-1">
                        {unitTeams.map(team => (
                          <Button
                            key={team.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/teams?highlight=${team.id}`)}
                            className={cn(
                              "h-auto py-0.5 px-2 text-xs",
                              team.unitType === 'core' 
                                ? "bg-adaptativa-blue/10 text-adaptativa-blue hover:bg-adaptativa-blue/20"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                          >
                            <span className="mr-1">{team.icon}</span>
                            {language === 'es' ? team.nameEs : team.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Distribution Visualization */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'es' ? 'Distribución de Equipos' : 'Team Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4 p-6">
              {teams.map((team, index) => {
                const teamColor = getTeamColor(team.id);
                const colors = getDynamicColorClasses(teamColor);

                return (
                  <motion.div
                    key={team.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/teams?highlight=${team.id}`)}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer",
                      team.unitType === 'core'
                        ? cn("border-opacity-30", colors.border, colors.bgLight)
                        : "border-border bg-muted/30"
                    )}
                    style={{
                      width: `${100 + team.members.length * 2}px`,
                      height: `${100 + team.members.length * 2}px`,
                    }}
                  >
                    <span className="text-2xl mb-2">{team.icon}</span>
                    <p className="text-sm font-medium text-center">
                      {language === 'es' ? team.nameEs : team.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{team.members.length} {language === 'es' ? 'miembros' : 'members'}</p>
                    <span className={cn(
                      "text-xs mt-1 px-2 py-0.5 rounded-full",
                      team.unitType === 'core' 
                        ? cn(colors.bgLight, colors.text)
                        : "bg-muted text-muted-foreground"
                    )}>
                      {team.unitType === 'core' ? 'Core' : 'Ext.'}
                    </span>
                    <ExternalLink className="h-3 w-3 mt-2 text-muted-foreground" />
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {language === 'es' 
                ? 'El tamaño representa el número de miembros. Haz clic para ver detalles del equipo.'
                : 'Size represents team members. Click to view team details.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
