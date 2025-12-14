import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { objectives, skills, dynamics, alerts, keyResults } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Table, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export default function Reports() {
  const { t, language } = useLanguage();

  // Skills vs Objectives data - using keyResults for skills
  const skillsVsObjectives = dynamics.map(d => {
    const dynamicObjectives = objectives.filter(o => o.dynamicId === d.id);
    const dynamicKRs = keyResults.filter(kr => dynamicObjectives.some(o => o.keyResultIds.includes(kr.id)));
    const dynamicSkillIds = [...new Set(dynamicKRs.flatMap(kr => kr.skills))];
    const dynamicSkills = skills.filter(s => dynamicSkillIds.includes(s.id));
    
    const avgSkill = dynamicSkills.length > 0
      ? Math.round(dynamicSkills.reduce((sum, s) => sum + ((s.currentValue / 5) * 100), 0) / dynamicSkills.length)
      : 0;
    
    return {
      name: language === 'es' ? d.nameEs : d.name,
      progress: d.progress,
      skills: avgSkill,
    };
  });

  // Investment vs Progress data
  const investmentVsProgress = dynamics.map(d => ({
    name: language === 'es' ? d.nameEs : d.name,
    investment: d.investment / 1000,
    progress: d.progress,
    roi: Math.round((d.progress / (d.investment / 10000)) * 10) / 10,
  }));

  // Risk analysis
  const riskAnalysis = [
    {
      type: 'critical',
      count: objectives.filter(o => o.status === 'critical').length,
      label: language === 'es' ? 'Objetivos Críticos' : 'Critical Objectives',
      trend: 'up',
    },
    {
      type: 'misaligned',
      count: skills.filter(s => s.currentValue > s.initialValue).length - 
             objectives.filter(o => o.status === 'on-track').length,
      label: language === 'es' ? 'Desalineaciones Detectadas' : 'Misalignments Detected',
      trend: 'stable',
    },
    {
      type: 'declining',
      count: skills.filter(s => s.currentValue < s.initialValue).length,
      label: language === 'es' ? 'Habilidades en Declive' : 'Declining Skills',
      trend: 'down',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-entrepreneurship-green" />
            {t('reports.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'es' 
              ? 'Análisis e insights orientados a decisiones' 
              : 'Decision-oriented analysis and insights'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('reports.exportPdf')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Table className="h-4 w-4" />
            {t('reports.exportCsv')}
          </Button>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills vs Objectives */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg">{t('reports.skillsVsObjectives')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsVsObjectives} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="skills" 
                      name={language === 'es' ? 'Habilidades %' : 'Skills %'} 
                      fill="hsl(var(--entrepreneurship-green))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="progress" 
                      name={language === 'es' ? 'Progreso %' : 'Progress %'} 
                      fill="hsl(var(--adaptativa-blue))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investment vs Progress */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg">{t('reports.investmentVsProgress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={investmentVsProgress}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="investment" 
                      name={language === 'es' ? 'Inversión ($K)' : 'Investment ($K)'} 
                      stroke="hsl(var(--business-cyan))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--business-cyan))' }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="progress" 
                      name={language === 'es' ? 'Progreso %' : 'Progress %'} 
                      stroke="hsl(var(--culture-yellow))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--culture-yellow))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Risk Analysis */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.riskAnalysis')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {riskAnalysis.map((risk, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-5 rounded-lg border",
                    risk.type === 'critical' && "bg-status-critical-bg border-status-critical/20",
                    risk.type === 'misaligned' && "bg-status-warning-bg border-status-warning/20",
                    risk.type === 'declining' && "bg-muted/50 border-border"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl font-bold mb-1">
                        {risk.count > 0 ? risk.count : (
                          <CheckCircle className="h-8 w-8 text-status-success" />
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{risk.label}</p>
                    </div>
                    {risk.count > 0 && (
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        risk.trend === 'up' && "text-status-critical",
                        risk.trend === 'down' && "text-status-success",
                        risk.trend === 'stable' && "text-status-warning"
                      )}>
                        {risk.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
                        {risk.trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
                        {risk.trend === 'stable' && <span>—</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ROI by Dynamic */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'es' ? 'Retorno por Dinámica' : 'Return by Dynamic'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investmentVsProgress.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium truncate">{item.name}</div>
                  <div className="flex-1">
                    <ProgressBar 
                      value={item.progress} 
                      color={dynamics[index]?.color || 'primary'}
                      showLabel={false}
                    />
                  </div>
                  <div className="w-20 text-right">
                    <span className={cn(
                      "font-semibold",
                      item.roi >= 1 ? "text-status-success" : "text-status-warning"
                    )}>
                      {item.roi}x ROI
                    </span>
                  </div>
                  <div className="w-24 text-right text-sm text-muted-foreground">
                    ${item.investment}K
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Alerts Summary */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-status-warning/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-warning" />
              <CardTitle className="text-lg">
                {language === 'es' ? 'Alertas que Requieren Decisión' : 'Alerts Requiring Decision'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-lg",
                    alert.type === 'critical' ? "bg-status-critical-bg" : "bg-status-warning-bg"
                  )}
                >
                  <p className="text-sm font-medium">
                    {language === 'es' ? alert.messageEs : alert.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}