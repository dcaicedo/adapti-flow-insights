import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MetricsSnapshot, DevOpsSnapshot } from '@/data/demoData';

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
}

export function MetricDetailDialog({
  open, onOpenChange, metricLabel, currentValue, trend, history, dataKey, invertTrend, unit, language
}: MetricDetailDialogProps) {
  const trendColor = trend === 'improving' ? 'hsl(var(--status-success))' : 
    trend === 'declining' ? 'hsl(var(--status-critical))' : 'hsl(var(--muted-foreground))';

  const values = history.map((h: any) => h[dataKey] as number);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length);

  // Cumulative data
  const cumulativeData = history.map((h: any, i: number) => ({
    ...h,
    cumulative: values.slice(0, i + 1).reduce((a, b) => a + b, 0),
  }));

  // Histogram bins
  const binCount = 5;
  const binWidth = (max - min) / binCount || 1;
  const bins = Array.from({ length: binCount }, (_, i) => {
    const lo = min + i * binWidth;
    const hi = lo + binWidth;
    const count = values.filter(v => v >= lo && (i === binCount - 1 ? v <= hi : v < hi)).length;
    return { range: `${lo.toFixed(1)}`, count, lo, hi };
  });

  const getBarColor = (index: number) => {
    const colors = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.4)', 'hsl(var(--primary) / 0.3)'];
    return colors[index % colors.length];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-lg">{metricLabel}</span>
            <span className="text-2xl font-bold">{currentValue}</span>
            {trend === 'improving' && <TrendingUp className="h-5 w-5 text-status-success" />}
            {trend === 'declining' && <TrendingDown className="h-5 w-5 text-status-critical" />}
            {trend === 'stable' && <Minus className="h-5 w-5 text-muted-foreground" />}
          </DialogTitle>
        </DialogHeader>

        {/* Stats summary */}
        <div className="grid grid-cols-4 gap-3 my-2">
          {[
            { label: language === 'es' ? 'Promedio' : 'Average', value: avg.toFixed(1) },
            { label: 'Min', value: min.toFixed(1) },
            { label: 'Max', value: max.toFixed(1) },
            { label: language === 'es' ? 'Desv. Est.' : 'Std Dev', value: stdDev.toFixed(2) },
          ].map(s => (
            <div key={s.label} className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-bold">{s.value}{unit ? ` ${unit}` : ''}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="trend" className="mt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="trend">{language === 'es' ? 'Tendencia' : 'Trend'}</TabsTrigger>
            <TabsTrigger value="histogram">{language === 'es' ? 'Distribución' : 'Distribution'}</TabsTrigger>
            <TabsTrigger value="cumulative">{language === 'es' ? 'Acumulado' : 'Cumulative'}</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              {language === 'es' ? 'Evolución por sprint con línea de promedio' : 'Sprint evolution with average line'}
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: 8, fontSize: 12 
                    }} 
                  />
                  <ReferenceLine y={avg} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: `Avg: ${avg.toFixed(1)}`, fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <defs>
                    <linearGradient id="metric-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={trendColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={trendColor} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey={dataKey} stroke={trendColor} strokeWidth={2.5} fill="url(#metric-grad)" dot={{ r: 4, fill: trendColor }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="histogram" className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              {language === 'es' ? 'Frecuencia de valores observados' : 'Frequency of observed values'}
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bins}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: 8, fontSize: 12 
                    }}
                    formatter={(value: number) => [value, language === 'es' ? 'Frecuencia' : 'Frequency']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {bins.map((_, index) => (
                      <Cell key={index} fill={getBarColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="cumulative" className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              {language === 'es' ? 'Flujo acumulado a lo largo del tiempo' : 'Cumulative flow over time'}
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: 8, fontSize: 12 
                    }}
                  />
                  <Line type="monotone" dataKey="cumulative" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                  <Line type="monotone" dataKey={dataKey} stroke={trendColor} strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3, fill: trendColor }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
