import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { teams, organizationInfo } from '@/data/demoData';
import { generateTeamMemberMetrics } from '@/data/metricsData';
import { cn } from '@/lib/utils';
import { Calendar, Users, ChevronDown } from 'lucide-react';
import { ExecutiveKPIs } from '@/components/teams/ExecutiveKPIs';
import { OperationalCharts } from '@/components/teams/OperationalCharts';
import { DrillDownPanel } from '@/components/teams/DrillDownPanel';
import type { DashboardFilters } from '@/components/teams/types';

export default function Teams() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  // Global filters
  const [filters, setFilters] = useState<DashboardFilters>({
    teamId: teams[0]?.id || '',
    sprintRange: [0, 5],
    memberId: null,
  });

  // URL-driven team selection
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId && teams.find(t => t.id === highlightId)) {
      setFilters(f => ({ ...f, teamId: highlightId }));
    }
  }, [searchParams]);

  const selectedTeam = useMemo(
    () => teams.find(t => t.id === filters.teamId) || teams[0],
    [filters.teamId]
  );

  const memberMetrics = useMemo(() => {
    if (!selectedTeam) return [];
    const m = selectedTeam.metrics;
    return generateTeamMemberMetrics(
      selectedTeam.members.map(mem => ({ id: mem.id, name: mem.name })),
      m.cycleTime, m.leadTime, m.throughput, m.velocity, m.happinessIndex
    );
  }, [selectedTeam]);

  const handleFilterChange = useCallback((partial: Partial<DashboardFilters>) => {
    setFilters(f => ({ ...f, ...partial }));
  }, []);

  const ctx = {
    team: selectedTeam,
    filters,
    memberMetrics,
    language: language as 'en' | 'es',
    onFilterChange: handleFilterChange,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const isDigital = selectedTeam.teamCategory === 'digital-build' || selectedTeam.teamCategory === 'digital-maintain';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="page-container"
    >
      {/* Header & Team Selector */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {language === 'es' ? 'Centro de Decisión' : 'Decision Center'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {language === 'es'
              ? 'Qué está pasando, por qué, y qué hacer después'
              : "What\u2019s happening, why, and what to do next"}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Team selector */}
          <div className="relative">
            <select
              value={filters.teamId}
              onChange={e => handleFilterChange({ teamId: e.target.value, memberId: null })}
              className="appearance-none bg-card border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors cursor-pointer"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.icon} {language === 'es' ? t.nameEs : t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
          {/* Period badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-primary/5 rounded-lg border border-primary/15">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">{organizationInfo.currentPeriod}</span>
          </div>
          {/* Category badge */}
          {selectedTeam.teamCategory && selectedTeam.teamCategory !== 'business' && (
            <span className={cn(
              "text-[10px] px-2 py-1.5 rounded-lg font-medium border",
              selectedTeam.teamCategory === 'digital-build'
                ? "bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-sky-500/5 text-sky-700 dark:text-sky-400 border-sky-500/20"
            )}>
              {selectedTeam.teamCategory === 'digital-build' ? '🤖 Building with AI' : '🖥️ Maintaining'}
            </span>
          )}
        </div>
      </motion.div>

      {/* Team info bar */}
      <motion.div variants={itemVariants} className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="text-lg">{selectedTeam.icon}</span>
          <span className="font-medium text-foreground">{language === 'es' ? selectedTeam.nameEs : selectedTeam.name}</span>
        </span>
        <span>{selectedTeam.members.length} {language === 'es' ? 'miembros' : 'members'}</span>
        <span className={cn(
          "font-semibold",
          selectedTeam.alignment >= 80 ? 'text-status-success' : selectedTeam.alignment >= 60 ? 'text-status-warning' : 'text-status-critical'
        )}>
          {selectedTeam.alignment}% {language === 'es' ? 'alineación' : 'alignment'}
        </span>
        <span className={cn(
          "text-[10px] px-2 py-0.5 rounded-full font-medium",
          selectedTeam.unitType === 'core' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {selectedTeam.unitType === 'core' ? 'Core' : 'Extended'}
        </span>
      </motion.div>

      {/* ═══ LEVEL 1: Executive KPIs ═══ */}
      <div>
        <motion.p variants={itemVariants} className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          {language === 'es' ? '▎Overview Ejecutivo' : '▎Executive Overview'}
        </motion.p>
        <ExecutiveKPIs {...ctx} />
      </div>

      {/* ═══ LEVEL 2: Operational Analysis ═══ */}
      <div>
        <motion.p variants={itemVariants} className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          {language === 'es' ? '▎Análisis Operativo' : '▎Operational Analysis'}
        </motion.p>
        <OperationalCharts {...ctx} />
      </div>

      {/* ═══ LEVEL 3: Drill-Down ═══ */}
      <div>
        <motion.p variants={itemVariants} className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          {language === 'es' ? '▎Detalle por Miembro y Día' : '▎Member & Daily Detail'}
        </motion.p>
        <DrillDownPanel {...ctx} />
      </div>
    </motion.div>
  );
}
