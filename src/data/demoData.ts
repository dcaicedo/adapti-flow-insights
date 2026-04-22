// ============= Interfaces =============

export interface KeyResult {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  objectiveId: string; // Parent objective
  teamIds: string[]; // Teams contributing to this key result
  progress: number;
  investment: number; // Budget used
  budget: number; // Total assigned budget
  status: 'on-track' | 'attention' | 'critical';
  skills: string[];
}

export interface Objective {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  dynamicId: string;
  keyResultIds: string[];
  progress: number;
  investment: number;
  status: 'on-track' | 'attention' | 'critical';
}

export interface Skill {
  id: string;
  name: string;
  nameEs: string;
  initialValue: number;
  currentValue: number;
  teamId: string;
  keyResultIds: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleEs: string;
  unitType: 'core' | 'extended';
  area: string;
  areaEs: string;
  avatar?: string;
}

export interface MetricsSnapshot {
  sprint: string;
  leadTime: number;
  cycleTime: number;
  throughput: number;
  velocity: number;
  happinessIndex: number;
}

export interface DevOpsSnapshot {
  sprint: string;
  deploymentFrequency: number; // deploys per day
  leadTimeForChanges: number; // hours from commit to production
  changeFailureRate: number; // percentage
}

export interface DevOpsMetrics {
  deploymentFrequency: number;
  leadTimeForChanges: number;
  changeFailureRate: number;
  deploymentFrequencyTrend: 'improving' | 'stable' | 'declining';
  leadTimeForChangesTrend: 'improving' | 'stable' | 'declining';
  changeFailureRateTrend: 'improving' | 'stable' | 'declining';
  history: DevOpsSnapshot[];
}

export interface TeamMetrics {
  leadTime: number;
  cycleTime: number;
  throughput: number;
  velocity: number;
  happinessIndex: number;
  leadTimeTrend: 'improving' | 'stable' | 'declining';
  cycleTimeTrend: 'improving' | 'stable' | 'declining';
  throughputTrend: 'improving' | 'stable' | 'declining';
  velocityTrend: 'improving' | 'stable' | 'declining';
  happinessTrend: 'improving' | 'stable' | 'declining';
  history: MetricsSnapshot[];
}

export interface Team {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  members: TeamMember[];
  alignment: number;
  keyResultIds: string[];
  skillIds: string[];
  unitType: 'core' | 'extended';
  parentUnitIds: string[];
  metrics: TeamMetrics;
  teamCategory?: 'digital-build' | 'digital-maintain' | 'business';
  devOpsMetrics?: DevOpsMetrics;
}

export interface StrategicUnit {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  objectiveIds: string[];
}

export interface Dynamic {
  id: string;
  name: string;
  nameEs: string;
  color: string;
  colorLight: string;
  icon: string;
  objectiveIds: string[];
  progress: number;
  investment: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  messageEs: string;
  keyResultId?: string;
  objectiveId?: string;
  timestamp: Date;
}

export interface Purpose {
  problem: string;
  problemEs: string;
  impact: string;
  impactEs: string;
}

export interface OrganizationInfo {
  name: string;
  tagline: string;
  taglineEs: string;
  logo: string;
  currentPeriod: string;
}

// ============= Organization Info =============

export const organizationInfo: OrganizationInfo = {
  name: 'Adaptativa Consulting',
  tagline: 'Transforming Organizations Through Adaptive Excellence',
  taglineEs: 'Transformando Organizaciones a Través de la Excelencia Adaptativa',
  logo: '/adaptativa-logo.svg',
  currentPeriod: '2025-Q3',
};

// ============= Demo Data =============

export const purpose: Purpose = {
  problem: "Organizations struggle to adapt quickly to market changes while maintaining alignment between strategy, culture, and operations. This leads to wasted resources, disengaged teams, and missed opportunities for innovation.",
  problemEs: "Las organizaciones luchan por adaptarse rápidamente a los cambios del mercado mientras mantienen la alineación entre estrategia, cultura y operaciones. Esto lleva a recursos desperdiciados, equipos desvinculados y oportunidades perdidas de innovación.",
  impact: "We empower organizations to become truly adaptive, creating workplaces where people thrive, innovation flourishes, and sustainable growth becomes the natural outcome of aligned purpose, culture, and business dynamics.",
  impactEs: "Empoderamos a las organizaciones para que sean verdaderamente adaptativas, creando lugares de trabajo donde las personas prosperan, la innovación florece y el crecimiento sostenible se convierte en el resultado natural de la alineación entre propósito, cultura y dinámicas de negocio.",
};

export const strategicUnits: StrategicUnit[] = [
  {
    id: 'unit-1',
    name: 'Organizational Transformation',
    nameEs: 'Transformación Organizacional',
    description: 'Unit focused on driving adaptive culture and structural change',
    descriptionEs: 'Unidad enfocada en impulsar cultura adaptativa y cambio estructural',
    objectiveIds: ['obj-1', 'obj-7'],
  },
  {
    id: 'unit-2',
    name: 'Revenue Growth',
    nameEs: 'Crecimiento de Ingresos',
    description: 'Unit focused on sustainable business growth',
    descriptionEs: 'Unidad enfocada en crecimiento sostenible del negocio',
    objectiveIds: ['obj-4', 'obj-5', 'obj-6'],
  },
  {
    id: 'unit-3',
    name: 'Innovation Hub',
    nameEs: 'Hub de Innovación',
    description: 'Unit focused on new opportunities and entrepreneurship',
    descriptionEs: 'Unidad enfocada en nuevas oportunidades y emprendimiento',
    objectiveIds: ['obj-8', 'obj-9'],
  },
];

export const dynamics: Dynamic[] = [
  {
    id: 'purpose',
    name: 'Purpose',
    nameEs: 'Propósito',
    color: 'adaptativa-blue',
    colorLight: 'adaptativa-blue-light',
    icon: '🎯',
    objectiveIds: ['obj-1'],
    progress: 85,
    investment: 480000,
  },
  {
    id: 'culture',
    name: 'Culture',
    nameEs: 'Cultura',
    color: 'culture-yellow',
    colorLight: 'culture-yellow-light',
    icon: '💛',
    objectiveIds: ['obj-2', 'obj-3'],
    progress: 72,
    investment: 340000,
  },
  {
    id: 'business',
    name: 'Business',
    nameEs: 'Negocio',
    color: 'business-blue',
    colorLight: 'business-blue-light',
    icon: '💼',
    objectiveIds: ['obj-4', 'obj-5', 'obj-6'],
    progress: 68,
    investment: 1050000,
  },
  {
    id: 'structure',
    name: 'Structure',
    nameEs: 'Estructura',
    color: 'structure-magenta',
    colorLight: 'structure-magenta-light',
    icon: '🏗️',
    objectiveIds: ['obj-7'],
    progress: 45,
    investment: 250000,
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    nameEs: 'Emprendimiento',
    color: 'entrepreneurship-green',
    colorLight: 'entrepreneurship-green-light',
    icon: '🚀',
    objectiveIds: ['obj-8', 'obj-9'],
    progress: 78,
    investment: 720000,
  },
];

export const objectives: Objective[] = [
  {
    id: 'obj-1',
    title: 'Align organizational purpose with all adaptive dynamics',
    titleEs: 'Alinear el propósito organizacional con todas las dinámicas adaptativas',
    description: 'Ensure all dynamics are connected and driven by a shared purpose that guides decision-making.',
    descriptionEs: 'Asegurar que todas las dinámicas estén conectadas y guiadas por un propósito compartido que oriente la toma de decisiones.',
    dynamicId: 'purpose',
    keyResultIds: ['kr-1', 'kr-2'],
    progress: 85,
    investment: 480000,
    status: 'on-track',
  },
  {
    id: 'obj-2',
    title: 'Build a culture of continuous learning and feedback',
    titleEs: 'Construir una cultura de aprendizaje continuo y retroalimentación',
    description: 'Develop organizational habits that promote learning, experimentation, and constructive feedback.',
    descriptionEs: 'Desarrollar hábitos organizacionales que promuevan el aprendizaje, la experimentación y la retroalimentación constructiva.',
    dynamicId: 'culture',
    keyResultIds: ['kr-3', 'kr-4'],
    progress: 72,
    investment: 180000,
    status: 'on-track',
  },
  {
    id: 'obj-3',
    title: 'Strengthen peer recognition and appreciation',
    titleEs: 'Fortalecer el reconocimiento y apreciación entre pares',
    description: 'Create systems that encourage recognition and celebrate contributions across teams.',
    descriptionEs: 'Crear sistemas que fomenten el reconocimiento y celebren las contribuciones entre equipos.',
    dynamicId: 'culture',
    keyResultIds: ['kr-5'],
    progress: 65,
    investment: 160000,
    status: 'attention',
  },
  {
    id: 'obj-4',
    title: 'Maximize recurring revenue growth',
    titleEs: 'Maximizar el crecimiento de ingresos recurrentes',
    description: 'Focus on strategies that drive sustainable, predictable revenue streams.',
    descriptionEs: 'Enfocarse en estrategias que impulsen flujos de ingresos sostenibles y predecibles.',
    dynamicId: 'business',
    keyResultIds: ['kr-6', 'kr-7'],
    progress: 68,
    investment: 620000,
    status: 'on-track',
  },
  {
    id: 'obj-5',
    title: 'Improve customer retention and satisfaction',
    titleEs: 'Mejorar la retención y satisfacción del cliente',
    description: 'Reduce churn and increase customer lifetime value through proactive engagement.',
    descriptionEs: 'Reducir el abandono y aumentar el valor de vida del cliente mediante un compromiso proactivo.',
    dynamicId: 'business',
    keyResultIds: ['kr-8'],
    progress: 55,
    investment: 250000,
    status: 'attention',
  },
  {
    id: 'obj-6',
    title: 'Launch innovative product features',
    titleEs: 'Lanzar funcionalidades de producto innovadoras',
    description: 'Deliver new capabilities that differentiate our offering and create customer value.',
    descriptionEs: 'Entregar nuevas capacidades que diferencien nuestra oferta y creen valor para el cliente.',
    dynamicId: 'business',
    keyResultIds: ['kr-9'],
    progress: 42,
    investment: 180000,
    status: 'critical',
  },
  {
    id: 'obj-7',
    title: 'Transform organizational structure for agility',
    titleEs: 'Transformar la estructura organizacional para la agilidad',
    description: 'Redesign structures to enable faster decision-making and cross-functional collaboration.',
    descriptionEs: 'Rediseñar estructuras para permitir una toma de decisiones más rápida y colaboración interfuncional.',
    dynamicId: 'structure',
    keyResultIds: ['kr-10', 'kr-11'],
    progress: 45,
    investment: 250000,
    status: 'attention',
  },
  {
    id: 'obj-8',
    title: 'Validate new business opportunities',
    titleEs: 'Validar nuevas oportunidades de negocio',
    description: 'Test market assumptions and build MVPs to discover growth opportunities.',
    descriptionEs: 'Probar supuestos de mercado y construir MVPs para descubrir oportunidades de crecimiento.',
    dynamicId: 'entrepreneurship',
    keyResultIds: ['kr-12', 'kr-13'],
    progress: 78,
    investment: 400000,
    status: 'on-track',
  },
  {
    id: 'obj-9',
    title: 'Establish innovation infrastructure',
    titleEs: 'Establecer infraestructura de innovación',
    description: 'Create dedicated resources and processes to sustain continuous innovation.',
    descriptionEs: 'Crear recursos y procesos dedicados para sostener la innovación continua.',
    dynamicId: 'entrepreneurship',
    keyResultIds: ['kr-14'],
    progress: 82,
    investment: 320000,
    status: 'on-track',
  },
];

export const keyResults: KeyResult[] = [
  {
    id: 'kr-1',
    title: 'Align 100% of team OKRs with organizational purpose by Q2',
    titleEs: 'Alinear 100% de OKRs de equipos con el propósito organizacional para Q2',
    description: 'Specific: All team objectives reviewed and linked to purpose. Measurable: 100% alignment score. Achievable: Training and workshops planned. Relevant: Core to adaptive culture. Time-bound: By end of Q2.',
    descriptionEs: 'Específico: Todos los objetivos de equipo revisados y vinculados al propósito. Medible: 100% de puntuación de alineación. Alcanzable: Capacitación y talleres planificados. Relevante: Fundamental para la cultura adaptativa. Temporal: Para fin de Q2.',
    objectiveId: 'obj-1',
    teamIds: ['team-1'],
    progress: 85,
    investment: 320000,
    budget: 385000,
    status: 'on-track',
    skills: ['skill-1', 'skill-2'],
  },
  {
    id: 'kr-2',
    title: 'Conduct purpose alignment workshops with all teams by Q1',
    titleEs: 'Realizar talleres de alineación de propósito con todos los equipos para Q1',
    description: 'Specific: 15 workshops across all departments. Measurable: 100% team participation. Achievable: Facilitators trained. Relevant: Foundation for purpose-driven culture. Time-bound: By end of Q1.',
    descriptionEs: 'Específico: 15 talleres en todos los departamentos. Medible: 100% de participación de equipos. Alcanzable: Facilitadores capacitados. Relevante: Base para cultura orientada al propósito. Temporal: Para fin de Q1.',
    objectiveId: 'obj-1',
    teamIds: ['team-1', 'team-2'],
    progress: 90,
    investment: 160000,
    budget: 185000,
    status: 'on-track',
    skills: ['skill-2'],
  },
  {
    id: 'kr-3',
    title: 'Achieve 90% employee engagement score by Q3',
    titleEs: 'Alcanzar 90% de puntuación de compromiso de empleados para Q3',
    description: 'Specific: Monthly pulse surveys and action plans. Measurable: 90% engagement score target. Achievable: Current score at 75%. Relevant: Drives retention and productivity. Time-bound: By end of Q3.',
    descriptionEs: 'Específico: Encuestas mensuales y planes de acción. Medible: Objetivo de 90% de engagement. Alcanzable: Puntuación actual en 75%. Relevante: Impulsa retención y productividad. Temporal: Para fin de Q3.',
    objectiveId: 'obj-2',
    teamIds: ['team-2'],
    progress: 72,
    investment: 100000,
    budget: 140000,
    status: 'on-track',
    skills: ['skill-3', 'skill-4'],
  },
  {
    id: 'kr-4',
    title: 'Launch learning platform with 80% monthly active users by Q2',
    titleEs: 'Lanzar plataforma de aprendizaje con 80% de usuarios activos mensuales para Q2',
    description: 'Specific: Implement LMS with curated content. Measurable: 80% MAU. Achievable: Platform selected. Relevant: Enables continuous learning. Time-bound: By end of Q2.',
    descriptionEs: 'Específico: Implementar LMS con contenido curado. Medible: 80% MAU. Alcanzable: Plataforma seleccionada. Relevante: Habilita aprendizaje continuo. Temporal: Para fin de Q2.',
    objectiveId: 'obj-2',
    teamIds: ['team-2', 'team-4'],
    progress: 68,
    investment: 80000,
    budget: 120000,
    status: 'on-track',
    skills: ['skill-3'],
  },
  {
    id: 'kr-5',
    title: 'Implement peer recognition program across all departments',
    titleEs: 'Implementar programa de reconocimiento entre pares en todos los departamentos',
    description: 'Specific: Launch recognition platform with gamification. Measurable: 80% participation rate. Achievable: Budget approved. Relevant: Strengthens culture. Time-bound: Full rollout by Q2.',
    descriptionEs: 'Específico: Lanzar plataforma de reconocimiento con gamificación. Medible: 80% de tasa de participación. Alcanzable: Presupuesto aprobado. Relevante: Fortalece cultura. Temporal: Implementación completa para Q2.',
    objectiveId: 'obj-3',
    teamIds: ['team-2'],
    progress: 65,
    investment: 160000,
    budget: 200000,
    status: 'attention',
    skills: ['skill-3'],
  },
  {
    id: 'kr-6',
    title: 'Increase recurring revenue by 25% year-over-year',
    titleEs: 'Aumentar ingresos recurrentes en 25% año a año',
    description: 'Specific: Focus on upselling and retention. Measurable: 25% YoY growth. Achievable: New pricing tiers ready. Relevant: Sustainable business model. Time-bound: By fiscal year end.',
    descriptionEs: 'Específico: Enfoque en upselling y retención. Medible: 25% de crecimiento YoY. Alcanzable: Nuevos niveles de precio listos. Relevante: Modelo de negocio sostenible. Temporal: Para fin de año fiscal.',
    objectiveId: 'obj-4',
    teamIds: ['team-3'],
    progress: 68,
    investment: 420000,
    budget: 500000,
    status: 'on-track',
    skills: ['skill-5', 'skill-6'],
  },
  {
    id: 'kr-7',
    title: 'Expand to 3 new Canadian market segments with positive unit economics',
    titleEs: 'Expandirse a 3 nuevos segmentos del mercado canadiense con unit economics positivos',
    description: 'Specific: Identify and enter new verticals in Western Canada, Quebec, and Atlantic provinces. Measurable: 3 segments with positive CAC/LTV. Achievable: Market research complete. Relevant: Diversifies revenue. Time-bound: By Q4.',
    descriptionEs: 'Específico: Identificar y entrar a nuevas verticales en el oeste de Canadá, Quebec y provincias atlánticas. Medible: 3 segmentos con CAC/LTV positivo. Alcanzable: Investigación de mercado completa. Relevante: Diversifica ingresos. Temporal: Para Q4.',
    objectiveId: 'obj-4',
    teamIds: ['team-3', 'team-5'],
    progress: 55,
    investment: 200000,
    budget: 280000,
    status: 'attention',
    skills: ['skill-5'],
  },
  {
    id: 'kr-8',
    title: 'Reduce customer churn rate to below 5%',
    titleEs: 'Reducir tasa de abandono de clientes por debajo del 5%',
    description: 'Specific: Proactive customer success program. Measurable: <5% monthly churn. Achievable: CS team expansion planned. Relevant: Revenue retention. Time-bound: Sustained for 3 consecutive months.',
    descriptionEs: 'Específico: Programa proactivo de éxito del cliente. Medible: <5% de abandono mensual. Alcanzable: Expansión del equipo CS planificada. Relevante: Retención de ingresos. Temporal: Sostenido por 3 meses consecutivos.',
    objectiveId: 'obj-5',
    teamIds: ['team-3'],
    progress: 55,
    investment: 250000,
    budget: 310000,
    status: 'attention',
    skills: ['skill-6', 'skill-7'],
  },
  {
    id: 'kr-9',
    title: 'Launch 2 new product features with positive NPS',
    titleEs: 'Lanzar 2 nuevas funcionalidades de producto con NPS positivo',
    description: 'Specific: AI-powered analytics and mobile app. Measurable: NPS > 40 for each feature. Achievable: Development in progress. Relevant: Competitive advantage. Time-bound: Both launched by Q3.',
    descriptionEs: 'Específico: Analíticas con IA y aplicación móvil. Medible: NPS > 40 para cada funcionalidad. Alcanzable: Desarrollo en progreso. Relevante: Ventaja competitiva. Temporal: Ambos lanzados para Q3.',
    objectiveId: 'obj-6',
    teamIds: ['team-4'],
    progress: 42,
    investment: 180000,
    budget: 250000,
    status: 'critical',
    skills: ['skill-8'],
  },
  {
    id: 'kr-10',
    title: 'Redesign organizational structure to Adaptive Team model',
    titleEs: 'Rediseñar estructura organizacional a modelo de Adaptive Teams',
    description: 'Specific: Move to Adaptive Team model. Measurable: 50% faster decision-making. Achievable: Pilot with 2 departments. Relevant: Enables adaptation. Time-bound: Full transition by Q4.',
    descriptionEs: 'Específico: Migrar a modelo de Adaptive Teams. Medible: 50% más rápido en toma de decisiones. Alcanzable: Piloto con 2 departamentos. Relevante: Habilita adaptación. Temporal: Transición completa para Q4.',
    objectiveId: 'obj-7',
    teamIds: ['team-1'],
    progress: 45,
    investment: 165000,
    budget: 225000,
    status: 'attention',
    skills: ['skill-9', 'skill-10'],
  },
  {
    id: 'kr-11',
    title: 'Establish cross-functional collaboration protocols',
    titleEs: 'Establecer protocolos de colaboración interfuncional',
    description: 'Specific: Define and train on collaboration frameworks. Measurable: All teams trained. Achievable: Materials in development. Relevant: Breaks silos. Time-bound: By Q2.',
    descriptionEs: 'Específico: Definir y capacitar en marcos de colaboración. Medible: Todos los equipos capacitados. Alcanzable: Materiales en desarrollo. Relevante: Rompe silos. Temporal: Para Q2.',
    objectiveId: 'obj-7',
    teamIds: ['team-1', 'team-2'],
    progress: 50,
    investment: 85000,
    budget: 125000,
    status: 'attention',
    skills: ['skill-10'],
  },
  {
    id: 'kr-12',
    title: 'Validate 5 new business hypotheses through rapid experiments',
    titleEs: 'Validar 5 nuevas hipótesis de negocio mediante experimentos rápidos',
    description: 'Specific: Run lean experiments for new offerings. Measurable: 5 validated hypotheses. Achievable: Innovation team in place. Relevant: Future revenue streams. Time-bound: By Q3.',
    descriptionEs: 'Específico: Ejecutar experimentos lean para nuevas ofertas. Medible: 5 hipótesis validadas. Alcanzable: Equipo de innovación en su lugar. Relevante: Futuros flujos de ingresos. Temporal: Para Q3.',
    objectiveId: 'obj-8',
    teamIds: ['team-5'],
    progress: 80,
    investment: 240000,
    budget: 290000,
    status: 'on-track',
    skills: ['skill-11'],
  },
  {
    id: 'kr-13',
    title: 'Build and launch 2 MVPs with paying customers',
    titleEs: 'Construir y lanzar 2 MVPs con clientes que pagan',
    description: 'Specific: Develop MVPs for top 2 validated opportunities. Measurable: At least 10 paying customers each. Achievable: Dev resources allocated. Relevant: Proves market demand. Time-bound: By Q4.',
    descriptionEs: 'Específico: Desarrollar MVPs para las 2 mejores oportunidades validadas. Medible: Al menos 10 clientes que pagan cada uno. Alcanzable: Recursos de desarrollo asignados. Relevante: Prueba demanda de mercado. Temporal: Para Q4.',
    objectiveId: 'obj-8',
    teamIds: ['team-5', 'team-3'],
    progress: 75,
    investment: 160000,
    budget: 225000,
    status: 'on-track',
    skills: ['skill-12'],
  },
  {
    id: 'kr-14',
    title: 'Establish innovation fund and governance process',
    titleEs: 'Establecer fondo de innovación y proceso de gobernanza',
    description: 'Specific: Create dedicated fund with clear allocation criteria. Measurable: Fund operational with 3 funded projects. Achievable: Executive buy-in secured. Relevant: Sustains innovation. Time-bound: By Q2.',
    descriptionEs: 'Específico: Crear fondo dedicado con criterios de asignación claros. Medible: Fondo operativo con 3 proyectos financiados. Alcanzable: Apoyo ejecutivo asegurado. Relevante: Sostiene innovación. Temporal: Para Q2.',
    objectiveId: 'obj-9',
    teamIds: ['team-5', 'team-1'],
    progress: 82,
    investment: 320000,
    budget: 400000,
    status: 'on-track',
    skills: ['skill-11'],
  },
];

export const skills: Skill[] = [
  // Executive Leadership Skills
  { id: 'skill-1', name: 'Strategic Alignment', nameEs: 'Alineación Estratégica', initialValue: 3, currentValue: 4, teamId: 'team-1', keyResultIds: ['kr-1'] },
  { id: 'skill-2', name: 'Purpose Communication', nameEs: 'Comunicación de Propósito', initialValue: 3, currentValue: 5, teamId: 'team-1', keyResultIds: ['kr-1', 'kr-2'] },
  // People & Culture Skills
  { id: 'skill-3', name: 'Employee Engagement', nameEs: 'Compromiso del Empleado', initialValue: 3, currentValue: 4, teamId: 'team-2', keyResultIds: ['kr-3', 'kr-4', 'kr-5'] },
  { id: 'skill-4', name: 'Learning Design', nameEs: 'Diseño de Aprendizaje', initialValue: 2, currentValue: 4, teamId: 'team-2', keyResultIds: ['kr-3'] },
  // Revenue Operations Skills
  { id: 'skill-5', name: 'Revenue Optimization', nameEs: 'Optimización de Ingresos', initialValue: 3, currentValue: 4, teamId: 'team-3', keyResultIds: ['kr-6', 'kr-7'] },
  { id: 'skill-6', name: 'Customer Success', nameEs: 'Éxito del Cliente', initialValue: 2, currentValue: 3, teamId: 'team-3', keyResultIds: ['kr-6', 'kr-8'] },
  { id: 'skill-7', name: 'Churn Prevention', nameEs: 'Prevención de Abandono', initialValue: 2, currentValue: 2, teamId: 'team-3', keyResultIds: ['kr-8'] },
  // Product & Engineering Skills
  { id: 'skill-8', name: 'Product Development', nameEs: 'Desarrollo de Producto', initialValue: 4, currentValue: 3, teamId: 'team-4', keyResultIds: ['kr-9'] },
  // Structure Skills
  { id: 'skill-9', name: 'Organizational Design', nameEs: 'Diseño Organizacional', initialValue: 2, currentValue: 3, teamId: 'team-1', keyResultIds: ['kr-10'] },
  { id: 'skill-10', name: 'Cross-functional Collaboration', nameEs: 'Colaboración Interfuncional', initialValue: 2, currentValue: 4, teamId: 'team-1', keyResultIds: ['kr-10', 'kr-11'] },
  // Innovation Skills
  { id: 'skill-11', name: 'Lean Experimentation', nameEs: 'Experimentación Lean', initialValue: 3, currentValue: 5, teamId: 'team-5', keyResultIds: ['kr-12', 'kr-14'] },
  { id: 'skill-12', name: 'Rapid Prototyping', nameEs: 'Prototipado Rápido', initialValue: 2, currentValue: 4, teamId: 'team-5', keyResultIds: ['kr-12'] },
  // Additional Skills for new teams
  { id: 'skill-13', name: 'Marketing Analytics', nameEs: 'Analíticas de Marketing', initialValue: 3, currentValue: 4, teamId: 'team-6', keyResultIds: ['kr-7'] },
  { id: 'skill-14', name: 'Brand Strategy', nameEs: 'Estrategia de Marca', initialValue: 3, currentValue: 4, teamId: 'team-6', keyResultIds: ['kr-7'] },
  { id: 'skill-15', name: 'Financial Planning', nameEs: 'Planificación Financiera', initialValue: 4, currentValue: 5, teamId: 'team-7', keyResultIds: ['kr-6', 'kr-14'] },
  { id: 'skill-16', name: 'Risk Management', nameEs: 'Gestión de Riesgos', initialValue: 3, currentValue: 4, teamId: 'team-7', keyResultIds: ['kr-6'] },
  { id: 'skill-17', name: 'IT Security', nameEs: 'Seguridad TI', initialValue: 4, currentValue: 4, teamId: 'team-8', keyResultIds: ['kr-9'] },
  { id: 'skill-18', name: 'System Architecture', nameEs: 'Arquitectura de Sistemas', initialValue: 3, currentValue: 4, teamId: 'team-8', keyResultIds: ['kr-9'] },
  { id: 'skill-19', name: 'Legal Compliance', nameEs: 'Cumplimiento Legal', initialValue: 4, currentValue: 4, teamId: 'team-9', keyResultIds: ['kr-10'] },
  { id: 'skill-20', name: 'Policy Development', nameEs: 'Desarrollo de Políticas', initialValue: 3, currentValue: 4, teamId: 'team-9', keyResultIds: ['kr-10', 'kr-11'] },
  { id: 'skill-21', name: 'Process Optimization', nameEs: 'Optimización de Procesos', initialValue: 3, currentValue: 5, teamId: 'team-10', keyResultIds: ['kr-10', 'kr-11'] },
  { id: 'skill-22', name: 'Quality Management', nameEs: 'Gestión de Calidad', initialValue: 3, currentValue: 4, teamId: 'team-10', keyResultIds: ['kr-9'] },
];

export const teams: Team[] = [
  { 
    id: 'team-1', 
    name: 'Executive Leadership', 
    nameEs: 'Liderazgo Ejecutivo',
    description: 'Strategic direction and organizational transformation',
    descriptionEs: 'Dirección estratégica y transformación organizacional',
    icon: '👔',
    members: [
      { id: 'member-1', name: 'María García', role: 'CEO', roleEs: 'CEO', unitType: 'core', area: 'Executive Office', areaEs: 'Oficina Ejecutiva' },
      { id: 'member-2', name: 'Carlos Rodríguez', role: 'COO', roleEs: 'COO', unitType: 'core', area: 'Executive Office', areaEs: 'Oficina Ejecutiva' },
      { id: 'member-3', name: 'Ana Martínez', role: 'CHRO', roleEs: 'CHRO', unitType: 'core', area: 'Human Resources', areaEs: 'Recursos Humanos' },
      { id: 'member-4', name: 'Luis Fernández', role: 'CFO', roleEs: 'CFO', unitType: 'core', area: 'Finance', areaEs: 'Finanzas' },
      { id: 'member-5', name: 'Elena Torres', role: 'CTO', roleEs: 'CTO', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-6', name: 'Pablo Sánchez', role: 'Strategy Director', roleEs: 'Director de Estrategia', unitType: 'extended', area: 'Strategy', areaEs: 'Estrategia' },
      { id: 'member-7', name: 'Laura Díaz', role: 'Transformation Lead', roleEs: 'Líder de Transformación', unitType: 'extended', area: 'Consulting', areaEs: 'Consultoría' },
      { id: 'member-8', name: 'Roberto Moreno', role: 'Executive Assistant', roleEs: 'Asistente Ejecutivo', unitType: 'extended', area: 'Executive Office', areaEs: 'Oficina Ejecutiva' },
    ],
    alignment: 92, 
    keyResultIds: ['kr-1', 'kr-2', 'kr-10', 'kr-11', 'kr-14'], 
    skillIds: ['skill-1', 'skill-2', 'skill-9', 'skill-10'],
    unitType: 'core',
    parentUnitIds: ['unit-1'],
    metrics: { leadTime: 12, cycleTime: 5, throughput: 8, velocity: 34, happinessIndex: 8.2, leadTimeTrend: 'improving', cycleTimeTrend: 'stable', throughputTrend: 'improving', velocityTrend: 'improving', happinessTrend: 'stable', history: [
      { sprint: 'S1', leadTime: 18, cycleTime: 8, throughput: 5, velocity: 25, happinessIndex: 7.2 },
      { sprint: 'S2', leadTime: 16, cycleTime: 7, throughput: 6, velocity: 28, happinessIndex: 7.5 },
      { sprint: 'S3', leadTime: 15, cycleTime: 6, throughput: 6, velocity: 30, happinessIndex: 7.8 },
      { sprint: 'S4', leadTime: 14, cycleTime: 6, throughput: 7, velocity: 31, happinessIndex: 8.0 },
      { sprint: 'S5', leadTime: 13, cycleTime: 5, throughput: 7, velocity: 33, happinessIndex: 8.1 },
      { sprint: 'S6', leadTime: 12, cycleTime: 5, throughput: 8, velocity: 34, happinessIndex: 8.2 },
    ] },
  },
  { 
    id: 'team-2', 
    name: 'People & Culture', 
    nameEs: 'Personas y Cultura',
    description: 'Employee experience and organizational culture',
    descriptionEs: 'Experiencia del empleado y cultura organizacional',
    icon: '💛',
    members: [
      { id: 'member-9', name: 'Carmen López', role: 'People Director', roleEs: 'Directora de Personas', unitType: 'core', area: 'Human Resources', areaEs: 'Recursos Humanos' },
      { id: 'member-10', name: 'Diego Ramírez', role: 'Culture Lead', roleEs: 'Líder de Cultura', unitType: 'core', area: 'Human Resources', areaEs: 'Recursos Humanos' },
      { id: 'member-11', name: 'Isabel Navarro', role: 'Talent Acquisition', roleEs: 'Adquisición de Talento', unitType: 'core', area: 'Human Resources', areaEs: 'Recursos Humanos' },
      { id: 'member-12', name: 'Fernando Castro', role: 'Learning & Development', roleEs: 'Aprendizaje y Desarrollo', unitType: 'core', area: 'Human Resources', areaEs: 'Recursos Humanos' },
      { id: 'member-13', name: 'Lucía Vega', role: 'Employee Experience', roleEs: 'Experiencia del Empleado', unitType: 'extended', area: 'Operations', areaEs: 'Operaciones' },
      { id: 'member-14', name: 'Miguel Ruiz', role: 'HR Business Partner', roleEs: 'HR Business Partner', unitType: 'extended', area: 'Consulting', areaEs: 'Consultoría' },
      { id: 'member-15', name: 'Andrea Molina', role: 'Compensation & Benefits', roleEs: 'Compensación y Beneficios', unitType: 'extended', area: 'Finance', areaEs: 'Finanzas' },
      { id: 'member-16', name: 'Javier Ortiz', role: 'HR Coordinator', roleEs: 'Coordinador de RH', unitType: 'extended', area: 'Human Resources', areaEs: 'Recursos Humanos' },
    ],
    alignment: 88, 
    keyResultIds: ['kr-2', 'kr-3', 'kr-4', 'kr-5', 'kr-11'], 
    skillIds: ['skill-3', 'skill-4'],
    unitType: 'core',
    parentUnitIds: ['unit-1'],
    metrics: { leadTime: 10, cycleTime: 4, throughput: 12, velocity: 42, happinessIndex: 8.8, leadTimeTrend: 'stable', cycleTimeTrend: 'improving', throughputTrend: 'improving', velocityTrend: 'stable', happinessTrend: 'improving', history: [
      { sprint: 'S1', leadTime: 11, cycleTime: 6, throughput: 8, velocity: 38, happinessIndex: 7.9 },
      { sprint: 'S2', leadTime: 10, cycleTime: 6, throughput: 9, velocity: 39, happinessIndex: 8.1 },
      { sprint: 'S3', leadTime: 10, cycleTime: 5, throughput: 10, velocity: 40, happinessIndex: 8.3 },
      { sprint: 'S4', leadTime: 10, cycleTime: 5, throughput: 11, velocity: 41, happinessIndex: 8.5 },
      { sprint: 'S5', leadTime: 10, cycleTime: 4, throughput: 11, velocity: 42, happinessIndex: 8.6 },
      { sprint: 'S6', leadTime: 10, cycleTime: 4, throughput: 12, velocity: 42, happinessIndex: 8.8 },
    ] },
  },
  { 
    id: 'team-3', 
    name: 'Revenue Operations', 
    nameEs: 'Operaciones de Ingresos',
    description: 'Sales, customer success and revenue growth',
    descriptionEs: 'Ventas, éxito del cliente y crecimiento de ingresos',
    icon: '💰',
    members: [
      { id: 'member-21', name: 'Alejandro Jiménez', role: 'Revenue Director', roleEs: 'Director de Ingresos', unitType: 'core', area: 'Sales', areaEs: 'Ventas' },
      { id: 'member-22', name: 'Beatriz Romero', role: 'Sales Manager', roleEs: 'Gerente de Ventas', unitType: 'core', area: 'Sales', areaEs: 'Ventas' },
      { id: 'member-23', name: 'Cristian Delgado', role: 'Account Executive', roleEs: 'Ejecutivo de Cuenta', unitType: 'core', area: 'Sales', areaEs: 'Ventas' },
      { id: 'member-24', name: 'Diana Peña', role: 'Account Executive', roleEs: 'Ejecutivo de Cuenta', unitType: 'core', area: 'Sales', areaEs: 'Ventas' },
      { id: 'member-25', name: 'Eduardo Silva', role: 'Sales Development Rep', roleEs: 'Rep. Desarrollo de Ventas', unitType: 'core', area: 'Sales', areaEs: 'Ventas' },
      { id: 'member-26', name: 'Francisca Muñoz', role: 'Customer Success Manager', roleEs: 'Gerente de Éxito del Cliente', unitType: 'core', area: 'Customer Success', areaEs: 'Éxito del Cliente' },
      { id: 'member-27', name: 'Gabriel Reyes', role: 'Customer Success Manager', roleEs: 'Gerente de Éxito del Cliente', unitType: 'extended', area: 'Customer Success', areaEs: 'Éxito del Cliente' },
      { id: 'member-28', name: 'Helena Castro', role: 'Revenue Analyst', roleEs: 'Analista de Ingresos', unitType: 'extended', area: 'Finance', areaEs: 'Finanzas' },
      { id: 'member-29', name: 'Iván Morales', role: 'Sales Operations', roleEs: 'Operaciones de Ventas', unitType: 'extended', area: 'Operations', areaEs: 'Operaciones' },
      { id: 'member-30', name: 'Julia Paredes', role: 'Renewals Specialist', roleEs: 'Especialista en Renovaciones', unitType: 'extended', area: 'Sales', areaEs: 'Ventas' },
    ],
    alignment: 75, 
    keyResultIds: ['kr-6', 'kr-7', 'kr-8', 'kr-13'], 
    skillIds: ['skill-5', 'skill-6', 'skill-7'],
    unitType: 'core',
    parentUnitIds: ['unit-2'],
    metrics: { leadTime: 15, cycleTime: 7, throughput: 10, velocity: 38, happinessIndex: 7.1, leadTimeTrend: 'declining', cycleTimeTrend: 'stable', throughputTrend: 'stable', velocityTrend: 'declining', happinessTrend: 'declining', history: [
      { sprint: 'S1', leadTime: 12, cycleTime: 6, throughput: 12, velocity: 44, happinessIndex: 8.0 },
      { sprint: 'S2', leadTime: 12, cycleTime: 6, throughput: 11, velocity: 42, happinessIndex: 7.8 },
      { sprint: 'S3', leadTime: 13, cycleTime: 7, throughput: 11, velocity: 41, happinessIndex: 7.6 },
      { sprint: 'S4', leadTime: 14, cycleTime: 7, throughput: 10, velocity: 40, happinessIndex: 7.4 },
      { sprint: 'S5', leadTime: 14, cycleTime: 7, throughput: 10, velocity: 39, happinessIndex: 7.2 },
      { sprint: 'S6', leadTime: 15, cycleTime: 7, throughput: 10, velocity: 38, happinessIndex: 7.1 },
    ] },
  },
  { 
    id: 'team-4', 
    name: 'Product & Engineering', 
    nameEs: 'Producto e Ingeniería',
    description: 'Product development and technical innovation',
    descriptionEs: 'Desarrollo de producto e innovación técnica',
    icon: '⚙️',
    members: [
      { id: 'member-46', name: 'Adrián Méndez', role: 'VP of Engineering', roleEs: 'VP de Ingeniería', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-47', name: 'Bianca Salazar', role: 'Product Director', roleEs: 'Directora de Producto', unitType: 'core', area: 'Product', areaEs: 'Producto' },
      { id: 'member-48', name: 'César Guerrero', role: 'Tech Lead', roleEs: 'Líder Técnico', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-49', name: 'Daniela Rivas', role: 'Product Manager', roleEs: 'Gerente de Producto', unitType: 'core', area: 'Product', areaEs: 'Producto' },
      { id: 'member-50', name: 'Ernesto Medina', role: 'Senior Engineer', roleEs: 'Ingeniero Senior', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-51', name: 'Fabiola Luna', role: 'Senior Engineer', roleEs: 'Ingeniero Senior', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-52', name: 'Gonzalo Vásquez', role: 'Full Stack Developer', roleEs: 'Desarrollador Full Stack', unitType: 'extended', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-53', name: 'Hilda Peralta', role: 'Full Stack Developer', roleEs: 'Desarrollador Full Stack', unitType: 'extended', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-54', name: 'Ignacio Córdova', role: 'Backend Developer', roleEs: 'Desarrollador Backend', unitType: 'extended', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-55', name: 'Jimena Orozco', role: 'UX Designer', roleEs: 'Diseñador UX', unitType: 'extended', area: 'Design', areaEs: 'Diseño' },
      { id: 'member-56', name: 'Leonardo Ibarra', role: 'QA Engineer', roleEs: 'Ingeniero QA', unitType: 'extended', area: 'Quality', areaEs: 'Calidad' },
    ],
    alignment: 60, 
    keyResultIds: ['kr-4', 'kr-9'], 
    skillIds: ['skill-8'],
    unitType: 'extended',
    parentUnitIds: ['unit-2'],
    metrics: { leadTime: 18, cycleTime: 8, throughput: 15, velocity: 55, happinessIndex: 6.5, leadTimeTrend: 'declining', cycleTimeTrend: 'declining', throughputTrend: 'improving', velocityTrend: 'stable', happinessTrend: 'declining', history: [
      { sprint: 'S1', leadTime: 14, cycleTime: 5, throughput: 10, velocity: 52, happinessIndex: 7.8 },
      { sprint: 'S2', leadTime: 15, cycleTime: 6, throughput: 11, velocity: 53, happinessIndex: 7.5 },
      { sprint: 'S3', leadTime: 16, cycleTime: 6, throughput: 12, velocity: 54, happinessIndex: 7.2 },
      { sprint: 'S4', leadTime: 17, cycleTime: 7, throughput: 13, velocity: 55, happinessIndex: 6.9 },
      { sprint: 'S5', leadTime: 17, cycleTime: 7, throughput: 14, velocity: 55, happinessIndex: 6.7 },
      { sprint: 'S6', leadTime: 18, cycleTime: 8, throughput: 15, velocity: 55, happinessIndex: 6.5 },
    ] },
  },
  { 
    id: 'team-5', 
    name: 'Innovation Lab', 
    nameEs: 'Laboratorio de Innovación',
    description: 'New ventures and business experimentation',
    descriptionEs: 'Nuevos emprendimientos y experimentación de negocios',
    icon: '🚀',
    members: [
      { id: 'member-81', name: 'Alberto Cifuentes', role: 'Innovation Director', roleEs: 'Director de Innovación', unitType: 'core', area: 'Innovation', areaEs: 'Innovación' },
      { id: 'member-82', name: 'Bárbara Espinosa', role: 'Innovation Lead', roleEs: 'Líder de Innovación', unitType: 'core', area: 'Innovation', areaEs: 'Innovación' },
      { id: 'member-83', name: 'Claudio Figueroa', role: 'Venture Designer', roleEs: 'Diseñador de Ventures', unitType: 'core', area: 'Innovation', areaEs: 'Innovación' },
      { id: 'member-84', name: 'Delia Godoy', role: 'Business Analyst', roleEs: 'Analista de Negocios', unitType: 'extended', area: 'Strategy', areaEs: 'Estrategia' },
      { id: 'member-85', name: 'Esteban Henríquez', role: 'Prototype Developer', roleEs: 'Desarrollador de Prototipos', unitType: 'extended', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-86', name: 'Florencia Jara', role: 'Research Analyst', roleEs: 'Analista de Investigación', unitType: 'extended', area: 'Research', areaEs: 'Investigación' },
    ],
    alignment: 95, 
    keyResultIds: ['kr-7', 'kr-12', 'kr-13', 'kr-14'], 
    skillIds: ['skill-11', 'skill-12'],
    unitType: 'core',
    parentUnitIds: ['unit-3'],
    metrics: { leadTime: 7, cycleTime: 3, throughput: 18, velocity: 48, happinessIndex: 9.2, leadTimeTrend: 'improving', cycleTimeTrend: 'improving', throughputTrend: 'improving', velocityTrend: 'improving', happinessTrend: 'improving', history: [
      { sprint: 'S1', leadTime: 12, cycleTime: 6, throughput: 10, velocity: 35, happinessIndex: 8.0 },
      { sprint: 'S2', leadTime: 11, cycleTime: 5, throughput: 12, velocity: 38, happinessIndex: 8.3 },
      { sprint: 'S3', leadTime: 10, cycleTime: 5, throughput: 14, velocity: 41, happinessIndex: 8.6 },
      { sprint: 'S4', leadTime: 9, cycleTime: 4, throughput: 15, velocity: 44, happinessIndex: 8.9 },
      { sprint: 'S5', leadTime: 8, cycleTime: 3, throughput: 17, velocity: 46, happinessIndex: 9.0 },
      { sprint: 'S6', leadTime: 7, cycleTime: 3, throughput: 18, velocity: 48, happinessIndex: 9.2 },
    ] },
  },
  { 
    id: 'team-6', 
    name: 'Marketing & Communications', 
    nameEs: 'Marketing y Comunicaciones',
    description: 'Brand, marketing and corporate communications',
    descriptionEs: 'Marca, marketing y comunicaciones corporativas',
    icon: '📢',
    members: [
      { id: 'member-87', name: 'Valentina Rojas', role: 'Marketing Director', roleEs: 'Directora de Marketing', unitType: 'core', area: 'Marketing', areaEs: 'Marketing' },
      { id: 'member-88', name: 'Sebastián Mora', role: 'Brand Manager', roleEs: 'Gerente de Marca', unitType: 'core', area: 'Marketing', areaEs: 'Marketing' },
      { id: 'member-89', name: 'Catalina Vidal', role: 'Content Lead', roleEs: 'Líder de Contenido', unitType: 'core', area: 'Marketing', areaEs: 'Marketing' },
      { id: 'member-90', name: 'Andrés Pizarro', role: 'Digital Marketing', roleEs: 'Marketing Digital', unitType: 'core', area: 'Marketing', areaEs: 'Marketing' },
      { id: 'member-91', name: 'Fernanda Silva', role: 'Communications Lead', roleEs: 'Líder de Comunicaciones', unitType: 'extended', area: 'Communications', areaEs: 'Comunicaciones' },
      { id: 'member-92', name: 'Ricardo Bravo', role: 'Social Media Manager', roleEs: 'Gerente de Redes Sociales', unitType: 'extended', area: 'Marketing', areaEs: 'Marketing' },
      { id: 'member-93', name: 'Mónica Araya', role: 'Marketing Analyst', roleEs: 'Analista de Marketing', unitType: 'extended', area: 'Analytics', areaEs: 'Analíticas' },
    ],
    alignment: 78, 
    keyResultIds: ['kr-7'], 
    skillIds: ['skill-13', 'skill-14'],
    unitType: 'extended',
    parentUnitIds: ['unit-2'],
    metrics: { leadTime: 9, cycleTime: 4, throughput: 14, velocity: 36, happinessIndex: 7.8, leadTimeTrend: 'stable', cycleTimeTrend: 'improving', throughputTrend: 'stable', velocityTrend: 'improving', happinessTrend: 'stable', history: [
      { sprint: 'S1', leadTime: 10, cycleTime: 6, throughput: 13, velocity: 30, happinessIndex: 7.5 },
      { sprint: 'S2', leadTime: 9, cycleTime: 6, throughput: 13, velocity: 32, happinessIndex: 7.6 },
      { sprint: 'S3', leadTime: 9, cycleTime: 5, throughput: 14, velocity: 33, happinessIndex: 7.7 },
      { sprint: 'S4', leadTime: 9, cycleTime: 5, throughput: 14, velocity: 34, happinessIndex: 7.8 },
      { sprint: 'S5', leadTime: 9, cycleTime: 4, throughput: 14, velocity: 35, happinessIndex: 7.8 },
      { sprint: 'S6', leadTime: 9, cycleTime: 4, throughput: 14, velocity: 36, happinessIndex: 7.8 },
    ] },
  },
  { 
    id: 'team-7', 
    name: 'Finance & Accounting', 
    nameEs: 'Finanzas y Contabilidad',
    description: 'Financial planning and corporate accounting',
    descriptionEs: 'Planificación financiera y contabilidad corporativa',
    icon: '📊',
    members: [
      { id: 'member-94', name: 'Rodrigo Campos', role: 'Finance Director', roleEs: 'Director de Finanzas', unitType: 'core', area: 'Finance', areaEs: 'Finanzas' },
      { id: 'member-95', name: 'Patricia Herrera', role: 'Controller', roleEs: 'Controller', unitType: 'core', area: 'Finance', areaEs: 'Finanzas' },
      { id: 'member-96', name: 'Mauricio Lagos', role: 'FP&A Manager', roleEs: 'Gerente de FP&A', unitType: 'core', area: 'Finance', areaEs: 'Finanzas' },
      { id: 'member-97', name: 'Carolina Núñez', role: 'Treasury', roleEs: 'Tesorería', unitType: 'extended', area: 'Finance', areaEs: 'Finanzas' },
      { id: 'member-98', name: 'Jorge Valdés', role: 'Senior Accountant', roleEs: 'Contador Senior', unitType: 'extended', area: 'Accounting', areaEs: 'Contabilidad' },
      { id: 'member-99', name: 'Daniela Fuentes', role: 'Tax Specialist', roleEs: 'Especialista Tributario', unitType: 'extended', area: 'Tax', areaEs: 'Impuestos' },
    ],
    alignment: 82, 
    keyResultIds: ['kr-6', 'kr-14'], 
    skillIds: ['skill-15', 'skill-16'],
    unitType: 'core',
    parentUnitIds: ['unit-2'],
    metrics: { leadTime: 14, cycleTime: 6, throughput: 9, velocity: 30, happinessIndex: 7.5, leadTimeTrend: 'stable', cycleTimeTrend: 'stable', throughputTrend: 'stable', velocityTrend: 'stable', happinessTrend: 'improving', history: [
      { sprint: 'S1', leadTime: 14, cycleTime: 7, throughput: 8, velocity: 28, happinessIndex: 6.8 },
      { sprint: 'S2', leadTime: 14, cycleTime: 7, throughput: 8, velocity: 29, happinessIndex: 7.0 },
      { sprint: 'S3', leadTime: 14, cycleTime: 6, throughput: 9, velocity: 29, happinessIndex: 7.1 },
      { sprint: 'S4', leadTime: 14, cycleTime: 6, throughput: 9, velocity: 30, happinessIndex: 7.2 },
      { sprint: 'S5', leadTime: 14, cycleTime: 6, throughput: 9, velocity: 30, happinessIndex: 7.4 },
      { sprint: 'S6', leadTime: 14, cycleTime: 6, throughput: 9, velocity: 30, happinessIndex: 7.5 },
    ] },
  },
  { 
    id: 'team-8', 
    name: 'IT & Infrastructure', 
    nameEs: 'TI e Infraestructura',
    description: 'IT systems, security and infrastructure',
    descriptionEs: 'Sistemas TI, seguridad e infraestructura',
    icon: '🖥️',
    members: [
      { id: 'member-100', name: 'Manuel Ortega', role: 'IT Director', roleEs: 'Director de TI', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-101', name: 'Claudia Sepúlveda', role: 'Security Lead', roleEs: 'Líder de Seguridad', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-102', name: 'Felipe Aravena', role: 'Infrastructure Manager', roleEs: 'Gerente de Infraestructura', unitType: 'core', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-103', name: 'Lorena Carrasco', role: 'IT Support Lead', roleEs: 'Líder de Soporte TI', unitType: 'extended', area: 'Operations', areaEs: 'Operaciones' },
      { id: 'member-104', name: 'Nicolás Soto', role: 'Network Admin', roleEs: 'Admin de Redes', unitType: 'extended', area: 'Technology', areaEs: 'Tecnología' },
      { id: 'member-105', name: 'Alejandra Peña', role: 'Systems Analyst', roleEs: 'Analista de Sistemas', unitType: 'extended', area: 'Technology', areaEs: 'Tecnología' },
    ],
    alignment: 70, 
    keyResultIds: ['kr-9'], 
    skillIds: ['skill-17', 'skill-18'],
    unitType: 'extended',
    parentUnitIds: ['unit-2'],
    metrics: { leadTime: 11, cycleTime: 5, throughput: 11, velocity: 40, happinessIndex: 7.9, leadTimeTrend: 'improving', cycleTimeTrend: 'improving', throughputTrend: 'improving', velocityTrend: 'stable', happinessTrend: 'stable', history: [
      { sprint: 'S1', leadTime: 14, cycleTime: 7, throughput: 8, velocity: 38, happinessIndex: 7.5 },
      { sprint: 'S2', leadTime: 13, cycleTime: 7, throughput: 9, velocity: 39, happinessIndex: 7.6 },
      { sprint: 'S3', leadTime: 13, cycleTime: 6, throughput: 9, velocity: 39, happinessIndex: 7.7 },
      { sprint: 'S4', leadTime: 12, cycleTime: 6, throughput: 10, velocity: 40, happinessIndex: 7.8 },
      { sprint: 'S5', leadTime: 11, cycleTime: 5, throughput: 10, velocity: 40, happinessIndex: 7.9 },
      { sprint: 'S6', leadTime: 11, cycleTime: 5, throughput: 11, velocity: 40, happinessIndex: 7.9 },
    ] },
  },
  { 
    id: 'team-9', 
    name: 'Legal & Compliance', 
    nameEs: 'Legal y Cumplimiento',
    description: 'Legal affairs, compliance and governance',
    descriptionEs: 'Asuntos legales, cumplimiento y gobernanza',
    icon: '⚖️',
    members: [
      { id: 'member-106', name: 'Gonzalo Martín', role: 'General Counsel', roleEs: 'Consejero General', unitType: 'core', area: 'Legal', areaEs: 'Legal' },
      { id: 'member-107', name: 'Francisca Guzmán', role: 'Compliance Director', roleEs: 'Directora de Cumplimiento', unitType: 'core', area: 'Legal', areaEs: 'Legal' },
      { id: 'member-108', name: 'Tomás Rivera', role: 'Corporate Lawyer', roleEs: 'Abogado Corporativo', unitType: 'core', area: 'Legal', areaEs: 'Legal' },
      { id: 'member-109', name: 'Victoria Salinas', role: 'Privacy Officer', roleEs: 'Oficial de Privacidad', unitType: 'extended', area: 'Legal', areaEs: 'Legal' },
      { id: 'member-110', name: 'Eduardo Castillo', role: 'Contract Manager', roleEs: 'Gerente de Contratos', unitType: 'extended', area: 'Legal', areaEs: 'Legal' },
    ],
    alignment: 85, 
    keyResultIds: ['kr-10'], 
    skillIds: ['skill-19', 'skill-20'],
    unitType: 'extended',
    parentUnitIds: ['unit-1'],
    metrics: { leadTime: 16, cycleTime: 7, throughput: 7, velocity: 28, happinessIndex: 7.0, leadTimeTrend: 'stable', cycleTimeTrend: 'declining', throughputTrend: 'stable', velocityTrend: 'declining', happinessTrend: 'stable', history: [
      { sprint: 'S1', leadTime: 15, cycleTime: 5, throughput: 8, velocity: 32, happinessIndex: 7.2 },
      { sprint: 'S2', leadTime: 15, cycleTime: 5, throughput: 7, velocity: 31, happinessIndex: 7.1 },
      { sprint: 'S3', leadTime: 16, cycleTime: 6, throughput: 7, velocity: 30, happinessIndex: 7.0 },
      { sprint: 'S4', leadTime: 16, cycleTime: 6, throughput: 7, velocity: 29, happinessIndex: 7.0 },
      { sprint: 'S5', leadTime: 16, cycleTime: 7, throughput: 7, velocity: 28, happinessIndex: 7.0 },
      { sprint: 'S6', leadTime: 16, cycleTime: 7, throughput: 7, velocity: 28, happinessIndex: 7.0 },
    ] },
  },
  { 
    id: 'team-10', 
    name: 'Operations Excellence', 
    nameEs: 'Excelencia Operacional',
    description: 'Process optimization and quality management',
    descriptionEs: 'Optimización de procesos y gestión de calidad',
    icon: '⭐',
    members: [
      { id: 'member-111', name: 'Ignacio Poblete', role: 'Operations Director', roleEs: 'Director de Operaciones', unitType: 'core', area: 'Operations', areaEs: 'Operaciones' },
      { id: 'member-112', name: 'Macarena Flores', role: 'Process Lead', roleEs: 'Líder de Procesos', unitType: 'core', area: 'Operations', areaEs: 'Operaciones' },
      { id: 'member-113', name: 'Roberto Vargas', role: 'Quality Manager', roleEs: 'Gerente de Calidad', unitType: 'core', area: 'Quality', areaEs: 'Calidad' },
      { id: 'member-114', name: 'Carla Montenegro', role: 'Continuous Improvement', roleEs: 'Mejora Continua', unitType: 'extended', area: 'Operations', areaEs: 'Operaciones' },
      { id: 'member-115', name: 'Pablo Espinoza', role: 'Project Manager', roleEs: 'Gerente de Proyectos', unitType: 'extended', area: 'PMO', areaEs: 'PMO' },
      { id: 'member-116', name: 'Camila Rodríguez', role: 'Business Analyst', roleEs: 'Analista de Negocios', unitType: 'extended', area: 'Strategy', areaEs: 'Estrategia' },
    ],
    alignment: 80, 
    keyResultIds: ['kr-10', 'kr-11', 'kr-9'], 
    skillIds: ['skill-21', 'skill-22'],
    unitType: 'core',
    parentUnitIds: ['unit-1'],
    metrics: { leadTime: 8, cycleTime: 3, throughput: 16, velocity: 45, happinessIndex: 8.5, leadTimeTrend: 'improving', cycleTimeTrend: 'improving', throughputTrend: 'improving', velocityTrend: 'improving', happinessTrend: 'improving', history: [
      { sprint: 'S1', leadTime: 14, cycleTime: 6, throughput: 10, velocity: 32, happinessIndex: 7.5 },
      { sprint: 'S2', leadTime: 13, cycleTime: 5, throughput: 11, velocity: 35, happinessIndex: 7.8 },
      { sprint: 'S3', leadTime: 11, cycleTime: 5, throughput: 13, velocity: 38, happinessIndex: 8.0 },
      { sprint: 'S4', leadTime: 10, cycleTime: 4, throughput: 14, velocity: 41, happinessIndex: 8.2 },
      { sprint: 'S5', leadTime: 9, cycleTime: 3, throughput: 15, velocity: 43, happinessIndex: 8.4 },
      { sprint: 'S6', leadTime: 8, cycleTime: 3, throughput: 16, velocity: 45, happinessIndex: 8.5 },
    ] },
  },
];

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    message: 'Product Development skill decreased while objective deadline approaches. Immediate action required.',
    messageEs: 'La habilidad de Desarrollo de Producto disminuyó mientras se acerca la fecha límite del objetivo. Se requiere acción inmediata.',
    keyResultId: 'kr-9',
    objectiveId: 'obj-6',
    timestamp: new Date('2024-01-15'),
  },
  {
    id: 'alert-2',
    type: 'warning',
    message: 'Customer churn reduction Key Result is below target. Skills are improving but results are not following.',
    messageEs: 'El Resultado Clave de reducción de abandono de clientes está por debajo del objetivo. Las habilidades mejoran pero los resultados no siguen.',
    keyResultId: 'kr-8',
    objectiveId: 'obj-5',
    timestamp: new Date('2024-01-14'),
  },
  {
    id: 'alert-3',
    type: 'warning',
    message: 'Recognition program implementation is delayed. Review timeline and resource allocation.',
    messageEs: 'La implementación del programa de reconocimiento está retrasada. Revisar cronograma y asignación de recursos.',
    keyResultId: 'kr-5',
    objectiveId: 'obj-3',
    timestamp: new Date('2024-01-12'),
  },
];

// ============= Helper Functions =============

export const getSkillColor = (value: number): string => {
  if (value <= 2) return 'status-critical';
  if (value <= 3) return 'status-warning';
  return 'status-success';
};

export const getStatusColor = (status: 'on-track' | 'attention' | 'critical'): string => {
  switch (status) {
    case 'on-track': return 'status-success';
    case 'attention': return 'status-warning';
    case 'critical': return 'status-critical';
  }
};

export const getDynamicColor = (dynamicId: string): string => {
  const dynamic = dynamics.find(d => d.id === dynamicId);
  return dynamic?.color || 'primary';
};

export const getObjectiveById = (id: string) => objectives.find(o => o.id === id);
export const getDynamicById = (id: string) => dynamics.find(d => d.id === id);
export const getTeamById = (id: string) => teams.find(t => t.id === id);
export const getKeyResultById = (id: string) => keyResults.find(kr => kr.id === id);
export const getSkillById = (id: string) => skills.find(s => s.id === id);
export const getStrategicUnitById = (id: string) => strategicUnits.find(u => u.id === id);

export const getKeyResultsForObjective = (objectiveId: string) => 
  keyResults.filter(kr => kr.objectiveId === objectiveId);

export const getObjectivesForDynamic = (dynamicId: string) => 
  objectives.filter(obj => obj.dynamicId === dynamicId);

export const getKeyResultsForTeam = (teamId: string) => 
  keyResults.filter(kr => kr.teamIds.includes(teamId));

export const getTeamsForKeyResult = (keyResultId: string) => {
  const kr = getKeyResultById(keyResultId);
  if (!kr) return [];
  return kr.teamIds.map(id => getTeamById(id)).filter(Boolean);
};

export const getSkillsForTeam = (teamId: string) => 
  skills.filter(s => s.teamId === teamId);

export const getUnitsForTeam = (teamId: string) => {
  const team = getTeamById(teamId);
  if (!team) return [];
  return team.parentUnitIds.map(id => getStrategicUnitById(id)).filter(Boolean);
};
