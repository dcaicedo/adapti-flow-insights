import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Zap, BarChart3, AlertTriangle, Gauge } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import type { DashboardContext } from './types';

function TrendBadge({ trend, value }: { trend: 'improving' | 'stable' | 'declining'; value: string }) {
  const config = {
    improving: { icon: TrendingUp, color: 'text-status-success bg-status-success/10', prefix: '+' },
    declining: { icon: TrendingDown, color: 'text-status-critical bg-status-critical/10', prefix: '' },
    stable: { icon: Minus, color: 'text-muted-foreground bg-muted', prefix: '' },
  }[trend];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full", config.color)}>
      <Icon className="h-3 w-3" />
      {config.prefix}{value}
    </span>
  );
}

function HappinexKPI({ value, trend, history, language }: { value: number; trend: string; history: any[]; language: string }) {
  const emoji = value >= 8.5 ? '😄' : value >= 7 ? '🙂' : value >= 5 ? '😐' : '😟';
  const color = value >= 8 ? 'hsl(var(--status-success))' : value >= 6 ? 'hsl(var(--status-warning))' : 'hsl(var(--status-critical))';
  const barColor = value >= 8 ? 'bg-status-success' : value >= 6 ? 'bg-status-warning' : 'bg-status-critical';
  const interpretation = value >= 8.5 
    ? (language === 'es' ? 'Equipo muy motivado' : 'Highly motivated team')
    : value >= 7 
    ? (language === 'es' ? 'Buen ambiente' : 'Good atmosphere')
    : value >= 5 
    ? (language === 'es' ? 'Requiere atención' : 'Needs attention')
    : (language === 'es' ? '⚠️ Acción urgente' : '⚠️ Urgent action needed');

  return (
    <Card className="shadow-sm border-border/60 col-span-2">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Happinex Index</p>
                <p className="text-2xl font-bold tracking-tight" style={{ color }}>{value.toFixed(1)}<span className="text-sm font-normal text-muted-foreground"> / 10</span></p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{interpretation}</p>
            {/* Bar */}
            <div className="mt-2">
              <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${value * 10}%` }} />
              </div>
              <div className="flex justify-between mt-0.5 px-0.5">
                {[0, 5, 10].map(v => (
                  <span key={v} className="text-[8px] text-muted-foreground">{v}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Sparkline */}
          <div className="w-28 h-14">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="happinex-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <YAxis domain={[0, 10]} hide />
                <Area type="monotone" dataKey="happinessIndex" stroke={color} strokeWidth={2} fill="url(#happinex-grad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ExecutiveKPIs({ team, filters, memberMetrics, language }: DashboardContext) {
  const m = team.metrics;
  const history = m.history;
  
  const blockedItems = useMemo(() => {
    // Derive from kanban data
    const throughputHistory = history.map(h => h.throughput);
    const lastThroughput = throughputHistory[throughputHistory.length - 1] || 0;
    return Math.max(0, Math.round(lastThroughput * 0.12));
  }, [history]);

  const throughputChange = useMemo(() => {
    if (history.length < 2) return '0%';
    const prev = history[history.length - 2]?.throughput || 1;
    const curr = history[history.length - 1]?.throughput || 0;
    const pct = Math.round(((curr - prev) / prev) * 100);
    return `${pct}%`;
  }, [history]);

  const trendColor = (t: string) =>
    t === 'improving' ? 'hsl(var(--status-success))' : t === 'declining' ? 'hsl(var(--status-critical))' : 'hsl(var(--muted-foreground))';

  const kpis = [
    {
      label: language === 'es' ? 'Flujo Kanban' : 'Kanban Flow',
      value: `${m.cycleTime}d`,
      sub: language === 'es' ? 'Cycle Time promedio' : 'Avg Cycle Time',
      trend: m.cycleTimeTrend,
      trendValue: throughputChange,
      icon: <Zap className="h-4 w-4" />,
      dataKey: 'cycleTime',
      sparkData: history,
    },
    {
      label: 'Throughput',
      value: `${m.throughput}`,
      sub: language === 'es' ? 'items / sprint' : 'items / sprint',
      trend: m.throughputTrend,
      trendValue: throughputChange,
      icon: <BarChart3 className="h-4 w-4" />,
      dataKey: 'throughput',
      sparkData: history,
    },
    {
      label: language === 'es' ? 'Bloqueos' : 'Blockers',
      value: `${blockedItems}`,
      sub: language === 'es' ? 'items bloqueados ahora' : 'items blocked now',
      trend: blockedItems > 2 ? 'declining' as const : blockedItems === 0 ? 'improving' as const : 'stable' as const,
      trendValue: blockedItems > 2 ? (language === 'es' ? 'Alto' : 'High') : blockedItems === 0 ? (language === 'es' ? 'Limpio' : 'Clear') : 'OK',
      icon: <AlertTriangle className="h-4 w-4" />,
      dataKey: 'throughput',
      sparkData: history,
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="shadow-sm border-border/60">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">{kpi.icon}</span>
              <TrendBadge trend={kpi.trend} value={kpi.trendValue} />
            </div>
            <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
            <p className="text-xs font-medium text-foreground/80 mt-0.5">{kpi.label}</p>
            <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
            {/* Sparkline */}
            <div className="h-8 mt-2 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.sparkData}>
                  <defs>
                    <linearGradient id={`kpi-${kpi.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={trendColor(kpi.trend)} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={trendColor(kpi.trend)} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey={kpi.dataKey} stroke={trendColor(kpi.trend)} strokeWidth={1.5} fill={`url(#kpi-${kpi.dataKey})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
      <HappinexKPI value={m.happinessIndex} trend={m.happinessTrend} history={history} language={language} />
    </motion.div>
  );
}
