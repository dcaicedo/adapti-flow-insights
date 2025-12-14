import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.purpose': 'Purpose',
    'nav.dynamics': 'Adaptive Dynamics',
    'nav.objectives': 'Objectives & Skills',
    'nav.teams': 'Teams',
    'nav.structure': 'Adaptive Structure',
    'nav.reports': 'Reports & Insights',
    'nav.admin': 'Administration',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Decision Center',
    'dashboard.subtitle': 'Executive overview of your Adaptive Ecosystem',
    'dashboard.ecosystemHealth': 'Ecosystem Health',
    'dashboard.dynamicsProgress': 'Dynamics Progress',
    'dashboard.activeAlerts': 'Active Alerts',
    'dashboard.investmentSummary': 'Investment vs Progress',
    'dashboard.aligned': 'Aligned',
    'dashboard.attention': 'Attention Needed',
    'dashboard.critical': 'Decision Required',
    'dashboard.skillsGrowth': 'Skills Growth',
    'dashboard.objectiveProgress': 'Objective Progress',
    'dashboard.investmentLevel': 'Investment Level',
    
    // Purpose
    'purpose.title': 'Organizational Purpose',
    'purpose.problem': 'What problem are we solving?',
    'purpose.impact': 'What impact do we want to create in society?',
    'purpose.edit': 'Edit Purpose',
    'purpose.save': 'Save Changes',
    
    // Dynamics
    'dynamics.title': 'Adaptive Dynamics',
    'dynamics.purpose': 'Purpose',
    'dynamics.culture': 'Culture',
    'dynamics.business': 'Business',
    'dynamics.structure': 'Structure',
    'dynamics.entrepreneurship': 'Entrepreneurship',
    'dynamics.objectives': 'objectives',
    'dynamics.investment': 'Investment',
    'dynamics.progress': 'Progress',
    
    // Objectives
    'objectives.title': 'Objectives & Key Results',
    'objectives.smart': 'SMART Description',
    'objectives.team': 'Assigned Team',
    'objectives.skills': 'Connected Skills',
    'objectives.investment': 'Investment',
    'objectives.status': 'Status',
    'objectives.onTrack': 'On Track',
    'objectives.attention': 'Attention',
    'objectives.critical': 'Critical',
    'objectives.create': 'Create Objective',
    'objectives.edit': 'Edit',
    'objectives.archive': 'Archive',
    'objectives.history': 'View History',
    
    // Skills
    'skills.title': 'Skills Development',
    'skills.initial': 'Initial Value',
    'skills.current': 'Current Value',
    'skills.evolution': 'Evolution Timeline',
    
    // Teams
    'teams.title': 'Teams Overview',
    'teams.objectives': 'Objectives',
    'teams.skillMaturity': 'Skill Maturity',
    'teams.alignment': 'Alignment Level',
    'teams.roi': 'Investment vs Results',
    
    // Structure
    'structure.title': 'Adaptive Structure',
    'structure.coreUnits': 'Core Units',
    'structure.extendedUnits': 'Extended Units',
    'structure.strategicObjective': 'Strategic Objective',
    
    // Reports
    'reports.title': 'Reports & Insights',
    'reports.skillsVsObjectives': 'Skills vs Objectives',
    'reports.investmentVsProgress': 'Investment vs Progress',
    'reports.riskAnalysis': 'Risk & Misalignment Analysis',
    'reports.exportPdf': 'Export PDF',
    'reports.exportCsv': 'Export CSV',
    
    // Admin
    'admin.title': 'Administration',
    'admin.organization': 'Organization',
    'admin.users': 'Users & Roles',
    'admin.language': 'Default Language',
    'admin.theme': 'Theme Settings',
    'admin.logo': 'Logo',
    'admin.dynamics': 'Enable/Disable Dynamics',
    'admin.content': 'Edit Demo Content',
    
    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    
    // Alerts
    'alert.skillsNoProgress': 'Skills have improved, but the objective has not progressed. Review assumptions and identify the root cause.',
    'alert.criticalMismatch': 'Critical: Skills improved but objective worsened. Decision required.',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.view': 'View',
    'common.export': 'Export',
    'common.search': 'Search',
    'common.filter': 'Filter',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel Principal',
    'nav.purpose': 'Propósito',
    'nav.dynamics': 'Dinámicas Adaptativas',
    'nav.objectives': 'Objetivos y Habilidades',
    'nav.teams': 'Equipos',
    'nav.structure': 'Estructura Adaptativa',
    'nav.reports': 'Reportes e Insights',
    'nav.admin': 'Administración',
    'nav.settings': 'Configuración',
    
    // Dashboard
    'dashboard.title': 'Centro de Decisiones',
    'dashboard.subtitle': 'Vista ejecutiva de tu Ecosistema Adaptativo',
    'dashboard.ecosystemHealth': 'Salud del Ecosistema',
    'dashboard.dynamicsProgress': 'Progreso de Dinámicas',
    'dashboard.activeAlerts': 'Alertas Activas',
    'dashboard.investmentSummary': 'Inversión vs Progreso',
    'dashboard.aligned': 'Alineado',
    'dashboard.attention': 'Requiere Atención',
    'dashboard.critical': 'Decisión Requerida',
    'dashboard.skillsGrowth': 'Crecimiento de Habilidades',
    'dashboard.objectiveProgress': 'Progreso de Objetivos',
    'dashboard.investmentLevel': 'Nivel de Inversión',
    
    // Purpose
    'purpose.title': 'Propósito Organizacional',
    'purpose.problem': '¿Qué problema estamos resolviendo?',
    'purpose.impact': '¿Qué impacto queremos crear en la sociedad?',
    'purpose.edit': 'Editar Propósito',
    'purpose.save': 'Guardar Cambios',
    
    // Dynamics
    'dynamics.title': 'Dinámicas Adaptativas',
    'dynamics.purpose': 'Propósito',
    'dynamics.culture': 'Cultura',
    'dynamics.business': 'Negocio',
    'dynamics.structure': 'Estructura',
    'dynamics.entrepreneurship': 'Emprendimiento',
    'dynamics.objectives': 'objetivos',
    'dynamics.investment': 'Inversión',
    'dynamics.progress': 'Progreso',
    
    // Objectives
    'objectives.title': 'Objetivos y Resultados Clave',
    'objectives.smart': 'Descripción SMART',
    'objectives.team': 'Equipo Asignado',
    'objectives.skills': 'Habilidades Conectadas',
    'objectives.investment': 'Inversión',
    'objectives.status': 'Estado',
    'objectives.onTrack': 'En Curso',
    'objectives.attention': 'Atención',
    'objectives.critical': 'Crítico',
    'objectives.create': 'Crear Objetivo',
    'objectives.edit': 'Editar',
    'objectives.archive': 'Archivar',
    'objectives.history': 'Ver Historial',
    
    // Skills
    'skills.title': 'Desarrollo de Habilidades',
    'skills.initial': 'Valor Inicial',
    'skills.current': 'Valor Actual',
    'skills.evolution': 'Línea de Tiempo',
    
    // Teams
    'teams.title': 'Vista de Equipos',
    'teams.objectives': 'Objetivos',
    'teams.skillMaturity': 'Madurez de Habilidades',
    'teams.alignment': 'Nivel de Alineación',
    'teams.roi': 'Inversión vs Resultados',
    
    // Structure
    'structure.title': 'Estructura Adaptativa',
    'structure.coreUnits': 'Unidades Core',
    'structure.extendedUnits': 'Unidades Extendidas',
    'structure.strategicObjective': 'Objetivo Estratégico',
    
    // Reports
    'reports.title': 'Reportes e Insights',
    'reports.skillsVsObjectives': 'Habilidades vs Objetivos',
    'reports.investmentVsProgress': 'Inversión vs Progreso',
    'reports.riskAnalysis': 'Análisis de Riesgos y Desalineación',
    'reports.exportPdf': 'Exportar PDF',
    'reports.exportCsv': 'Exportar CSV',
    
    // Admin
    'admin.title': 'Administración',
    'admin.organization': 'Organización',
    'admin.users': 'Usuarios y Roles',
    'admin.language': 'Idioma Predeterminado',
    'admin.theme': 'Configuración de Tema',
    'admin.logo': 'Logo',
    'admin.dynamics': 'Habilitar/Deshabilitar Dinámicas',
    'admin.content': 'Editar Contenido Demo',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.appearance': 'Apariencia',
    'settings.darkMode': 'Modo Oscuro',
    'settings.language': 'Idioma',
    
    // Alerts
    'alert.skillsNoProgress': 'Las habilidades han mejorado, pero el objetivo no ha progresado. Revisa las suposiciones e identifica la causa raíz.',
    'alert.criticalMismatch': 'Crítico: Las habilidades mejoraron pero el objetivo empeoró. Se requiere decisión.',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.create': 'Crear',
    'common.view': 'Ver',
    'common.export': 'Exportar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}