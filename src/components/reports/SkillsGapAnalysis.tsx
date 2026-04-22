import { useLanguage } from '@/contexts/LanguageContext';
import { teams, skills, dynamics, objectives, keyResults } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

export function SkillsGapAnalysis() {
  const { language } = useLanguage();

  // Skills gap data
  const skillsData = skills.map(s => {
    const team = teams.find(t => t.id === s.teamId);
    return {
      name: language === 'es' ? s.nameEs : s.name,
      team: team ? (language === 'es' ? team.nameEs : team.name) : '',
      initial: s.initialValue,
      current: s.currentValue,
      gap: 5 - s.currentValue,
      growth: s.currentValue - s.initialValue,
    };
  }).sort((a, b) => b.gap - a.gap);

  // Risk analysis
  const riskData = [
    {
      label: language === 'es' ? 'Objetivos Críticos' : 'Critical Objectives',
      count: objectives.filter(o => o.status === 'critical').length,
      type: 'critical' as const,
    },
    {
      label: language === 'es' ? 'Habilidades en Declive' : 'Declining Skills',
      count: skills.filter(s => s.currentValue < s.initialValue).length,
      type: 'critical' as const,
    },
    {
      label: language === 'es' ? 'Desalineaciones' : 'Misalignments',
      count: Math.max(0, skills.filter(s => s.currentValue > s.initialValue).length - objectives.filter(o => o.status === 'on-track').length),
      type: 'warning' as const,
    },
    {
      label: language === 'es' ? 'Equipos con Happinex < 7.5' : 'Teams with Happinex < 7.5',
      count: teams.filter(t => t.metrics.happinessIndex < 7.5).length,
      type: 'warning' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Skills Gap Chart */}
      <Card className="shadow-sm lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {language === 'es' ? 'Brecha de Habilidades por Equipo' : 'Skills Gap by Team'}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {language === 'es' ? 'Distancia al nivel objetivo (5)' : 'Distance to target level (5)'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} className="fill-muted-foreground" width={115} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'current') return [value, language === 'es' ? 'Actual' : 'Current'];
                    return [value, language === 'es' ? 'Brecha' : 'Gap'];
                  }}
                />
                <ReferenceLine x={3} stroke="hsl(var(--status-warning))" strokeDasharray="3 3" label={{ value: language === 'es' ? 'Mínimo' : 'Minimum', position: 'top', fontSize: 10 }} />
                <Bar dataKey="current" stackId="a" radius={[0, 0, 0, 0]}>
                  {skillsData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.current >= 4 ? 'hsl(var(--status-success))' : entry.current >= 3 ? 'hsl(var(--status-warning))' : 'hsl(var(--status-critical))'}
                    />
                  ))}
                </Bar>
                <Bar dataKey="gap" stackId="a" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Indicators */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-warning" />
            {language === 'es' ? 'Indicadores de Riesgo' : 'Risk Indicators'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskData.map((risk, i) => (
            <div
              key={i}
              className={cn(
                "p-3 rounded-lg border",
                risk.type === 'critical' ? "bg-status-critical/5 border-status-critical/20" : "bg-status-warning/5 border-status-warning/20"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{risk.label}</span>
                {risk.count > 0 ? (
                  <span className={cn(
                    "text-2xl font-bold",
                    risk.type === 'critical' ? 'text-status-critical' : 'text-status-warning'
                  )}>{risk.count}</span>
                ) : (
                  <CheckCircle className="h-6 w-6 text-status-success" />
                )}
              </div>
            </div>
          ))}

          {/* Core vs Extended Summary */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs font-medium mb-2">
              {language === 'es' ? 'Distribución Core vs Extended' : 'Core vs Extended Distribution'}
            </p>
            {(() => {
              const totalCore = teams.reduce((s, t) => s + t.members.filter(m => m.unitType === 'core').length, 0);
              const totalExt = teams.reduce((s, t) => s + t.members.filter(m => m.unitType === 'extended').length, 0);
              const total = totalCore + totalExt;
              const corePct = Math.round((totalCore / total) * 100);
              return (
                <>
                  <div className="flex h-3 rounded-full overflow-hidden mb-1.5">
                    <div className="bg-status-success" style={{ width: `${corePct}%` }} />
                    <div className="bg-status-warning" style={{ width: `${100 - corePct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Core: {totalCore} ({corePct}%)</span>
                    <span>Extended: {totalExt} ({100 - corePct}%)</span>
                  </div>
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
