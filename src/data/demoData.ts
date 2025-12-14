export interface Objective {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  dynamicId: string;
  teamId: string;
  progress: number;
  investment: number;
  status: 'on-track' | 'attention' | 'critical';
  skills: string[];
}

export interface Skill {
  id: string;
  name: string;
  nameEs: string;
  initialValue: number;
  currentValue: number;
  teamId: string;
  objectiveIds: string[];
}

export interface Team {
  id: string;
  name: string;
  nameEs: string;
  members: number;
  alignment: number;
  objectiveIds: string[];
  skillIds: string[];
}

export interface Dynamic {
  id: string;
  name: string;
  nameEs: string;
  color: string;
  colorLight: string;
  objectives: string[];
  progress: number;
  investment: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  messageEs: string;
  objectiveId?: string;
  timestamp: Date;
}

export interface Purpose {
  problem: string;
  problemEs: string;
  impact: string;
  impactEs: string;
}

export const purpose: Purpose = {
  problem: "Organizations struggle to adapt quickly to market changes while maintaining alignment between strategy, culture, and operations. This leads to wasted resources, disengaged teams, and missed opportunities for innovation.",
  problemEs: "Las organizaciones luchan por adaptarse rápidamente a los cambios del mercado mientras mantienen la alineación entre estrategia, cultura y operaciones. Esto lleva a recursos desperdiciados, equipos desvinculados y oportunidades perdidas de innovación.",
  impact: "We empower organizations to become truly adaptive, creating workplaces where people thrive, innovation flourishes, and sustainable growth becomes the natural outcome of aligned purpose, culture, and business dynamics.",
  impactEs: "Empoderamos a las organizaciones para que sean verdaderamente adaptativas, creando lugares de trabajo donde las personas prosperan, la innovación florece y el crecimiento sostenible se convierte en el resultado natural de la alineación entre propósito, cultura y dinámicas de negocio.",
};

export const dynamics: Dynamic[] = [
  {
    id: 'purpose',
    name: 'Purpose',
    nameEs: 'Propósito',
    color: 'adaptativa-blue',
    colorLight: 'adaptativa-blue-light',
    objectives: ['obj-1'],
    progress: 85,
    investment: 120000,
  },
  {
    id: 'culture',
    name: 'Culture',
    nameEs: 'Cultura',
    color: 'culture-yellow',
    colorLight: 'culture-yellow-light',
    objectives: ['obj-2', 'obj-3'],
    progress: 72,
    investment: 85000,
  },
  {
    id: 'business',
    name: 'Business',
    nameEs: 'Negocio',
    color: 'business-cyan',
    colorLight: 'business-cyan-light',
    objectives: ['obj-4', 'obj-5', 'obj-6'],
    progress: 68,
    investment: 250000,
  },
  {
    id: 'structure',
    name: 'Structure',
    nameEs: 'Estructura',
    color: 'structure-neutral',
    colorLight: 'structure-neutral-light',
    objectives: ['obj-7'],
    progress: 45,
    investment: 60000,
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    nameEs: 'Emprendimiento',
    color: 'entrepreneurship-green',
    colorLight: 'entrepreneurship-green-light',
    objectives: ['obj-8', 'obj-9'],
    progress: 78,
    investment: 180000,
  },
];

export const objectives: Objective[] = [
  {
    id: 'obj-1',
    title: 'Align 100% of team OKRs with organizational purpose by Q2',
    titleEs: 'Alinear 100% de OKRs de equipos con el propósito organizacional para Q2',
    description: 'Specific: All team objectives reviewed and linked to purpose. Measurable: 100% alignment score. Achievable: Training and workshops planned. Relevant: Core to adaptive culture. Time-bound: By end of Q2.',
    descriptionEs: 'Específico: Todos los objetivos de equipo revisados y vinculados al propósito. Medible: 100% de puntuación de alineación. Alcanzable: Capacitación y talleres planificados. Relevante: Fundamental para la cultura adaptativa. Temporal: Para fin de Q2.',
    dynamicId: 'purpose',
    teamId: 'team-1',
    progress: 85,
    investment: 120000,
    status: 'on-track',
    skills: ['skill-1', 'skill-2'],
  },
  {
    id: 'obj-2',
    title: 'Achieve 90% employee engagement score by Q3',
    titleEs: 'Alcanzar 90% de puntuación de compromiso de empleados para Q3',
    description: 'Specific: Monthly pulse surveys and action plans. Measurable: 90% engagement score target. Achievable: Current score at 75%. Relevant: Drives retention and productivity. Time-bound: By end of Q3.',
    descriptionEs: 'Específico: Encuestas mensuales y planes de acción. Medible: Objetivo de 90% de engagement. Alcanzable: Puntuación actual en 75%. Relevante: Impulsa retención y productividad. Temporal: Para fin de Q3.',
    dynamicId: 'culture',
    teamId: 'team-2',
    progress: 72,
    investment: 45000,
    status: 'on-track',
    skills: ['skill-3', 'skill-4'],
  },
  {
    id: 'obj-3',
    title: 'Implement peer recognition program across all departments',
    titleEs: 'Implementar programa de reconocimiento entre pares en todos los departamentos',
    description: 'Specific: Launch recognition platform with gamification. Measurable: 80% participation rate. Achievable: Budget approved. Relevant: Strengthens culture. Time-bound: Full rollout by Q2.',
    descriptionEs: 'Específico: Lanzar plataforma de reconocimiento con gamificación. Medible: 80% de tasa de participación. Alcanzable: Presupuesto aprobado. Relevante: Fortalece cultura. Temporal: Implementación completa para Q2.',
    dynamicId: 'culture',
    teamId: 'team-2',
    progress: 65,
    investment: 40000,
    status: 'attention',
    skills: ['skill-3'],
  },
  {
    id: 'obj-4',
    title: 'Increase recurring revenue by 25% year-over-year',
    titleEs: 'Aumentar ingresos recurrentes en 25% año a año',
    description: 'Specific: Focus on upselling and retention. Measurable: 25% YoY growth. Achievable: New pricing tiers ready. Relevant: Sustainable business model. Time-bound: By fiscal year end.',
    descriptionEs: 'Específico: Enfoque en upselling y retención. Medible: 25% de crecimiento YoY. Alcanzable: Nuevos niveles de precio listos. Relevante: Modelo de negocio sostenible. Temporal: Para fin de año fiscal.',
    dynamicId: 'business',
    teamId: 'team-3',
    progress: 68,
    investment: 150000,
    status: 'on-track',
    skills: ['skill-5', 'skill-6'],
  },
  {
    id: 'obj-5',
    title: 'Reduce customer churn rate to below 5%',
    titleEs: 'Reducir tasa de abandono de clientes por debajo del 5%',
    description: 'Specific: Proactive customer success program. Measurable: <5% monthly churn. Achievable: CS team expansion planned. Relevant: Revenue retention. Time-bound: Sustained for 3 consecutive months.',
    descriptionEs: 'Específico: Programa proactivo de éxito del cliente. Medible: <5% de abandono mensual. Alcanzable: Expansión del equipo CS planificada. Relevante: Retención de ingresos. Temporal: Sostenido por 3 meses consecutivos.',
    dynamicId: 'business',
    teamId: 'team-3',
    progress: 55,
    investment: 60000,
    status: 'attention',
    skills: ['skill-6', 'skill-7'],
  },
  {
    id: 'obj-6',
    title: 'Launch 2 new product features with positive NPS',
    titleEs: 'Lanzar 2 nuevas funcionalidades de producto con NPS positivo',
    description: 'Specific: AI-powered analytics and mobile app. Measurable: NPS > 40 for each feature. Achievable: Development in progress. Relevant: Competitive advantage. Time-bound: Both launched by Q3.',
    descriptionEs: 'Específico: Analíticas con IA y aplicación móvil. Medible: NPS > 40 para cada funcionalidad. Alcanzable: Desarrollo en progreso. Relevante: Ventaja competitiva. Temporal: Ambos lanzados para Q3.',
    dynamicId: 'business',
    teamId: 'team-4',
    progress: 42,
    investment: 40000,
    status: 'critical',
    skills: ['skill-8'],
  },
  {
    id: 'obj-7',
    title: 'Redesign organizational structure for agility',
    titleEs: 'Rediseñar estructura organizacional para agilidad',
    description: 'Specific: Move to squad-based model. Measurable: 50% faster decision-making. Achievable: Pilot with 2 departments. Relevant: Enables adaptation. Time-bound: Full transition by Q4.',
    descriptionEs: 'Específico: Migrar a modelo basado en squads. Medible: 50% más rápido en toma de decisiones. Alcanzable: Piloto con 2 departamentos. Relevante: Habilita adaptación. Temporal: Transición completa para Q4.',
    dynamicId: 'structure',
    teamId: 'team-1',
    progress: 45,
    investment: 60000,
    status: 'attention',
    skills: ['skill-9', 'skill-10'],
  },
  {
    id: 'obj-8',
    title: 'Validate 3 new business opportunities through MVPs',
    titleEs: 'Validar 3 nuevas oportunidades de negocio mediante MVPs',
    description: 'Specific: Build and test MVPs for identified opportunities. Measurable: 3 MVPs with market validation. Achievable: Innovation budget allocated. Relevant: Future growth. Time-bound: By end of year.',
    descriptionEs: 'Específico: Construir y probar MVPs para oportunidades identificadas. Medible: 3 MVPs con validación de mercado. Alcanzable: Presupuesto de innovación asignado. Relevante: Crecimiento futuro. Temporal: Para fin de año.',
    dynamicId: 'entrepreneurship',
    teamId: 'team-5',
    progress: 78,
    investment: 100000,
    status: 'on-track',
    skills: ['skill-11', 'skill-12'],
  },
  {
    id: 'obj-9',
    title: 'Establish internal innovation lab with dedicated resources',
    titleEs: 'Establecer laboratorio de innovación interno con recursos dedicados',
    description: 'Specific: Dedicated space, team, and processes for innovation. Measurable: 5 experiments per quarter. Achievable: Leadership support secured. Relevant: Innovation culture. Time-bound: Operational by Q2.',
    descriptionEs: 'Específico: Espacio dedicado, equipo y procesos para innovación. Medible: 5 experimentos por trimestre. Alcanzable: Apoyo del liderazgo asegurado. Relevante: Cultura de innovación. Temporal: Operativo para Q2.',
    dynamicId: 'entrepreneurship',
    teamId: 'team-5',
    progress: 82,
    investment: 80000,
    status: 'on-track',
    skills: ['skill-11'],
  },
];

export const skills: Skill[] = [
  { id: 'skill-1', name: 'Strategic Thinking', nameEs: 'Pensamiento Estratégico', initialValue: 3, currentValue: 4, teamId: 'team-1', objectiveIds: ['obj-1'] },
  { id: 'skill-2', name: 'Purpose Communication', nameEs: 'Comunicación del Propósito', initialValue: 2, currentValue: 4, teamId: 'team-1', objectiveIds: ['obj-1'] },
  { id: 'skill-3', name: 'Emotional Intelligence', nameEs: 'Inteligencia Emocional', initialValue: 3, currentValue: 4, teamId: 'team-2', objectiveIds: ['obj-2', 'obj-3'] },
  { id: 'skill-4', name: 'Feedback Culture', nameEs: 'Cultura de Feedback', initialValue: 2, currentValue: 3, teamId: 'team-2', objectiveIds: ['obj-2'] },
  { id: 'skill-5', name: 'Sales Excellence', nameEs: 'Excelencia en Ventas', initialValue: 3, currentValue: 4, teamId: 'team-3', objectiveIds: ['obj-4'] },
  { id: 'skill-6', name: 'Customer Relationship', nameEs: 'Relación con el Cliente', initialValue: 4, currentValue: 5, teamId: 'team-3', objectiveIds: ['obj-4', 'obj-5'] },
  { id: 'skill-7', name: 'Data Analysis', nameEs: 'Análisis de Datos', initialValue: 2, currentValue: 3, teamId: 'team-3', objectiveIds: ['obj-5'] },
  { id: 'skill-8', name: 'Product Development', nameEs: 'Desarrollo de Producto', initialValue: 4, currentValue: 3, teamId: 'team-4', objectiveIds: ['obj-6'] },
  { id: 'skill-9', name: 'Change Management', nameEs: 'Gestión del Cambio', initialValue: 2, currentValue: 3, teamId: 'team-1', objectiveIds: ['obj-7'] },
  { id: 'skill-10', name: 'Agile Methodologies', nameEs: 'Metodologías Ágiles', initialValue: 3, currentValue: 4, teamId: 'team-1', objectiveIds: ['obj-7'] },
  { id: 'skill-11', name: 'Innovation Mindset', nameEs: 'Mentalidad Innovadora', initialValue: 3, currentValue: 5, teamId: 'team-5', objectiveIds: ['obj-8', 'obj-9'] },
  { id: 'skill-12', name: 'Rapid Prototyping', nameEs: 'Prototipado Rápido', initialValue: 2, currentValue: 4, teamId: 'team-5', objectiveIds: ['obj-8'] },
];

export const teams: Team[] = [
  { id: 'team-1', name: 'Executive Leadership', nameEs: 'Liderazgo Ejecutivo', members: 8, alignment: 92, objectiveIds: ['obj-1', 'obj-7'], skillIds: ['skill-1', 'skill-2', 'skill-9', 'skill-10'] },
  { id: 'team-2', name: 'People & Culture', nameEs: 'Personas y Cultura', members: 12, alignment: 88, objectiveIds: ['obj-2', 'obj-3'], skillIds: ['skill-3', 'skill-4'] },
  { id: 'team-3', name: 'Revenue Operations', nameEs: 'Operaciones de Ingresos', members: 25, alignment: 75, objectiveIds: ['obj-4', 'obj-5'], skillIds: ['skill-5', 'skill-6', 'skill-7'] },
  { id: 'team-4', name: 'Product & Engineering', nameEs: 'Producto e Ingeniería', members: 35, alignment: 60, objectiveIds: ['obj-6'], skillIds: ['skill-8'] },
  { id: 'team-5', name: 'Innovation Lab', nameEs: 'Laboratorio de Innovación', members: 6, alignment: 95, objectiveIds: ['obj-8', 'obj-9'], skillIds: ['skill-11', 'skill-12'] },
];

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    message: 'Product Development skill decreased while objective deadline approaches. Immediate action required.',
    messageEs: 'La habilidad de Desarrollo de Producto disminuyó mientras se acerca la fecha límite del objetivo. Se requiere acción inmediata.',
    objectiveId: 'obj-6',
    timestamp: new Date('2024-01-15'),
  },
  {
    id: 'alert-2',
    type: 'warning',
    message: 'Customer churn reduction objective is below target. Skills are improving but results are not following.',
    messageEs: 'El objetivo de reducción de abandono de clientes está por debajo del objetivo. Las habilidades mejoran pero los resultados no siguen.',
    objectiveId: 'obj-5',
    timestamp: new Date('2024-01-14'),
  },
  {
    id: 'alert-3',
    type: 'warning',
    message: 'Recognition program implementation is delayed. Review timeline and resource allocation.',
    messageEs: 'La implementación del programa de reconocimiento está retrasada. Revisar cronograma y asignación de recursos.',
    objectiveId: 'obj-3',
    timestamp: new Date('2024-01-12'),
  },
];

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