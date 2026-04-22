import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { DynamicCard } from '@/components/ui/DynamicCard';
import { AlertCard } from '@/components/ui/AlertCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { dynamics, objectives, skills, alerts, purpose, teams, keyResults, getKeyResultsForTeam, computeTeamProgress, organizationInfo } from '@/data/demoData';
import { 
  TrendingUp, Target, DollarSign, AlertTriangle, CheckCircle,
  AlertCircle, ArrowUpRight, Users, ChevronRight, Calendar, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const alignedCount = objectives.filter(o => o.status === 'on-track').length;
  const attentionCount = objectives.filter(o => o.status === 'attention').length;
  const criticalCount = objectives.filter(o => o.status === 'critical').length;
  const totalInvestment = dynamics.reduce((sum, d) => sum + d.investment, 0);
  const avgProgress = Math.round(dynamics.reduce((sum, d) => sum + d.progress, 0) / dynamics.length);
  const skillsImproved = skills.filter(s => s.currentValue > s.initialValue).length;
  const totalSkills = skills.length;
  const avgHappiness = (teams.reduce((s, t) => s + t.metrics.happinessIndex, 0) / teams.length).toFixed(1);
  const totalMembers = teams.reduce((s, t) => s + t.members.length, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="page-container">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">{organizationInfo.currentPeriod}</span>
        </div>
      </motion.div>

      {/* Purpose Strip */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-primary to-adaptativa-blue-light rounded-xl px-5 py-4 text-primary-foreground">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 mt-0.5 opacity-80 flex-shrink-0" />
            <p className="text-sm font-medium leading-relaxed opacity-95 line-clamp-2">
              {language === 'es' ? purpose.impactEs : purpose.impact}
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              label: t('dashboard.ecosystemHealth'),
              value: `${avgProgress}%`,
              icon: TrendingUp,
              accent: 'text-status-success',
              bg: 'bg-status-success/8',
              sub: <ProgressBar value={avgProgress} color="status-success" showLabel={false} size="sm" />,
            },
            {
              label: t('dashboard.skillsGrowth'),
              value: `${skillsImproved}/${totalSkills}`,
              icon: Zap,
              accent: 'text-entrepreneurship-green',
              bg: 'bg-entrepreneurship-green/8',
              sub: <span className="text-xs text-muted-foreground">{Math.round((skillsImproved / totalSkills) * 100)}% {language === 'es' ? 'mejorando' : 'improving'}</span>,
            },
            {
              label: t('dashboard.investmentLevel'),
              value: `$${(totalInvestment / 1000).toFixed(0)}K`,
              icon: DollarSign,
              accent: 'text-business-blue',
              bg: 'bg-business-blue/8',
              sub: (
                <span className="text-xs text-status-success flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> 12%
                </span>
              ),
            },
            {
              label: 'Happinex',
              value: `${avgHappiness}`,
              icon: Users,
              accent: 'text-culture-yellow',
              bg: 'bg-culture-yellow/8',
              sub: <span className="text-xs text-muted-foreground">{totalMembers} {language === 'es' ? 'personas' : 'people'}</span>,
            },
            {
              label: t('dashboard.activeAlerts'),
              value: `${alerts.length}`,
              icon: AlertTriangle,
              accent: criticalCount > 0 ? 'text-status-critical' : 'text-status-warning',
              bg: criticalCount > 0 ? 'bg-status-critical/8' : 'bg-status-warning/8',
              sub: (
                <div className="flex gap-2 text-xs">
                  {criticalCount > 0 && <span className="text-status-critical">{criticalCount} critical</span>}
                  {attentionCount > 0 && <span className="text-status-warning">{attentionCount} warning</span>}
                </div>
              ),
            },
          ].map((kpi, i) => (
            <Card key={i} className="shadow-sm border-border/60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <div className={cn("p-1.5 rounded-lg", kpi.bg)}>
                    <kpi.icon className={cn("h-3.5 w-3.5", kpi.accent)} />
                  </div>
                </div>
                <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
                <div className="mt-2">{kpi.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Objective Status */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-border/60">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: CheckCircle, count: alignedCount, label: t('dashboard.aligned'), color: 'text-status-success', bg: 'bg-status-success-bg' },
                { icon: AlertTriangle, count: attentionCount, label: t('dashboard.attention'), color: 'text-status-warning', bg: 'bg-status-warning-bg' },
                { icon: AlertCircle, count: criticalCount, label: t('dashboard.critical'), color: 'text-status-critical', bg: 'bg-status-critical-bg' },
              ].map((s, i) => (
                <div key={i} className={cn("flex items-center gap-3 p-3 rounded-lg", s.bg)}>
                  <s.icon className={cn("h-5 w-5", s.color)} />
                  <div>
                    <p className={cn("text-xl font-bold", s.color)}>{s.count}</p>
                    <p className={cn("text-xs", s.color)}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamics + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="shadow-sm border-border/60 h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('dashboard.dynamicsProgress')}</CardTitle>
              <button onClick={() => navigate('/dynamics')} className="text-xs text-primary hover:underline font-medium">
                {language === 'es' ? 'Ver todo' : 'View all'}
              </button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dynamics.map((dynamic) => (
                  <DynamicCard key={dynamic.id} dynamic={dynamic} onClick={() => navigate('/dynamics')} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-border/60 h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('dashboard.activeAlerts')}</CardTitle>
              <span className="text-xs text-muted-foreground">{alerts.length} {language === 'es' ? 'activas' : 'active'}</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onClick={() => navigate('/objectives')} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Teams Quick Access */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {t('teams.title')}
            </CardTitle>
            <button onClick={() => navigate('/teams')} className="text-xs text-primary hover:underline font-medium">
              {language === 'es' ? 'Ver todos' : 'View all'}
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {teams.slice(0, 6).map((team) => {
                const avgProgress = computeTeamProgress(team.id);
                const krs = getKeyResultsForTeam(team.id);
                return (
                  <div 
                    key={team.id}
                    onClick={() => navigate('/teams')}
                    className="p-3 rounded-lg border border-border/60 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{team.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{language === 'es' ? team.nameEs : team.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {team.members.length} {language === 'es' ? 'miembros' : 'members'} · {krs.length} KRs
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                    <ProgressBar value={avgProgress} color="primary" size="sm" showLabel />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
