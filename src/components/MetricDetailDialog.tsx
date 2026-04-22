import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ReferenceLine, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Users, CalendarDays, Layers, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MetricsSnapshot, DevOpsSnapshot } from '@/data/demoData';
import { 
  generateCycleTimeDistribution, 
  generateCumulativeFlowData,
  generateTeamMemberMetrics,
  generateHeatmapData,
  type MemberMetrics,
} from '@/data/metricsData';
import { extractValues, computeStats, safePercentile, buildHistogramBins } from './metricCalculations';

interface MetricDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricKey: string;
  metricLabel: string;
  currentValue: string;
  trend: 'improving' | 'stable' | 'declining';
  history: MetricsSnapshot[] | DevOpsSnapshot[];
  dataKey: string;
  invertTrend?: boolean;
  unit?: string;
  language: 'en' | 'es';
  teamMembers?: { id: string; name: string }[];
  teamBaseCycle?: number;
  teamBaseLead?: number;
  teamBaseThroughput?: number;
  teamBaseVelocity?: number;
  teamBaseHappiness?: number;
}

const KANBAN_COLORS = {
  backlog: 'hsl(var(--muted-foreground) / 0.4)',
  todo: 'hsl(220 70% 55%)',
  inProgress: 'hsl(45 90% 50%)',
  review: 'hsl(280 60% 55%)',
  done: 'hsl(145 65% 42%)',
};

const CATEGORY_COLORS: Record<string, string> = {
  feature: 'hsl(220 70% 55%)',
  bug: 'hsl(0 70% 55%)',
  task: 'hsl(145 65% 42%)',
  spike: 'hsl(280 60% 55%)',
};

const PERCENTILE_COLORS: Record<string, string> = {
  '≤P50': 'hsl(145 65% 42%)',
  'P50-P85': 'hsl(45 90% 50%)',
  'P85-P95': 'hsl(25 90% 55%)',
  '>P95': 'hsl(0 70% 55%)',
};

export function MetricDetailDialog({
  open, onOpenChange, metricLabel, currentValue, trend, history, dataKey, invertTrend, unit, language,
  teamMembers, teamBaseCycle = 5, teamBaseLead = 12, teamBaseThroughput = 15, teamBaseVelocity = 40, teamBaseHappiness = 8,
}: MetricDetailDialogProps) {
  const [heatmapMetric, setHeatmapMetric] = useState<'itemsCompleted' | 'cycleTime'>('itemsCompleted');

  const trendColor = trend === 'improving' ? 'hsl(var(--status-success))' : 
    trend === 'declining' ? 'hsl(var(--status-critical))' : 'hsl(var(--muted-foreground))';

  const values = extractValues(history as Record<string, unknown>[], dataKey);
  const { avg, min, max, stdDev, lastVal, changePercent } = computeStats(values);
  const hasData = values.length > 0;

  // Cycle time distribution
  const cycleTimeDist = useMemo(() => generateCycleTimeDistribution(teamBaseCycle, 50), [teamBaseCycle]);
  const p50 = safePercentile(cycleTimeDist, 0.5);
  const p85 = safePercentile(cycleTimeDist, 0.85);
  const p95 = safePercentile(cycleTimeDist, 0.95);

  // Cumulative flow
  const cumulativeFlow = useMemo(() => generateCumulativeFlowData(teamBaseThroughput * 3), [teamBaseThroughput]);

  // Member metrics
  const memberMetrics = useMemo(() => {
    if (!teamMembers?.length) return [];
    return generateTeamMemberMetrics(teamMembers, teamBaseCycle, teamBaseLead, teamBaseThroughput, teamBaseVelocity, teamBaseHappiness);
  }, [teamMembers, teamBaseCycle, teamBaseLead, teamBaseThroughput, teamBaseVelocity, teamBaseHappiness]);

  // Heatmap
  const heatmapData = useMemo(() => {
    if (!memberMetrics.length) return [];
    return generateHeatmapData(memberMetrics, heatmapMetric);
  }, [memberMetrics, heatmapMetric]);

  // Histogram bins
  const binCount = 6;
  const binWidth = (max - min) / binCount || 1;
  const bins = Array.from({ length: binCount }, (_, i) => {
    const lo = min + i * binWidth;
    const hi = lo + binWidth;
    const count = values.filter(v => v >= lo && (i === binCount - 1 ? v <= hi : v < hi)).length;
    return { range: `${lo.toFixed(1)}–${hi.toFixed(1)}`, count, lo, hi };
  });

  // Prepare member bar data sorted by relevant metric
  const memberBarData = useMemo(() => {
    const key = dataKey === 'cycleTime' ? 'avgCycleTime' :
                dataKey === 'leadTime' ? 'avgLeadTime' :
                dataKey === 'throughput' ? 'throughput' :
                dataKey === 'velocity' ? 'velocity' :
                dataKey === 'happinessIndex' ? 'happiness' : 'throughput';
    return [...memberMetrics]
      .sort((a, b) => (b as any)[key] - (a as any)[key])
      .map(m => ({
        name: m.name.split(' ').map(n => n[0]).join('') + ' ' + m.name.split(' ')[1]?.slice(0, 3),
        fullName: m.name,
        value: (m as any)[key],
        happiness: m.happiness,
      }));
  }, [memberMetrics, dataKey]);

  // Daily aggregated data
  const dailyAggregated = useMemo(() => {
    if (!memberMetrics.length) return [];
    const dayMap: Record<string, { items: number; cycleTimes: number[]; count: number }> = {};
    memberMetrics.forEach(m => {
      m.daily.forEach(d => {
        if (!dayMap[d.day]) dayMap[d.day] = { items: 0, cycleTimes: [], count: 0 };
        dayMap[d.day].items += d.itemsCompleted;
        dayMap[d.day].cycleTimes.push(d.cycleTime);
        dayMap[d.day].count++;
      });
    });
    return Object.entries(dayMap).map(([day, data]) => ({
      day,
      itemsCompleted: data.items,
      avgCycleTime: +(data.cycleTimes.reduce((a, b) => a + b, 0) / data.cycleTimes.length).toFixed(1),
    }));
  }, [memberMetrics]);

  const hasMemberData = memberMetrics.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <span className="text-lg">{metricLabel}</span>
            <span className="text-2xl font-bold">{currentValue}</span>
            {trend === 'improving' && <TrendingUp className="h-5 w-5 text-status-success" />}
            {trend === 'declining' && <TrendingDown className="h-5 w-5 text-status-critical" />}
            {trend === 'stable' && <Minus className="h-5 w-5 text-muted-foreground" />}
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              Number(changePercent) > 0 ? "bg-status-success/10 text-status-success" :
              Number(changePercent) < 0 ? "bg-status-critical/10 text-status-critical" :
              "bg-muted text-muted-foreground"
            )}>
              {Number(changePercent) > 0 ? '+' : ''}{changePercent}% vs prev
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Stats summary */}
        <div className="grid grid-cols-5 gap-2 my-2">
          {[
            { label: language === 'es' ? 'Promedio' : 'Average', value: avg.toFixed(1) },
            { label: 'Min', value: min.toFixed(1) },
            { label: 'Max', value: max.toFixed(1) },
            { label: language === 'es' ? 'Desv. Est.' : 'Std Dev', value: stdDev.toFixed(2) },
            { label: language === 'es' ? 'Último' : 'Latest', value: lastVal.toFixed(1) },
          ].map(s => (
            <div key={s.label} className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-sm font-bold">{s.value}{unit ? ` ${unit}` : ''}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="trend" className="mt-2">
          <TabsList className="flex flex-wrap w-full h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="trend" className="text-xs flex items-center gap-1">
              <Activity className="h-3 w-3" /> {language === 'es' ? 'Tendencia' : 'Trend'}
            </TabsTrigger>
            <TabsTrigger value="distribution" className="text-xs flex items-center gap-1">
              <Layers className="h-3 w-3" /> {language === 'es' ? 'Distribución' : 'Distribution'}
            </TabsTrigger>
            <TabsTrigger value="cumulative" className="text-xs flex items-center gap-1">
              <Layers className="h-3 w-3" /> {language === 'es' ? 'Flujo Acumulado' : 'Cumulative Flow'}
            </TabsTrigger>
            {hasMemberData && (
              <TabsTrigger value="members" className="text-xs flex items-center gap-1">
                <Users className="h-3 w-3" /> {language === 'es' ? 'Miembros' : 'Members'}
              </TabsTrigger>
            )}
            {hasMemberData && (
              <TabsTrigger value="daily" className="text-xs flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> {language === 'es' ? 'Diario' : 'Daily'}
              </TabsTrigger>
            )}
          </TabsList>

          {/* === TREND === */}
          <TabsContent value="trend" className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              {language === 'es' ? 'Evolución por sprint con promedio y banda ±1σ' : 'Sprint evolution with average and ±1σ band'}
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: 8, fontSize: 12 
                    }} 
                  />
                  <ReferenceLine y={avg} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: `μ ${avg.toFixed(1)}`, fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <ReferenceLine y={avg + stdDev} stroke="hsl(var(--muted-foreground) / 0.3)" strokeDasharray="3 3" />
                  <ReferenceLine y={Math.max(0, avg - stdDev)} stroke="hsl(var(--muted-foreground) / 0.3)" strokeDasharray="3 3" />
                  <defs>
                    <linearGradient id="metric-grad-trend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={trendColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={trendColor} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey={dataKey} stroke={trendColor} strokeWidth={2.5} fill="url(#metric-grad-trend)" dot={{ r: 4, fill: trendColor, strokeWidth: 2, stroke: 'hsl(var(--background))' }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* === CYCLE TIME DISTRIBUTION (Scatter with percentile coloring) === */}
          <TabsContent value="distribution" className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              {language === 'es' 
                ? 'Distribución de tiempos de ciclo por tipo de item con percentiles (P50/P85/P95)' 
                : 'Cycle time distribution by item type with percentiles (P50/P85/P95)'}
            </p>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-success/10 text-status-success">P50: {p50}d</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-warning/10 text-status-warning">P85: {p85}d</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-critical/10 text-status-critical">P95: {p95}d</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="id" name="Item #" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: language === 'es' ? 'Items (ordenados)' : 'Items (sorted)', fontSize: 10, position: 'bottom' }} />
                  <YAxis type="number" dataKey="cycleTime" name="Cycle Time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: language === 'es' ? 'Tiempo de Ciclo (d)' : 'Cycle Time (d)', fontSize: 10, angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                    formatter={(value: number, name: string) => {
                      if (name === 'Cycle Time') return [`${value}d`, language === 'es' ? 'Tiempo de Ciclo' : 'Cycle Time'];
                      return [value, name];
                    }}
                    labelFormatter={() => ''}
                  />
                  <ReferenceLine y={p50} stroke="hsl(var(--status-success))" strokeDasharray="5 5" label={{ value: 'P50', fontSize: 9, fill: 'hsl(var(--status-success))' }} />
                  <ReferenceLine y={p85} stroke="hsl(var(--status-warning))" strokeDasharray="5 5" label={{ value: 'P85', fontSize: 9, fill: 'hsl(var(--status-warning))' }} />
                  <ReferenceLine y={p95} stroke="hsl(var(--status-critical))" strokeDasharray="5 5" label={{ value: 'P95', fontSize: 9, fill: 'hsl(var(--status-critical))' }} />
                  <Scatter data={cycleTimeDist} fill="hsl(var(--primary))">
                    {cycleTimeDist.map((entry, index) => (
                      <Cell key={index} fill={PERCENTILE_COLORS[entry.percentile] || 'hsl(var(--primary))'} opacity={0.7} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {/* Category legend */}
            <div className="flex gap-4 mt-2 justify-center flex-wrap">
              {Object.entries(PERCENTILE_COLORS).map(([k, c]) => (
                <span key={k} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} /> {k}
                </span>
              ))}
            </div>
          </TabsContent>

          {/* === CUMULATIVE FLOW DIAGRAM (Independent) === */}
          <TabsContent value="cumulative" className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">
              {language === 'es' 
                ? 'Flujo acumulado independiente — visualiza el estado del trabajo a través de etapas Kanban' 
                : 'Independent cumulative flow — visualizes work state across Kanban stages'}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mb-3">
              {language === 'es' 
                ? 'Bandas anchas = cuellos de botella. Bandas convergentes = flujo estable.' 
                : 'Wide bands = bottlenecks. Converging bands = healthy flow.'}
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeFlow} stackOffset="none">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: language === 'es' ? 'Items' : 'Items', fontSize: 10, angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="done" stackId="1" stroke="hsl(145 65% 42%)" fill="hsl(145 65% 42% / 0.6)" name={language === 'es' ? 'Hecho' : 'Done'} />
                  <Area type="monotone" dataKey="review" stackId="1" stroke="hsl(280 60% 55%)" fill="hsl(280 60% 55% / 0.5)" name={language === 'es' ? 'Revisión' : 'Review'} />
                  <Area type="monotone" dataKey="inProgress" stackId="1" stroke="hsl(45 90% 50%)" fill="hsl(45 90% 50% / 0.5)" name={language === 'es' ? 'En Progreso' : 'In Progress'} />
                  <Area type="monotone" dataKey="todo" stackId="1" stroke="hsl(220 70% 55%)" fill="hsl(220 70% 55% / 0.4)" name={language === 'es' ? 'Por Hacer' : 'To Do'} />
                  <Area type="monotone" dataKey="backlog" stackId="1" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.2)" name="Backlog" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* === MEMBER BREAKDOWN === */}
          {hasMemberData && (
            <TabsContent value="members" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                {language === 'es' 
                  ? 'Desglose por miembro del equipo — rendimiento individual comparado' 
                  : 'Per-member breakdown — individual performance compared'}
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberBarData} layout="vertical" margin={{ left: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={55} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                      formatter={(value: number) => [unit ? `${value} ${unit}` : value, metricLabel]}
                      labelFormatter={(label) => {
                        const m = memberBarData.find(d => d.name === label);
                        return m?.fullName || label;
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={20}>
                      {memberBarData.map((entry, index) => {
                        const ratio = entry.value / (memberBarData[0]?.value || 1);
                        const hue = ratio > 0.8 ? 145 : ratio > 0.5 ? 45 : 0;
                        return <Cell key={index} fill={`hsl(${hue} 65% 50% / 0.7)`} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Happiness sparkline per member */}
              <div className="mt-4 space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                  {language === 'es' ? 'Índice de Felicidad por Miembro' : 'Happiness Index per Member'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {memberMetrics.slice(0, 6).map(m => (
                    <div key={m.memberId} className="flex items-center gap-2 p-1.5 rounded-lg bg-muted/30">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {m.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium truncate">{m.name.split(' ')[0]}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                m.happiness >= 8 ? "bg-status-success" : m.happiness >= 6 ? "bg-status-warning" : "bg-status-critical"
                              )}
                              style={{ width: `${m.happiness * 10}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">{m.happiness.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {/* === DAILY BREAKDOWN === */}
          {hasMemberData && (
            <TabsContent value="daily" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                {language === 'es' 
                  ? 'Actividad diaria del equipo — items completados y tiempo de ciclo promedio' 
                  : 'Daily team activity — items completed and average cycle time'}
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyAggregated}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar yAxisId="left" dataKey="itemsCompleted" name={language === 'es' ? 'Items Completados' : 'Items Completed'} fill="hsl(var(--primary) / 0.7)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Line yAxisId="right" type="monotone" dataKey="avgCycleTime" name={language === 'es' ? 'Ciclo Prom. (d)' : 'Avg Cycle (d)'} stroke="hsl(var(--status-warning))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--status-warning))' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Heatmap: Member × Day */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {language === 'es' ? 'Mapa de Calor: Miembro × Día' : 'Heatmap: Member × Day'}
                  </p>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setHeatmapMetric('itemsCompleted')}
                      className={cn("text-[9px] px-2 py-0.5 rounded-full", heatmapMetric === 'itemsCompleted' ? 'bg-primary text-primary-foreground' : 'bg-muted')}
                    >
                      {language === 'es' ? 'Items' : 'Items'}
                    </button>
                    <button 
                      onClick={() => setHeatmapMetric('cycleTime')}
                      className={cn("text-[9px] px-2 py-0.5 rounded-full", heatmapMetric === 'cycleTime' ? 'bg-primary text-primary-foreground' : 'bg-muted')}
                    >
                      {language === 'es' ? 'Ciclo' : 'Cycle'}
                    </button>
                  </div>
                </div>
                <HeatmapGrid data={heatmapData} members={memberMetrics} metric={heatmapMetric} />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function HeatmapGrid({ data, members, metric }: { data: any[]; members: MemberMetrics[]; metric: string }) {
  if (!data.length || !members.length) return null;

  const days = members[0].daily.map(d => d.day);
  const allValues = data.map(d => d.value);
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues);

  const getColor = (value: number) => {
    const ratio = maxVal === minVal ? 0.5 : (value - minVal) / (maxVal - minVal);
    if (metric === 'cycleTime') {
      // For cycle time, lower is better (green), higher is worse (red)
      const h = Math.round(145 - ratio * 145); // 145(green) → 0(red)
      return `hsl(${h} 65% 45% / ${0.3 + ratio * 0.5})`;
    }
    // For items completed, higher is better
    const h = Math.round(ratio * 145); // 0(red) → 145(green)
    return `hsl(${h} 65% 45% / ${0.3 + ratio * 0.5})`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Header */}
        <div className="flex">
          <div className="w-16 shrink-0" />
          {days.map(day => (
            <div key={day} className="flex-1 text-center text-[8px] text-muted-foreground font-medium px-0.5 truncate">
              {day.split(' ')[0]}
            </div>
          ))}
        </div>
        {/* Rows */}
        {members.slice(0, 8).map(member => {
          const memberCells = data.filter(d => d.member === member.name.split(' ')[0]);
          return (
            <div key={member.memberId} className="flex items-center">
              <div className="w-16 shrink-0 text-[9px] text-muted-foreground truncate pr-1">
                {member.name.split(' ')[0]}
              </div>
              {days.map((day, i) => {
                const cell = memberCells[i];
                return (
                  <div
                    key={day}
                    className="flex-1 aspect-square m-0.5 rounded-sm flex items-center justify-center text-[8px] font-bold text-white/90"
                    style={{ backgroundColor: cell ? getColor(cell.value) : 'hsl(var(--muted))' }}
                    title={`${member.name} - ${day}: ${cell?.value || 0}`}
                  >
                    {cell?.value || ''}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
