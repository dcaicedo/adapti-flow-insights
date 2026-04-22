import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { DynamicCard } from '@/components/ui/DynamicCard';
import { AlertCard } from '@/components/ui/AlertCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { dynamics, objectives, skills, alerts, purpose, teams, keyResults, getKeyResultsForTeam, computeTeamProgress } from '@/data/demoData';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Users,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

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
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.subtitle')}
        </p>
      </motion.div>

      {/* Purpose Banner */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-adaptativa-blue to-adaptativa-blue-light rounded-xl p-6 text-primary-foreground"
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5" />
          <span className="text-sm font-medium opacity-90">{t('nav.purpose')}</span>
        </div>
        <p className="text-lg font-medium leading-relaxed">
          {language === 'es' ? purpose.impactEs : purpose.impact}
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.ecosystemHealth')}</p>
                <p className="text-2xl font-bold mt-1">{avgProgress}%</p>
              </div>
              <div className="p-3 bg-status-success-bg rounded-xl">
                <TrendingUp className="h-6 w-6 text-status-success" />
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar value={avgProgress} color="status-success" showLabel={false} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.skillsGrowth')}</p>
                <p className="text-2xl font-bold mt-1">{skillsImproved}/{totalSkills}</p>
              </div>
              <div className="p-3 bg-accent rounded-xl">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {Math.round((skillsImproved / totalSkills) * 100)}% improved
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.investmentLevel')}</p>
                <p className="text-2xl font-bold mt-1">${(totalInvestment / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-business-blue/10 rounded-xl">
                <DollarSign className="h-6 w-6 text-business-blue" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-status-success">
              <ArrowUpRight className="h-4 w-4" />
              <span>12% from last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.activeAlerts')}</p>
                <p className="text-2xl font-bold mt-1">{alerts.length}</p>
              </div>
              <div className="p-3 bg-status-warning-bg rounded-xl">
                <AlertTriangle className="h-6 w-6 text-status-warning" />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <span className="text-sm text-status-critical">{criticalCount} critical</span>
              <span className="text-sm text-status-warning">{attentionCount} warning</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Summary */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('dashboard.objectiveProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-status-success-bg rounded-lg">
                <CheckCircle className="h-8 w-8 text-status-success" />
                <div>
                  <p className="text-2xl font-bold text-status-success">{alignedCount}</p>
                  <p className="text-sm text-status-success">{t('dashboard.aligned')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-status-warning-bg rounded-lg">
                <AlertTriangle className="h-8 w-8 text-status-warning" />
                <div>
                  <p className="text-2xl font-bold text-status-warning">{attentionCount}</p>
                  <p className="text-sm text-status-warning">{t('dashboard.attention')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-status-critical-bg rounded-lg">
                <AlertCircle className="h-8 w-8 text-status-critical" />
                <div>
                  <p className="text-2xl font-bold text-status-critical">{criticalCount}</p>
                  <p className="text-sm text-status-critical">{t('dashboard.critical')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamics Progress */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">{t('dashboard.dynamicsProgress')}</CardTitle>
              <button 
                onClick={() => navigate('/dynamics')}
                className="text-sm text-primary hover:underline"
              >
                View all
              </button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamics.map((dynamic) => (
                  <DynamicCard 
                    key={dynamic.id} 
                    dynamic={dynamic} 
                    onClick={() => navigate('/dynamics')}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">{t('dashboard.activeAlerts')}</CardTitle>
              <span className="text-sm text-muted-foreground">{alerts.length} active</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert}
                    onClick={() => navigate('/objectives')}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Teams Quick Access */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">👥</span>
              {t('teams.title')}
            </CardTitle>
            <button 
              onClick={() => navigate('/teams')}
              className="text-sm text-primary hover:underline"
            >
              {language === 'es' ? 'Ver todos' : 'View all'}
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.slice(0, 3).map((team) => {
                const teamKRs = getKeyResultsForTeam(team.id);
                const avgProgress = computeTeamProgress(team.id);
                
                return (
                  <div 
                    key={team.id}
                    onClick={() => navigate('/teams')}
                    className="p-4 bg-muted/30 rounded-lg border border-border cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-business-blue/10 rounded-lg">
                          <span className="text-lg">👥</span>
                        </div>
                        <div>
                          <p className="font-medium">{language === 'es' ? team.nameEs : team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team.members.length} {language === 'es' ? 'miembros' : 'members'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {teamKRs.length} {language === 'es' ? 'Resultados Clave' : 'Key Results'}
                        </span>
                        <span className="font-medium">{avgProgress}%</span>
                      </div>
                      <ProgressBar value={avgProgress} color="business-blue" size="sm" showLabel={false} />
                    </div>
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