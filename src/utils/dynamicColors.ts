// Centralized color utilities for consistent dynamic color inheritance
// All objectives and KRs inherit colors from their parent dynamics

export const dynamicColorClasses: Record<string, {
  bg: string;
  bgLight: string;
  text: string;
  border: string;
  progressBar: string;
}> = {
  'adaptativa-blue': {
    bg: 'bg-adaptativa-blue',
    bgLight: 'bg-adaptativa-blue/10',
    text: 'text-adaptativa-blue',
    border: 'border-adaptativa-blue',
    progressBar: 'adaptativa-blue',
  },
  'culture-yellow': {
    bg: 'bg-culture-yellow',
    bgLight: 'bg-culture-yellow/10',
    text: 'text-culture-yellow',
    border: 'border-culture-yellow',
    progressBar: 'culture-yellow',
  },
  'business-blue': {
    bg: 'bg-business-blue',
    bgLight: 'bg-business-blue/10',
    text: 'text-business-blue',
    border: 'border-business-blue',
    progressBar: 'business-blue',
  },
  'structure-magenta': {
    bg: 'bg-structure-magenta',
    bgLight: 'bg-structure-magenta/10',
    text: 'text-structure-magenta',
    border: 'border-structure-magenta',
    progressBar: 'structure-magenta',
  },
  'entrepreneurship-green': {
    bg: 'bg-entrepreneurship-green',
    bgLight: 'bg-entrepreneurship-green/10',
    text: 'text-entrepreneurship-green',
    border: 'border-entrepreneurship-green',
    progressBar: 'entrepreneurship-green',
  },
};

// Get color classes for a dynamic color
export function getDynamicColorClasses(color: string) {
  return dynamicColorClasses[color] || dynamicColorClasses['adaptativa-blue'];
}

// Dynamic icons mapping
export const dynamicIcons: Record<string, string> = {
  'purpose': '🎯',
  'culture': '💛',
  'business': '💼',
  'structure': '🏗️',
  'entrepreneurship': '🚀',
};

// Get icon for a dynamic
export function getDynamicIcon(dynamicId: string): string {
  return dynamicIcons[dynamicId] || '📊';
}

// Team color mapping for consistent visualization based on their primary dynamic
export const teamColorsByDynamic: Record<string, string> = {
  'team-1': 'adaptativa-blue',     // Executive Leadership - Purpose
  'team-2': 'culture-yellow',       // People & Culture - Culture
  'team-3': 'business-blue',        // Revenue Operations - Business
  'team-4': 'structure-magenta',    // Product & Engineering - Structure
  'team-5': 'entrepreneurship-green', // Innovation Lab - Entrepreneurship
  'team-6': 'business-blue',        // Marketing & Communications - Business
  'team-7': 'business-blue',        // Finance & Strategy - Business
  'team-8': 'structure-magenta',    // IT & Infrastructure - Structure
  'team-9': 'adaptativa-blue',      // Legal & Compliance - Purpose
  'team-10': 'entrepreneurship-green', // Operations Excellence - Entrepreneurship
};

export function getTeamColor(teamId: string): string {
  return teamColorsByDynamic[teamId] || 'adaptativa-blue';
}
