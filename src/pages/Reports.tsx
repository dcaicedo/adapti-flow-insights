import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrgOverviewCards } from '@/components/reports/OrgOverviewCards';
import { MetricsComparison } from '@/components/reports/MetricsComparison';
import { SkillsGapAnalysis } from '@/components/reports/SkillsGapAnalysis';
import { TeamMemberSkillsTable } from '@/components/reports/TeamMemberSkillsTable';

export default function Reports() {
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
              ? 'Análisis completo: equipos, miembros, habilidades y métricas conectadas'
              : 'Complete analysis: teams, members, skills & connected metrics'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('reports.exportPdf')}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Table className="h-4 w-4" />
            {t('reports.exportCsv')}
          </Button>
        </div>
      </motion.div>

      {/* Organization Overview KPIs */}
      <motion.div variants={itemVariants}>
        <OrgOverviewCards />
      </motion.div>

      {/* Skills Gap + Risk Analysis */}
      <motion.div variants={itemVariants}>
        <SkillsGapAnalysis />
      </motion.div>

      {/* Metrics Comparison + DevOps */}
      <motion.div variants={itemVariants}>
        <MetricsComparison />
      </motion.div>

      {/* Teams, Members & Skills Drill-down */}
      <motion.div variants={itemVariants}>
        <TeamMemberSkillsTable />
      </motion.div>
    </motion.div>
  );
}
