import { useLanguage } from '@/contexts/LanguageContext';
import { teams } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const TREND_ICON = {
  improving: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};
const TREND_COLOR = {
  improving: 'text-status-success',
  stable: 'text-muted-foreground',
  declining: 'text-status-critical',
};

export function MetricsComparison() {
  const { language } = useLanguage();

  const digitalTeams = teams.filter(t => t.teamCategory === 'digital-build' || t.teamCategory === 'digital-maintain');
  const businessTeams = teams.filter(t => !t.teamCategory);

  // Radar data: normalize metrics to 0-100 for comparison
  const maxThroughput = Math.max(...teams.map(t => t.metrics.throughput));
  const maxVelocity = Math.max(...teams.map(t => t.metrics.velocity));

  const radarData = [
    { metric: language === 'es' ? 'Throughput' : 'Throughput', ...Object.fromEntries(teams.slice(0, 6).map(t => [t.name, Math.round((t.metrics.throughput / maxThroughput) * 100)])) },
    { metric: language === 'es' ? 'Velocidad' : 'Velocity', ...Object.fromEntries(teams.slice(0, 6).map(t => [t.name, Math.round((t.metrics.velocity / maxVelocity) * 100)])) },
    { metric: 'Happinex', ...Object.fromEntries(teams.slice(0, 6).map(t => [t.name, Math.round(t.metrics.happinessIndex * 10)])) },
    { metric: language === 'es' ? 'Alineación' : 'Alignment', ...Object.fromEntries(teams.slice(0, 6).map(t => [t.name, t.alignment])) },
    { metric: language === 'es' ? 'Eficiencia' : 'Efficiency', ...Object.fromEntries(teams.slice(0, 6).map(t => [t.name, Math.max(0, 100 - (t.metrics.cycleTime * 5))])) },
  ];

  const radarColors = [
    'hsl(var(--adaptativa-blue))',
    'hsl(var(--culture-yellow))',
    'hsl(var(--business-blue))',
    'hsl(var(--structure-magenta))',
    'hsl(var(--entrepreneurship-green))',
    'hsl(var(--primary))',
  ];

  // DevOps comparison for digital teams
  const devOpsTeams = teams.filter(t => t.devOpsMetrics);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Team Radar */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {language === 'es' ? 'Comparación de Equipos' : 'Team Comparison'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                {teams.slice(0, 6).map((t, i) => (
                  <Radar
                    key={t.id}
                    name={language === 'es' ? t.nameEs : t.name}
                    dataKey={t.name}
                    stroke={radarColors[i]}
                    fill={radarColors[i]}
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                ))}
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* DevOps Metrics Comparison */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            🚀 {language === 'es' ? 'Métricas DevOps (Equipos Digitales)' : 'DevOps Metrics (Digital Teams)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devOpsTeams.map(team => {
              const dm = team.devOpsMetrics!;
              return (
                <div key={team.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{team.icon}</span>
                    <span className="font-semibold text-sm">{language === 'es' ? team.nameEs : team.name}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">
                      {team.teamCategory === 'digital-build' ? '🔨 Build' : '🔧 Maintain'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: language === 'es' ? 'Despliegues/día' : 'Deploys/day', value: dm.deploymentFrequency, trend: dm.deploymentFrequencyTrend, unit: '' },
                      { label: 'Lead Time', value: dm.leadTimeForChanges, trend: dm.leadTimeForChangesTrend, unit: 'h' },
                      { label: language === 'es' ? 'Tasa Fallo' : 'Failure Rate', value: dm.changeFailureRate, trend: dm.changeFailureRateTrend, unit: '%' },
                    ].map((m, i) => {
                      const TrendIcon = TREND_ICON[m.trend];
                      return (
                        <div key={i} className="bg-muted/40 rounded-md p-2">
                          <p className="text-[10px] text-muted-foreground">{m.label}</p>
                          <p className="text-lg font-bold">{m.value}{m.unit}</p>
                          <TrendIcon className={cn("h-3 w-3 mx-auto", TREND_COLOR[m.trend])} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
