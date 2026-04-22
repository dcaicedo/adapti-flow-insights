import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Line, ComposedChart, Legend,
} from 'recharts';
import { Users, CalendarDays } from 'lucide-react';
import type { DashboardContext } from './types';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 10,
  fontSize: 11,
  boxShadow: '0 8px 24px hsl(var(--foreground) / 0.08)',
};

export function DrillDownPanel({ team, filters, memberMetrics, language }: DashboardContext) {
  const dataKey = 'throughput'; // default view

  // Member bar data sorted by throughput
  const memberBarData = useMemo(() => {
    return [...memberMetrics]
      .sort((a, b) => b.throughput - a.throughput)
      .map(m => ({
        name: m.name.split(' ')[0],
        fullName: m.name,
        throughput: m.throughput,
        velocity: m.velocity,
        cycleTime: m.avgCycleTime,
        leadTime: m.avgLeadTime,
        happiness: m.happiness,
      }));
  }, [memberMetrics]);

  // Daily aggregated
  const dailyData = useMemo(() => {
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

  if (!memberMetrics.length) {
    return (
      <Card className="shadow-sm border-border/60">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'es' ? 'Sin datos detallados para este equipo' : 'No detailed data for this team'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Per-Member Breakdown */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            {language === 'es' ? 'Rendimiento por Miembro' : 'Performance by Member'}
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">
            {language === 'es' ? 'Throughput y felicidad individual' : 'Individual throughput & happiness'}
          </p>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberBarData} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={50} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) => [value, name]}
                  labelFormatter={(label) => {
                    const m = memberBarData.find(d => d.name === label);
                    return m?.fullName || label;
                  }}
                />
                <Bar dataKey="throughput" name="Throughput" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {memberBarData.map((entry, i) => {
                    const ratio = entry.throughput / (memberBarData[0]?.throughput || 1);
                    const hue = ratio > 0.8 ? 145 : ratio > 0.5 ? 45 : 0;
                    return <Cell key={i} fill={`hsl(${hue} 65% 50% / 0.7)`} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Happiness per member */}
          <div className="mt-4">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
              Happinex Index
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
                          className={cn("h-full rounded-full", m.happiness >= 8 ? "bg-status-success" : m.happiness >= 6 ? "bg-status-warning" : "bg-status-critical")}
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
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {language === 'es' ? 'Desglose Diario' : 'Daily Breakdown'}
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">
            {language === 'es' ? 'Items completados y cycle time por día' : 'Items completed & cycle time per day'}
          </p>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={40} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="itemsCompleted" name={language === 'es' ? 'Items' : 'Items'} fill="hsl(var(--primary) / 0.6)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="avgCycleTime" name={language === 'es' ? 'Ciclo (d)' : 'Cycle (d)'} stroke="hsl(var(--status-warning))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--status-warning))' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {/* Daily insight */}
          {dailyData.length > 0 && (() => {
            const bestDay = [...dailyData].sort((a, b) => b.itemsCompleted - a.itemsCompleted)[0];
            const worstDay = [...dailyData].sort((a, b) => a.itemsCompleted - b.itemsCompleted)[0];
            return (
              <div className="mt-3 flex gap-3 text-[10px]">
                <div className="flex-1 p-2 bg-status-success/5 border border-status-success/20 rounded-lg">
                  <span className="text-status-success font-semibold">🔥 {language === 'es' ? 'Mejor día' : 'Best day'}</span>
                  <p className="text-muted-foreground">{bestDay.day}: {bestDay.itemsCompleted} items</p>
                </div>
                <div className="flex-1 p-2 bg-status-critical/5 border border-status-critical/20 rounded-lg">
                  <span className="text-status-critical font-semibold">⚡ {language === 'es' ? 'Menor día' : 'Slowest day'}</span>
                  <p className="text-muted-foreground">{worstDay.day}: {worstDay.itemsCompleted} items</p>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </motion.div>
  );
}
