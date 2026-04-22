import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, Legend, ComposedChart, Line,
} from 'recharts';
import { Layers, Zap, Activity, Flame } from 'lucide-react';
import type { DashboardContext } from './types';
import {
  generateCycleTimeDistribution,
  generateCumulativeFlowData,
  generateKanbanSnapshots,
  generateHeatmapData,
} from '@/data/metricsData';

const KANBAN_COLORS = {
  backlog: 'hsl(var(--muted-foreground) / 0.35)',
  todo: 'hsl(220 70% 55%)',
  inProgress: 'hsl(45 90% 50%)',
  review: 'hsl(280 60% 55%)',
  done: 'hsl(145 65% 42%)',
  blocked: 'hsl(0 70% 55%)',
};

const PERCENTILE_COLORS: Record<string, string> = {
  '≤P50': 'hsl(145 65% 42%)',
  'P50-P85': 'hsl(45 90% 50%)',
  'P85-P95': 'hsl(25 90% 55%)',
  '>P95': 'hsl(0 70% 55%)',
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 10,
  fontSize: 11,
  boxShadow: '0 8px 24px hsl(var(--foreground) / 0.08)',
};

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <CardHeader className="pb-2 pt-5 px-5">
      <CardTitle className="text-sm font-semibold flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
      <p className="text-[11px] text-muted-foreground">{subtitle}</p>
    </CardHeader>
  );
}

export function OperationalCharts({ team, filters, memberMetrics, language }: DashboardContext) {
  const [heatmapMetric, setHeatmapMetric] = useState<'itemsCompleted' | 'cycleTime'>('itemsCompleted');
  const m = team.metrics;
  const history = m.history;

  // Kanban current state
  const kanbanSnapshots = useMemo(
    () => generateKanbanSnapshots(history.map(h => h.throughput)),
    [history]
  );
  const currentKanban = kanbanSnapshots[kanbanSnapshots.length - 1];

  // Cumulative flow (independent, but aligned temporally to current sprint)
  const cumulativeFlow = useMemo(
    () => generateCumulativeFlowData(m.throughput * 3),
    [m.throughput]
  );

  // Cycle time distribution
  const cycleTimeDist = useMemo(
    () => generateCycleTimeDistribution(m.cycleTime, 50),
    [m.cycleTime]
  );
  const sorted = [...cycleTimeDist].sort((a, b) => a.cycleTime - b.cycleTime);
  const p50 = sorted[Math.floor(sorted.length * 0.5)]?.cycleTime ?? 0;
  const p85 = sorted[Math.floor(sorted.length * 0.85)]?.cycleTime ?? 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)]?.cycleTime ?? 0;

  // Heatmap
  const heatmapData = useMemo(
    () => memberMetrics.length ? generateHeatmapData(memberMetrics, heatmapMetric) : [],
    [memberMetrics, heatmapMetric]
  );

  // DevOps metrics
  const devOps = team.devOpsMetrics;
  const isDigital = team.teamCategory === 'digital-build' || team.teamCategory === 'digital-maintain';

  // Kanban board visual
  const kanbanColumns = currentKanban ? [
    { key: 'backlog', label: 'Backlog', count: currentKanban.backlog, color: KANBAN_COLORS.backlog },
    { key: 'todo', label: 'To Do', count: currentKanban.todo, color: KANBAN_COLORS.todo },
    { key: 'inProgress', label: language === 'es' ? 'En Progreso' : 'In Progress', count: currentKanban.inProgress, color: KANBAN_COLORS.inProgress },
    { key: 'review', label: language === 'es' ? 'Revisión' : 'Review', count: currentKanban.review, color: KANBAN_COLORS.review },
    { key: 'done', label: language === 'es' ? 'Hecho' : 'Done', count: currentKanban.done, color: KANBAN_COLORS.done },
    { key: 'blocked', label: language === 'es' ? 'Bloqueado' : 'Blocked', count: currentKanban.blocked, color: KANBAN_COLORS.blocked },
  ] : [];

  const totalItems = kanbanColumns.reduce((s, c) => s + c.count, 0);

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      {/* Row 1: Kanban Board + Metrics Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Kanban Board */}
        <Card className="shadow-sm border-border/60">
          <SectionTitle
            icon={<Layers className="h-4 w-4 text-primary" />}
            title={language === 'es' ? 'Tablero Kanban' : 'Kanban Board'}
            subtitle={language === 'es' ? 'Estado actual del flujo de trabajo' : 'Current workflow state'}
          />
          <CardContent className="px-5 pb-5">
            {/* Column bars */}
            <div className="flex gap-2 mb-4">
              {kanbanColumns.map(col => {
                const pct = totalItems ? (col.count / totalItems) * 100 : 0;
                return (
                  <div key={col.key} className="flex-1 text-center">
                    <div className="relative h-24 bg-muted/40 rounded-lg overflow-hidden flex items-end justify-center">
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{ height: `${Math.max(8, pct)}%`, backgroundColor: col.color }}
                      />
                    </div>
                    <p className="text-lg font-bold mt-1">{col.count}</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">{col.label}</p>
                  </div>
                );
              })}
            </div>
            {/* WIP insight */}
            {currentKanban && currentKanban.blocked > 1 && (
              <div className="flex items-center gap-2 text-[11px] text-status-critical bg-status-critical/5 border border-status-critical/20 rounded-lg px-3 py-2">
                <Flame className="h-3.5 w-3.5" />
                {language === 'es'
                  ? `${currentKanban.blocked} items bloqueados — posible cuello de botella`
                  : `${currentKanban.blocked} blocked items — potential bottleneck`}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flow Metrics Trend (Lead + Cycle + Throughput overlaid) */}
        <Card className="shadow-sm border-border/60">
          <SectionTitle
            icon={<Activity className="h-4 w-4 text-primary" />}
            title={language === 'es' ? 'Tendencia de Flujo' : 'Flow Trend'}
            subtitle={language === 'es' ? 'Lead Time, Cycle Time y Throughput por sprint' : 'Lead Time, Cycle Time & Throughput per sprint'}
          />
          <CardContent className="px-5 pb-5">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: language === 'es' ? 'Días' : 'Days', fontSize: 9, angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: 'Items', fontSize: 9, angle: 90, position: 'insideRight' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area yAxisId="time" type="monotone" dataKey="leadTime" name="Lead Time" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.08)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="time" type="monotone" dataKey="cycleTime" name="Cycle Time" stroke="hsl(var(--status-warning))" strokeWidth={2} dot={{ r: 3 }} />
                  <Bar yAxisId="count" dataKey="throughput" name="Throughput" fill="hsl(var(--status-success) / 0.4)" radius={[3, 3, 0, 0]} maxBarSize={24} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Cycle Time Distribution + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cycle Time Distribution */}
        <Card className="shadow-sm border-border/60">
          <SectionTitle
            icon={<Zap className="h-4 w-4 text-primary" />}
            title={language === 'es' ? 'Distribución Cycle Time' : 'Cycle Time Distribution'}
            subtitle={language === 'es' ? 'Percentiles: velocidad de entrega por item' : 'Percentiles: delivery speed per item'}
          />
          <CardContent className="px-5 pb-5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-success/10 text-status-success font-medium">P50: {p50.toFixed(1)}d</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-warning/10 text-status-warning font-medium">P85: {p85.toFixed(1)}d</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-critical/10 text-status-critical font-medium">P95: {p95.toFixed(1)}d</span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="id" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="number" dataKey="cycleTime" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}d`, 'Cycle Time']} />
                  <ReferenceLine y={p50} stroke="hsl(var(--status-success))" strokeDasharray="5 5" />
                  <ReferenceLine y={p85} stroke="hsl(var(--status-warning))" strokeDasharray="5 5" />
                  <ReferenceLine y={p95} stroke="hsl(var(--status-critical))" strokeDasharray="5 5" />
                  <Scatter data={cycleTimeDist}>
                    {cycleTimeDist.map((entry, i) => (
                      <Cell key={i} fill={PERCENTILE_COLORS[entry.percentile] || 'hsl(var(--primary))'} opacity={0.75} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-3 mt-2 justify-center">
              {Object.entries(PERCENTILE_COLORS).map(([k, c]) => (
                <span key={k} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} /> {k}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                {language === 'es' ? 'Mapa de Calor' : 'Activity Heatmap'}
              </CardTitle>
              <div className="flex gap-1">
                <button
                  onClick={() => setHeatmapMetric('itemsCompleted')}
                  className={cn("text-[9px] px-2 py-0.5 rounded-full font-medium transition-colors", heatmapMetric === 'itemsCompleted' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}
                >
                  {language === 'es' ? 'Items' : 'Items'}
                </button>
                <button
                  onClick={() => setHeatmapMetric('cycleTime')}
                  className={cn("text-[9px] px-2 py-0.5 rounded-full font-medium transition-colors", heatmapMetric === 'cycleTime' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}
                >
                  Cycle Time
                </button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {language === 'es' ? 'Actividad por miembro y día — identifica patrones' : 'Activity per member and day — identify patterns'}
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {memberMetrics.length > 0 ? (
              <HeatmapGrid data={heatmapData} members={memberMetrics} metric={heatmapMetric} />
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {language === 'es' ? 'Sin datos de miembros' : 'No member data'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Cumulative Flow (independent, visually separated) */}
      <Card className="shadow-sm border-2 border-dashed border-border/80 bg-card/80">
        <SectionTitle
          icon={<Layers className="h-4 w-4 text-primary" />}
          title={language === 'es' ? 'Flujo Acumulativo' : 'Cumulative Flow'}
          subtitle={language === 'es'
            ? 'Visualización independiente — bandas anchas = cuellos de botella'
            : 'Independent visualization — wide bands = bottlenecks'}
        />
        <CardContent className="px-5 pb-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeFlow} stackOffset="none">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="done" stackId="1" stroke="hsl(145 65% 42%)" fill="hsl(145 65% 42% / 0.55)" name={language === 'es' ? 'Hecho' : 'Done'} />
                <Area type="monotone" dataKey="review" stackId="1" stroke="hsl(280 60% 55%)" fill="hsl(280 60% 55% / 0.45)" name={language === 'es' ? 'Revisión' : 'Review'} />
                <Area type="monotone" dataKey="inProgress" stackId="1" stroke="hsl(45 90% 50%)" fill="hsl(45 90% 50% / 0.45)" name={language === 'es' ? 'En Progreso' : 'In Progress'} />
                <Area type="monotone" dataKey="todo" stackId="1" stroke="hsl(220 70% 55%)" fill="hsl(220 70% 55% / 0.35)" name="To Do" />
                <Area type="monotone" dataKey="backlog" stackId="1" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.15)" name="Backlog" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* DevOps Metrics for digital teams */}
      {isDigital && devOps && (
        <Card className="shadow-sm border-border/60">
          <SectionTitle
            icon={<span className="text-sm">🚀</span>}
            title="DevOps / DORA Metrics"
            subtitle={language === 'es' ? 'Métricas de entrega y estabilidad' : 'Delivery and stability metrics'}
          />
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: language === 'es' ? 'Frec. Deploy' : 'Deploy Freq.', value: `${devOps.deploymentFrequency}/d`, trend: devOps.deploymentFrequencyTrend, key: 'deploymentFrequency' },
                { label: language === 'es' ? 'Lead Cambios' : 'Change Lead', value: `${devOps.leadTimeForChanges}h`, trend: devOps.leadTimeForChangesTrend, key: 'leadTimeForChanges' },
                { label: language === 'es' ? 'Tasa Fallo' : 'Failure Rate', value: `${devOps.changeFailureRate}%`, trend: devOps.changeFailureRateTrend, key: 'changeFailureRate' },
              ].map(item => (
                <div key={item.key} className="p-3 rounded-xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 border border-violet-500/15">
                  <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                  <p className="text-xl font-bold mt-0.5">{item.value}</p>
                  <div className="h-8 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={devOps.history}>
                        <defs>
                          <linearGradient id={`devops-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey={item.key} stroke="hsl(var(--primary))" strokeWidth={1.5} fill={`url(#devops-${item.key})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

// Heatmap component
function HeatmapGrid({ data, members, metric }: { data: any[]; members: any[]; metric: string }) {
  if (!data.length || !members.length) return null;
  const days = members[0].daily.map((d: any) => d.day);
  const allValues = data.map(d => d.value);
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues);

  const getColor = (value: number) => {
    const ratio = maxVal === minVal ? 0.5 : (value - minVal) / (maxVal - minVal);
    if (metric === 'cycleTime') {
      const h = Math.round(145 - ratio * 145);
      return `hsl(${h} 65% 45% / ${0.3 + ratio * 0.5})`;
    }
    const h = Math.round(ratio * 145);
    return `hsl(${h} 65% 45% / ${0.3 + ratio * 0.5})`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="flex">
          <div className="w-16 shrink-0" />
          {days.map((day: string) => (
            <div key={day} className="flex-1 text-center text-[8px] text-muted-foreground font-medium px-0.5 truncate">
              {day.split(' ')[0]}
            </div>
          ))}
        </div>
        {members.slice(0, 8).map((member: any) => {
          const memberCells = data.filter(d => d.member === member.name.split(' ')[0]);
          return (
            <div key={member.memberId} className="flex items-center">
              <div className="w-16 shrink-0 text-[9px] text-muted-foreground truncate pr-1">{member.name.split(' ')[0]}</div>
              {days.map((day: string, i: number) => {
                const cell = memberCells[i];
                return (
                  <div
                    key={day}
                    className="flex-1 aspect-square m-0.5 rounded-sm flex items-center justify-center text-[7px] font-bold text-white/90"
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
