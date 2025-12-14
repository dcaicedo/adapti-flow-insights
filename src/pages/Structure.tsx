import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  teams, 
  objectives, 
  dynamics, 
  strategicUnits, 
  keyResults,
  getObjectiveById, 
  getDynamicById, 
  getTeamById,
  getKeyResultsForObjective 
} from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  Network, 
  Target, 
  Users,
  ChevronRight,
  ChevronDown,
  Building2,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Structure() {
  const { t, language } = useLanguage();
  const [expandedDynamic, setExpandedDynamic] = useState<string | null>(null);
  const [expandedObjective, setExpandedObjective] = useState<string | null>(null);

  const colorBgs: Record<string, string> = {
    'adaptativa-blue': 'bg-adaptativa-blue',
    'culture-yellow': 'bg-culture-yellow',
    'business-cyan': 'bg-business-cyan',
    'structure-neutral': 'bg-structure-neutral',
    'entrepreneurship-green': 'bg-entrepreneurship-green',
  };

  const colorTexts: Record<string, string> = {
    'adaptativa-blue': 'text-adaptativa-blue',
    'culture-yellow': 'text-culture-yellow',
    'business-cyan': 'text-business-cyan',
    'structure-neutral': 'text-structure-neutral',
    'entrepreneurship-green': 'text-entrepreneurship-green',
  };

  const colorBgLight: Record<string, string> = {
    'adaptativa-blue': 'bg-adaptativa-blue/10',
    'culture-yellow': 'bg-culture-yellow/10',
    'business-cyan': 'bg-business-cyan/10',
    'structure-neutral': 'bg-structure-neutral/10',
    'entrepreneurship-green': 'bg-entrepreneurship-green/10',
  };

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
      className="p-6 lg:p-8 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
          <Network className="h-8 w-8 text-structure-neutral" />
          {t('structure.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'es' 
            ? 'Trazabilidad completa: Dinámicas → Objetivos → Resultados Clave → Equipos' 
            : 'Full traceability: Dynamics → Objectives → Key Results → Teams'}
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">{language === 'es' ? 'Dinámica Adaptativa' : 'Adaptive Dynamic'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">{language === 'es' ? 'Objetivo' : 'Objective'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-adaptativa-blue" />
          <span className="text-sm text-muted-foreground">{language === 'es' ? 'Resultado Clave' : 'Key Result'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{language === 'es' ? 'Equipo' : 'Team'}</span>
        </div>
      </motion.div>

      {/* Dynamics -> Objectives -> Key Results -> Teams */}
      <div className="space-y-4">
        {dynamics.map((dynamic) => {
          const dynamicObjectives = objectives.filter(obj => obj.dynamicId === dynamic.id);
          const isExpanded = expandedDynamic === dynamic.id;

          return (
            <motion.div key={dynamic.id} variants={itemVariants}>
              <Card className="shadow-sm overflow-hidden">
                {/* Dynamic Header */}
                <div 
                  className={cn("h-1", colorBgs[dynamic.color])}
                />
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedDynamic(isExpanded ? null : dynamic.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", colorBgLight[dynamic.color])}>
                        <Sparkles className={cn("h-5 w-5", colorTexts[dynamic.color])} />
                      </div>
                      <div>
                        <h3 className={cn("font-semibold", colorTexts[dynamic.color])}>
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
                          <div key={objective.id} className="bg-background rounded-lg border border-border overflow-hidden">
                            {/* Objective Header */}
                            <div 
                              className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                              onClick={() => setExpandedObjective(isObjExpanded ? null : objective.id)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <Target className={cn("h-5 w-5 mt-0.5", colorTexts[dynamic.color])} />
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
                                            <div className={cn("w-2 h-2 rounded-full mt-2", colorBgs[dynamic.color])} />
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

                                        <ProgressBar value={kr.progress} size="sm" showLabel />

                                        {/* Teams contributing */}
                                        <div className="mt-3 pt-3 border-t border-border">
                                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {language === 'es' ? 'Equipos contribuyentes:' : 'Contributing Teams:'}
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                            {krTeams.map(team => team && (
                                              <div 
                                                key={team.id}
                                                className={cn(
                                                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm",
                                                  team.unitType === 'core' 
                                                    ? "border-adaptativa-blue/30 bg-adaptativa-blue/5"
                                                    : "border-border bg-muted/30"
                                                )}
                                              >
                                                <Users className={cn(
                                                  "h-3 w-3",
                                                  team.unitType === 'core' ? "text-adaptativa-blue" : "text-muted-foreground"
                                                )} />
                                                <span className="font-medium">
                                                  {language === 'es' ? team.nameEs : team.name}
                                                </span>
                                                <span className={cn(
                                                  "text-xs px-1.5 py-0.5 rounded",
                                                  team.unitType === 'core' 
                                                    ? "bg-adaptativa-blue/10 text-adaptativa-blue"
                                                    : "bg-muted text-muted-foreground"
                                                )}>
                                                  {team.unitType === 'core' 
                                                    ? (language === 'es' ? 'Core' : 'Core')
                                                    : (language === 'es' ? 'Ext.' : 'Ext.')
                                                  }
                                                </span>
                                              </div>
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
                          <span 
                            key={team.id}
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              team.unitType === 'core' 
                                ? "bg-adaptativa-blue/10 text-adaptativa-blue"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {language === 'es' ? team.nameEs : team.name}
                          </span>
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
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer",
                    team.unitType === 'core'
                      ? "border-adaptativa-blue/30 bg-adaptativa-blue/5"
                      : "border-border bg-muted/30"
                  )}
                  style={{
                    width: `${100 + team.members.length * 2}px`,
                    height: `${100 + team.members.length * 2}px`,
                  }}
                >
                  <Users className={cn(
                    "h-6 w-6 mb-2",
                    team.unitType === 'core' ? "text-adaptativa-blue" : "text-muted-foreground"
                  )} />
                  <p className="text-sm font-medium text-center">
                    {language === 'es' ? team.nameEs : team.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{team.members.length}</p>
                  <span className={cn(
                    "text-xs mt-1 px-2 py-0.5 rounded-full",
                    team.unitType === 'core' 
                      ? "bg-adaptativa-blue/10 text-adaptativa-blue"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {team.unitType === 'core' ? 'Core' : 'Ext.'}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {language === 'es' 
                ? 'El tamaño representa el número de miembros. El color indica el tipo de unidad.'
                : 'Size represents team members. Color indicates unit type.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
