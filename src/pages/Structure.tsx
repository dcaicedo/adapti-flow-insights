import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { teams, objectives } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  Network, 
  Target, 
  Users,
  ChevronRight,
  Building2,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Structure() {
  const { t, language } = useLanguage();

  // Strategic objectives (linking multiple teams)
  const strategicObjectives = [
    {
      id: 'strategic-1',
      title: 'Achieve Adaptive Organization Status',
      titleEs: 'Alcanzar el Estado de Organización Adaptativa',
      coreUnits: ['team-1', 'team-2'],
      extendedUnits: ['team-3', 'team-5'],
      progress: 72,
    },
    {
      id: 'strategic-2',
      title: 'Double Revenue While Maintaining Culture',
      titleEs: 'Duplicar Ingresos Manteniendo la Cultura',
      coreUnits: ['team-3', 'team-4'],
      extendedUnits: ['team-1', 'team-2'],
      progress: 58,
    },
    {
      id: 'strategic-3',
      title: 'Build Innovation-Driven Growth Engine',
      titleEs: 'Construir Motor de Crecimiento Basado en Innovación',
      coreUnits: ['team-5'],
      extendedUnits: ['team-4', 'team-3'],
      progress: 80,
    },
  ];

  const getTeamById = (id: string) => teams.find(t => t.id === id);

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
            ? 'Visualiza cómo los equipos contribuyen a los objetivos estratégicos' 
            : 'Visualize how teams contribute to strategic objectives'}
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div variants={itemVariants} className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-adaptativa-blue" />
          <span className="text-sm text-muted-foreground">{t('structure.coreUnits')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
          <span className="text-sm text-muted-foreground">{t('structure.extendedUnits')}</span>
        </div>
      </motion.div>

      {/* Strategic Objectives */}
      <div className="space-y-6">
        {strategicObjectives.map((strategic) => {
          const coreTeams = strategic.coreUnits.map(id => getTeamById(id)).filter(Boolean);
          const extendedTeams = strategic.extendedUnits.map(id => getTeamById(id)).filter(Boolean);

          return (
            <motion.div key={strategic.id} variants={itemVariants}>
              <Card className="shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-adaptativa-blue via-business-cyan to-entrepreneurship-green" />
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          {t('structure.strategicObjective')}
                        </p>
                        <CardTitle className="text-lg">
                          {language === 'es' ? strategic.titleEs : strategic.title}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{strategic.progress}%</p>
                      <p className="text-xs text-muted-foreground">{t('dynamics.progress')}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ProgressBar value={strategic.progress} showLabel={false} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Core Units */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-4 w-4 text-adaptativa-blue" />
                        <h4 className="font-semibold text-sm">{t('structure.coreUnits')}</h4>
                        <span className="text-xs text-muted-foreground">
                          ({language === 'es' ? 'Contribuidores principales' : 'Main contributors'})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {coreTeams.map(team => team && (
                          <div 
                            key={team.id}
                            className="flex items-center justify-between p-4 border-2 border-adaptativa-blue/20 bg-adaptativa-blue/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-adaptativa-blue/10 rounded-full">
                                <Users className="h-4 w-4 text-adaptativa-blue" />
                              </div>
                              <div>
                                <p className="font-medium">{language === 'es' ? team.nameEs : team.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {team.members} {language === 'es' ? 'miembros' : 'members'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-adaptativa-blue">{team.alignment}%</p>
                              <p className="text-xs text-muted-foreground">{t('teams.alignment')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extended Units */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold text-sm">{t('structure.extendedUnits')}</h4>
                        <span className="text-xs text-muted-foreground">
                          ({language === 'es' ? 'Contribuidores parciales' : 'Partial contributors'})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {extendedTeams.map(team => team && (
                          <div 
                            key={team.id}
                            className="flex items-center justify-between p-4 border border-border bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-muted rounded-full">
                                <Users className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{language === 'es' ? team.nameEs : team.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {team.members} {language === 'es' ? 'miembros' : 'members'}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Visual Structure Diagram */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'es' ? 'Visualización de Estructura' : 'Structure Visualization'}
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
                    team.alignment >= 80 
                      ? "border-status-success/30 bg-status-success/5" 
                      : team.alignment >= 60 
                        ? "border-status-warning/30 bg-status-warning/5"
                        : "border-status-critical/30 bg-status-critical/5"
                  )}
                  style={{
                    width: `${100 + team.members * 2}px`,
                    height: `${100 + team.members * 2}px`,
                  }}
                >
                  <Users className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-center">
                    {language === 'es' ? team.nameEs : team.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{team.members}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {language === 'es' 
                ? 'El tamaño representa el número de miembros. El color indica el nivel de alineación.'
                : 'Size represents team members. Color indicates alignment level.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}