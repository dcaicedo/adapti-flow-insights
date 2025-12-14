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
  investment: number;
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
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  nameEs: string;
  members: TeamMember[];
  alignment: number;
  keyResultIds: string[];
  skillIds: string[];
  unitType: 'core' | 'extended';
  parentUnitIds: string[]; // Strategic units this team belongs to
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
    objectiveIds: ['obj-1'],
    progress: 85,
    investment: 120000,
  },
  {
    id: 'culture',
    name: 'Culture',
    nameEs: 'Cultura',
    color: 'culture-yellow',
    colorLight: 'culture-yellow-light',
    objectiveIds: ['obj-2', 'obj-3'],
    progress: 72,
    investment: 85000,
  },
  {
    id: 'business',
    name: 'Business',
    nameEs: 'Negocio',
    color: 'business-cyan',
    colorLight: 'business-cyan-light',
    objectiveIds: ['obj-4', 'obj-5', 'obj-6'],
    progress: 68,
    investment: 250000,
  },
  {
    id: 'structure',
    name: 'Structure',
    nameEs: 'Estructura',
    color: 'structure-neutral',
    colorLight: 'structure-neutral-light',
    objectiveIds: ['obj-7'],
    progress: 45,
    investment: 60000,
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    nameEs: 'Emprendimiento',
    color: 'entrepreneurship-green',
    colorLight: 'entrepreneurship-green-light',
    objectiveIds: ['obj-8', 'obj-9'],
    progress: 78,
    investment: 180000,
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
    investment: 120000,
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
    investment: 45000,
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
    investment: 40000,
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
    investment: 150000,
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
    investment: 60000,
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
    investment: 40000,
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
    investment: 60000,
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
    investment: 100000,
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
    investment: 80000,
    status: 'on-track',
  },
];

export const keyResults: KeyResult[] = [
  // Purpose Objective Key Results
  {
    id: 'kr-1',
    title: 'Align 100% of team OKRs with organizational purpose by Q2',
    titleEs: 'Alinear 100% de OKRs de equipos con el propósito organizacional para Q2',
    description: 'Specific: All team objectives reviewed and linked to purpose. Measurable: 100% alignment score. Achievable: Training and workshops planned. Relevant: Core to adaptive culture. Time-bound: By end of Q2.',
    descriptionEs: 'Específico: Todos los objetivos de equipo revisados y vinculados al propósito. Medible: 100% de puntuación de alineación. Alcanzable: Capacitación y talleres planificados. Relevante: Fundamental para la cultura adaptativa. Temporal: Para fin de Q2.',
    objectiveId: 'obj-1',
    teamIds: ['team-1'],
    progress: 85,
    investment: 80000,
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
    investment: 40000,
    status: 'on-track',
    skills: ['skill-2'],
  },
  // Culture Objective Key Results
  {
    id: 'kr-3',
    title: 'Achieve 90% employee engagement score by Q3',
    titleEs: 'Alcanzar 90% de puntuación de compromiso de empleados para Q3',
    description: 'Specific: Monthly pulse surveys and action plans. Measurable: 90% engagement score target. Achievable: Current score at 75%. Relevant: Drives retention and productivity. Time-bound: By end of Q3.',
    descriptionEs: 'Específico: Encuestas mensuales y planes de acción. Medible: Objetivo de 90% de engagement. Alcanzable: Puntuación actual en 75%. Relevante: Impulsa retención y productividad. Temporal: Para fin de Q3.',
    objectiveId: 'obj-2',
    teamIds: ['team-2'],
    progress: 72,
    investment: 25000,
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
    investment: 20000,
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
    investment: 40000,
    status: 'attention',
    skills: ['skill-3'],
  },
  // Business Objective Key Results
  {
    id: 'kr-6',
    title: 'Increase recurring revenue by 25% year-over-year',
    titleEs: 'Aumentar ingresos recurrentes en 25% año a año',
    description: 'Specific: Focus on upselling and retention. Measurable: 25% YoY growth. Achievable: New pricing tiers ready. Relevant: Sustainable business model. Time-bound: By fiscal year end.',
    descriptionEs: 'Específico: Enfoque en upselling y retención. Medible: 25% de crecimiento YoY. Alcanzable: Nuevos niveles de precio listos. Relevante: Modelo de negocio sostenible. Temporal: Para fin de año fiscal.',
    objectiveId: 'obj-4',
    teamIds: ['team-3'],
    progress: 68,
    investment: 100000,
    status: 'on-track',
    skills: ['skill-5', 'skill-6'],
  },
  {
    id: 'kr-7',
    title: 'Expand to 3 new market segments with positive unit economics',
    titleEs: 'Expandirse a 3 nuevos segmentos de mercado con unit economics positivos',
    description: 'Specific: Identify and enter new verticals. Measurable: 3 segments with positive CAC/LTV. Achievable: Market research complete. Relevant: Diversifies revenue. Time-bound: By Q4.',
    descriptionEs: 'Específico: Identificar y entrar a nuevas verticales. Medible: 3 segmentos con CAC/LTV positivo. Alcanzable: Investigación de mercado completa. Relevante: Diversifica ingresos. Temporal: Para Q4.',
    objectiveId: 'obj-4',
    teamIds: ['team-3', 'team-5'],
    progress: 55,
    investment: 50000,
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
    investment: 60000,
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
    investment: 40000,
    status: 'critical',
    skills: ['skill-8'],
  },
  // Structure Objective Key Results
  {
    id: 'kr-10',
    title: 'Redesign organizational structure to squad-based model',
    titleEs: 'Rediseñar estructura organizacional a modelo basado en squads',
    description: 'Specific: Move to squad-based model. Measurable: 50% faster decision-making. Achievable: Pilot with 2 departments. Relevant: Enables adaptation. Time-bound: Full transition by Q4.',
    descriptionEs: 'Específico: Migrar a modelo basado en squads. Medible: 50% más rápido en toma de decisiones. Alcanzable: Piloto con 2 departamentos. Relevante: Habilita adaptación. Temporal: Transición completa para Q4.',
    objectiveId: 'obj-7',
    teamIds: ['team-1'],
    progress: 45,
    investment: 40000,
    status: 'attention',
    skills: ['skill-9', 'skill-10'],
  },
  {
    id: 'kr-11',
    title: 'Establish cross-functional collaboration protocols',
    titleEs: 'Establecer protocolos de colaboración interfuncional',
    description: 'Specific: Define and implement collaboration frameworks. Measurable: 80% adoption rate. Achievable: Frameworks designed. Relevant: Breaks silos. Time-bound: By Q2.',
    descriptionEs: 'Específico: Definir e implementar marcos de colaboración. Medible: 80% de tasa de adopción. Alcanzable: Marcos diseñados. Relevante: Rompe silos. Temporal: Para Q2.',
    objectiveId: 'obj-7',
    teamIds: ['team-1', 'team-2'],
    progress: 50,
    investment: 20000,
    status: 'attention',
    skills: ['skill-9'],
  },
  // Entrepreneurship Objective Key Results
  {
    id: 'kr-12',
    title: 'Validate 3 new business opportunities through MVPs',
    titleEs: 'Validar 3 nuevas oportunidades de negocio mediante MVPs',
    description: 'Specific: Build and test MVPs for identified opportunities. Measurable: 3 MVPs with market validation. Achievable: Innovation budget allocated. Relevant: Future growth. Time-bound: By end of year.',
    descriptionEs: 'Específico: Construir y probar MVPs para oportunidades identificadas. Medible: 3 MVPs con validación de mercado. Alcanzable: Presupuesto de innovación asignado. Relevante: Crecimiento futuro. Temporal: Para fin de año.',
    objectiveId: 'obj-8',
    teamIds: ['team-5'],
    progress: 78,
    investment: 60000,
    status: 'on-track',
    skills: ['skill-11', 'skill-12'],
  },
  {
    id: 'kr-13',
    title: 'Conduct 20 customer discovery interviews per opportunity',
    titleEs: 'Realizar 20 entrevistas de descubrimiento de clientes por oportunidad',
    description: 'Specific: Deep customer interviews for each MVP. Measurable: 60 total interviews. Achievable: Interview guide ready. Relevant: Validates assumptions. Time-bound: Before MVP launch.',
    descriptionEs: 'Específico: Entrevistas profundas para cada MVP. Medible: 60 entrevistas en total. Alcanzable: Guía de entrevistas lista. Relevante: Valida supuestos. Temporal: Antes del lanzamiento de MVP.',
    objectiveId: 'obj-8',
    teamIds: ['team-5', 'team-3'],
    progress: 85,
    investment: 40000,
    status: 'on-track',
    skills: ['skill-11'],
  },
  {
    id: 'kr-14',
    title: 'Establish internal innovation lab with dedicated resources',
    titleEs: 'Establecer laboratorio de innovación interno con recursos dedicados',
    description: 'Specific: Dedicated space, team, and processes for innovation. Measurable: 5 experiments per quarter. Achievable: Leadership support secured. Relevant: Innovation culture. Time-bound: Operational by Q2.',
    descriptionEs: 'Específico: Espacio dedicado, equipo y procesos para innovación. Medible: 5 experimentos por trimestre. Alcanzable: Apoyo del liderazgo asegurado. Relevante: Cultura de innovación. Temporal: Operativo para Q2.',
    objectiveId: 'obj-9',
    teamIds: ['team-5'],
    progress: 82,
    investment: 80000,
    status: 'on-track',
    skills: ['skill-11'],
  },
];

export const skills: Skill[] = [
  { id: 'skill-1', name: 'Strategic Thinking', nameEs: 'Pensamiento Estratégico', initialValue: 3, currentValue: 4, teamId: 'team-1', keyResultIds: ['kr-1'] },
  { id: 'skill-2', name: 'Purpose Communication', nameEs: 'Comunicación del Propósito', initialValue: 2, currentValue: 4, teamId: 'team-1', keyResultIds: ['kr-1', 'kr-2'] },
  { id: 'skill-3', name: 'Emotional Intelligence', nameEs: 'Inteligencia Emocional', initialValue: 3, currentValue: 4, teamId: 'team-2', keyResultIds: ['kr-3', 'kr-4', 'kr-5'] },
  { id: 'skill-4', name: 'Feedback Culture', nameEs: 'Cultura de Feedback', initialValue: 2, currentValue: 3, teamId: 'team-2', keyResultIds: ['kr-3'] },
  { id: 'skill-5', name: 'Sales Excellence', nameEs: 'Excelencia en Ventas', initialValue: 3, currentValue: 4, teamId: 'team-3', keyResultIds: ['kr-6', 'kr-7'] },
  { id: 'skill-6', name: 'Customer Relationship', nameEs: 'Relación con el Cliente', initialValue: 4, currentValue: 5, teamId: 'team-3', keyResultIds: ['kr-6', 'kr-8'] },
  { id: 'skill-7', name: 'Data Analysis', nameEs: 'Análisis de Datos', initialValue: 2, currentValue: 3, teamId: 'team-3', keyResultIds: ['kr-8'] },
  { id: 'skill-8', name: 'Product Development', nameEs: 'Desarrollo de Producto', initialValue: 4, currentValue: 3, teamId: 'team-4', keyResultIds: ['kr-9'] },
  { id: 'skill-9', name: 'Change Management', nameEs: 'Gestión del Cambio', initialValue: 2, currentValue: 3, teamId: 'team-1', keyResultIds: ['kr-10', 'kr-11'] },
  { id: 'skill-10', name: 'Agile Methodologies', nameEs: 'Metodologías Ágiles', initialValue: 3, currentValue: 4, teamId: 'team-1', keyResultIds: ['kr-10'] },
  { id: 'skill-11', name: 'Innovation Mindset', nameEs: 'Mentalidad Innovadora', initialValue: 3, currentValue: 5, teamId: 'team-5', keyResultIds: ['kr-12', 'kr-13', 'kr-14'] },
  { id: 'skill-12', name: 'Rapid Prototyping', nameEs: 'Prototipado Rápido', initialValue: 2, currentValue: 4, teamId: 'team-5', keyResultIds: ['kr-12'] },
];

export const teams: Team[] = [
  { 
    id: 'team-1', 
    name: 'Executive Leadership', 
    nameEs: 'Liderazgo Ejecutivo', 
    members: [
      { id: 'member-1', name: 'María García', role: 'CEO', roleEs: 'CEO', unitType: 'core' },
      { id: 'member-2', name: 'Carlos Rodríguez', role: 'COO', roleEs: 'COO', unitType: 'core' },
      { id: 'member-3', name: 'Ana Martínez', role: 'CHRO', roleEs: 'CHRO', unitType: 'core' },
      { id: 'member-4', name: 'Luis Fernández', role: 'CFO', roleEs: 'CFO', unitType: 'core' },
      { id: 'member-5', name: 'Elena Torres', role: 'CTO', roleEs: 'CTO', unitType: 'core' },
      { id: 'member-6', name: 'Pablo Sánchez', role: 'Strategy Director', roleEs: 'Director de Estrategia', unitType: 'extended' },
      { id: 'member-7', name: 'Laura Díaz', role: 'Transformation Lead', roleEs: 'Líder de Transformación', unitType: 'extended' },
      { id: 'member-8', name: 'Roberto Moreno', role: 'Executive Assistant', roleEs: 'Asistente Ejecutivo', unitType: 'extended' },
    ],
    alignment: 92, 
    keyResultIds: ['kr-1', 'kr-2', 'kr-10', 'kr-11'], 
    skillIds: ['skill-1', 'skill-2', 'skill-9', 'skill-10'],
    unitType: 'core',
    parentUnitIds: ['unit-1'],
  },
  { 
    id: 'team-2', 
    name: 'People & Culture', 
    nameEs: 'Personas y Cultura', 
    members: [
      { id: 'member-9', name: 'Carmen López', role: 'People Director', roleEs: 'Directora de Personas', unitType: 'core' },
      { id: 'member-10', name: 'Diego Ramírez', role: 'Culture Lead', roleEs: 'Líder de Cultura', unitType: 'core' },
      { id: 'member-11', name: 'Isabel Navarro', role: 'Talent Acquisition', roleEs: 'Adquisición de Talento', unitType: 'core' },
      { id: 'member-12', name: 'Fernando Castro', role: 'Learning & Development', roleEs: 'Aprendizaje y Desarrollo', unitType: 'core' },
      { id: 'member-13', name: 'Lucía Vega', role: 'Employee Experience', roleEs: 'Experiencia del Empleado', unitType: 'extended' },
      { id: 'member-14', name: 'Miguel Ruiz', role: 'HR Business Partner', roleEs: 'HR Business Partner', unitType: 'extended' },
      { id: 'member-15', name: 'Andrea Molina', role: 'Compensation & Benefits', roleEs: 'Compensación y Beneficios', unitType: 'extended' },
      { id: 'member-16', name: 'Javier Ortiz', role: 'HR Coordinator', roleEs: 'Coordinador de RH', unitType: 'extended' },
      { id: 'member-17', name: 'Patricia Herrera', role: 'Wellbeing Specialist', roleEs: 'Especialista en Bienestar', unitType: 'extended' },
      { id: 'member-18', name: 'Antonio Vargas', role: 'HR Analyst', roleEs: 'Analista de RH', unitType: 'extended' },
      { id: 'member-19', name: 'Sara Mendoza', role: 'Onboarding Specialist', roleEs: 'Especialista en Onboarding', unitType: 'extended' },
      { id: 'member-20', name: 'Ricardo Flores', role: 'HR Operations', roleEs: 'Operaciones de RH', unitType: 'extended' },
    ],
    alignment: 88, 
    keyResultIds: ['kr-2', 'kr-3', 'kr-4', 'kr-5', 'kr-11'], 
    skillIds: ['skill-3', 'skill-4'],
    unitType: 'core',
    parentUnitIds: ['unit-1'],
  },
  { 
    id: 'team-3', 
    name: 'Revenue Operations', 
    nameEs: 'Operaciones de Ingresos', 
    members: [
      { id: 'member-21', name: 'Alejandro Jiménez', role: 'Revenue Director', roleEs: 'Director de Ingresos', unitType: 'core' },
      { id: 'member-22', name: 'Beatriz Romero', role: 'Sales Manager', roleEs: 'Gerente de Ventas', unitType: 'core' },
      { id: 'member-23', name: 'Cristian Delgado', role: 'Account Executive', roleEs: 'Ejecutivo de Cuenta', unitType: 'core' },
      { id: 'member-24', name: 'Diana Peña', role: 'Account Executive', roleEs: 'Ejecutivo de Cuenta', unitType: 'core' },
      { id: 'member-25', name: 'Eduardo Silva', role: 'Sales Development Rep', roleEs: 'Rep. Desarrollo de Ventas', unitType: 'core' },
      { id: 'member-26', name: 'Francisca Muñoz', role: 'Customer Success Manager', roleEs: 'Gerente de Éxito del Cliente', unitType: 'core' },
      { id: 'member-27', name: 'Gabriel Reyes', role: 'Customer Success Manager', roleEs: 'Gerente de Éxito del Cliente', unitType: 'core' },
      { id: 'member-28', name: 'Helena Castro', role: 'Revenue Analyst', roleEs: 'Analista de Ingresos', unitType: 'extended' },
      { id: 'member-29', name: 'Iván Morales', role: 'Sales Operations', roleEs: 'Operaciones de Ventas', unitType: 'extended' },
      { id: 'member-30', name: 'Julia Paredes', role: 'Renewals Specialist', roleEs: 'Especialista en Renovaciones', unitType: 'extended' },
      { id: 'member-31', name: 'Kevin Rojas', role: 'Sales Engineer', roleEs: 'Ingeniero de Ventas', unitType: 'extended' },
      { id: 'member-32', name: 'Lorena Guzmán', role: 'Solutions Consultant', roleEs: 'Consultor de Soluciones', unitType: 'extended' },
      { id: 'member-33', name: 'Marcos Pinto', role: 'Account Executive', roleEs: 'Ejecutivo de Cuenta', unitType: 'extended' },
      { id: 'member-34', name: 'Natalia Cruz', role: 'Sales Coordinator', roleEs: 'Coordinadora de Ventas', unitType: 'extended' },
      { id: 'member-35', name: 'Oscar León', role: 'Business Development', roleEs: 'Desarrollo de Negocios', unitType: 'extended' },
      { id: 'member-36', name: 'Paola Núñez', role: 'Partner Manager', roleEs: 'Gerente de Socios', unitType: 'extended' },
      { id: 'member-37', name: 'Rodrigo Espinoza', role: 'Sales Trainer', roleEs: 'Capacitador de Ventas', unitType: 'extended' },
      { id: 'member-38', name: 'Sofía Aguirre', role: 'CRM Administrator', roleEs: 'Administrador CRM', unitType: 'extended' },
      { id: 'member-39', name: 'Tomás Valdés', role: 'Pricing Analyst', roleEs: 'Analista de Precios', unitType: 'extended' },
      { id: 'member-40', name: 'Valentina Cortés', role: 'Revenue Operations Lead', roleEs: 'Líder de Revenue Ops', unitType: 'extended' },
      { id: 'member-41', name: 'William Acosta', role: 'Enterprise Account Exec', roleEs: 'Ejecutivo de Cuenta Enterprise', unitType: 'extended' },
      { id: 'member-42', name: 'Ximena Bravo', role: 'SMB Account Manager', roleEs: 'Gerente de Cuenta SMB', unitType: 'extended' },
      { id: 'member-43', name: 'Yolanda Campos', role: 'Contract Specialist', roleEs: 'Especialista en Contratos', unitType: 'extended' },
      { id: 'member-44', name: 'Zacarías Duarte', role: 'Sales Intern', roleEs: 'Practicante de Ventas', unitType: 'extended' },
      { id: 'member-45', name: 'Amanda Fuentes', role: 'Market Research', roleEs: 'Investigación de Mercado', unitType: 'extended' },
    ],
    alignment: 75, 
    keyResultIds: ['kr-6', 'kr-7', 'kr-8', 'kr-13'], 
    skillIds: ['skill-5', 'skill-6', 'skill-7'],
    unitType: 'core',
    parentUnitIds: ['unit-2'],
  },
  { 
    id: 'team-4', 
    name: 'Product & Engineering', 
    nameEs: 'Producto e Ingeniería', 
    members: [
      { id: 'member-46', name: 'Adrián Méndez', role: 'VP of Engineering', roleEs: 'VP de Ingeniería', unitType: 'core' },
      { id: 'member-47', name: 'Bianca Salazar', role: 'Product Director', roleEs: 'Directora de Producto', unitType: 'core' },
      { id: 'member-48', name: 'César Guerrero', role: 'Tech Lead', roleEs: 'Líder Técnico', unitType: 'core' },
      { id: 'member-49', name: 'Daniela Rivas', role: 'Product Manager', roleEs: 'Gerente de Producto', unitType: 'core' },
      { id: 'member-50', name: 'Ernesto Medina', role: 'Senior Engineer', roleEs: 'Ingeniero Senior', unitType: 'core' },
      { id: 'member-51', name: 'Fabiola Luna', role: 'Senior Engineer', roleEs: 'Ingeniero Senior', unitType: 'core' },
      { id: 'member-52', name: 'Gonzalo Vásquez', role: 'Full Stack Developer', roleEs: 'Desarrollador Full Stack', unitType: 'core' },
      { id: 'member-53', name: 'Hilda Peralta', role: 'Full Stack Developer', roleEs: 'Desarrollador Full Stack', unitType: 'extended' },
      { id: 'member-54', name: 'Ignacio Córdova', role: 'Backend Developer', roleEs: 'Desarrollador Backend', unitType: 'extended' },
      { id: 'member-55', name: 'Jimena Orozco', role: 'Frontend Developer', roleEs: 'Desarrollador Frontend', unitType: 'extended' },
      { id: 'member-56', name: 'Leonardo Ibarra', role: 'Frontend Developer', roleEs: 'Desarrollador Frontend', unitType: 'extended' },
      { id: 'member-57', name: 'Marina Quintero', role: 'UX Designer', roleEs: 'Diseñador UX', unitType: 'extended' },
      { id: 'member-58', name: 'Nicolás Sandoval', role: 'UI Designer', roleEs: 'Diseñador UI', unitType: 'extended' },
      { id: 'member-59', name: 'Olivia Carrasco', role: 'QA Engineer', roleEs: 'Ingeniero QA', unitType: 'extended' },
      { id: 'member-60', name: 'Patricio Lagos', role: 'QA Engineer', roleEs: 'Ingeniero QA', unitType: 'extended' },
      { id: 'member-61', name: 'Raquel Estrada', role: 'DevOps Engineer', roleEs: 'Ingeniero DevOps', unitType: 'extended' },
      { id: 'member-62', name: 'Sebastián Alvarado', role: 'DevOps Engineer', roleEs: 'Ingeniero DevOps', unitType: 'extended' },
      { id: 'member-63', name: 'Tamara Bernal', role: 'Data Engineer', roleEs: 'Ingeniero de Datos', unitType: 'extended' },
      { id: 'member-64', name: 'Ulises Franco', role: 'Mobile Developer', roleEs: 'Desarrollador Mobile', unitType: 'extended' },
      { id: 'member-65', name: 'Verónica Gálvez', role: 'Product Designer', roleEs: 'Diseñador de Producto', unitType: 'extended' },
      { id: 'member-66', name: 'Walter Hidalgo', role: 'Security Engineer', roleEs: 'Ingeniero de Seguridad', unitType: 'extended' },
      { id: 'member-67', name: 'Alejandra Iglesias', role: 'Technical Writer', roleEs: 'Escritor Técnico', unitType: 'extended' },
      { id: 'member-68', name: 'Bruno Jaramillo', role: 'Junior Developer', roleEs: 'Desarrollador Junior', unitType: 'extended' },
      { id: 'member-69', name: 'Camila Lara', role: 'Junior Developer', roleEs: 'Desarrollador Junior', unitType: 'extended' },
      { id: 'member-70', name: 'David Mancilla', role: 'Engineering Manager', roleEs: 'Gerente de Ingeniería', unitType: 'extended' },
      { id: 'member-71', name: 'Emilia Navarrete', role: 'Scrum Master', roleEs: 'Scrum Master', unitType: 'extended' },
      { id: 'member-72', name: 'Felipe Oporto', role: 'Platform Engineer', roleEs: 'Ingeniero de Plataforma', unitType: 'extended' },
      { id: 'member-73', name: 'Gabriela Palma', role: 'UX Researcher', roleEs: 'Investigador UX', unitType: 'extended' },
      { id: 'member-74', name: 'Héctor Quiroga', role: 'ML Engineer', roleEs: 'Ingeniero ML', unitType: 'extended' },
      { id: 'member-75', name: 'Inés Ríos', role: 'Data Scientist', roleEs: 'Científico de Datos', unitType: 'extended' },
      { id: 'member-76', name: 'Jorge Salas', role: 'Backend Developer', roleEs: 'Desarrollador Backend', unitType: 'extended' },
      { id: 'member-77', name: 'Karen Tapia', role: 'Product Analyst', roleEs: 'Analista de Producto', unitType: 'extended' },
      { id: 'member-78', name: 'Luis Uribe', role: 'Infrastructure Lead', roleEs: 'Líder de Infraestructura', unitType: 'extended' },
      { id: 'member-79', name: 'Mónica Vera', role: 'Release Manager', roleEs: 'Gerente de Releases', unitType: 'extended' },
      { id: 'member-80', name: 'Nelson Zapata', role: 'Intern Developer', roleEs: 'Desarrollador Practicante', unitType: 'extended' },
    ],
    alignment: 60, 
    keyResultIds: ['kr-4', 'kr-9'], 
    skillIds: ['skill-8'],
    unitType: 'extended',
    parentUnitIds: ['unit-2'],
  },
  { 
    id: 'team-5', 
    name: 'Innovation Lab', 
    nameEs: 'Laboratorio de Innovación', 
    members: [
      { id: 'member-81', name: 'Alberto Cifuentes', role: 'Innovation Director', roleEs: 'Director de Innovación', unitType: 'core' },
      { id: 'member-82', name: 'Bárbara Espinosa', role: 'Innovation Lead', roleEs: 'Líder de Innovación', unitType: 'core' },
      { id: 'member-83', name: 'Claudio Figueroa', role: 'Venture Designer', roleEs: 'Diseñador de Ventures', unitType: 'core' },
      { id: 'member-84', name: 'Delia Godoy', role: 'Business Analyst', roleEs: 'Analista de Negocios', unitType: 'extended' },
      { id: 'member-85', name: 'Esteban Henríquez', role: 'Prototype Developer', roleEs: 'Desarrollador de Prototipos', unitType: 'extended' },
      { id: 'member-86', name: 'Florencia Jara', role: 'Research Analyst', roleEs: 'Analista de Investigación', unitType: 'extended' },
    ],
    alignment: 95, 
    keyResultIds: ['kr-7', 'kr-12', 'kr-13', 'kr-14'], 
    skillIds: ['skill-11', 'skill-12'],
    unitType: 'core',
    parentUnitIds: ['unit-3'],
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
