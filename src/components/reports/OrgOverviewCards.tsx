import { useLanguage } from '@/contexts/LanguageContext';
import { teams, skills, objectives, dynamics, keyResults } from '@/data/demoData';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, TrendingUp, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrgOverviewCards() {
  const { language } = useLanguage();

  const totalMembers = teams.reduce((s, t) => s + t.members.length, 0);
  const coreMembers = teams.reduce((s, t) => s + t.members.filter(m => m.unitType === 'core').length, 0);
  const extMembers = totalMembers - coreMembers;
  const totalHours = teams.reduce((s, t) => s + t.members.reduce((h, m) => h + m.hoursPerWeek, 0), 0);
  const avgAlignment = Math.round(teams.reduce((s, t) => s + t.alignment, 0) / teams.length);
  const onTrackObj = objectives.filter(o => o.status === 'on-track').length;
  const criticalObj = objectives.filter(o => o.status === 'critical').length;
  const avgSkill = skills.length > 0
    ? (skills.reduce((s, sk) => s + sk.currentValue, 0) / skills.length).toFixed(1)
    : '0';
  const growingSkills = skills.filter(s => s.currentValue > s.initialValue).length;
  const decliningSkills = skills.filter(s => s.currentValue < s.initialValue).length;
  const digitalTeams = teams.filter(t => t.teamCategory === 'digital-build' || t.teamCategory === 'digital-maintain');
  const avgHappiness = (teams.reduce((s, t) => s + t.metrics.happinessIndex, 0) / teams.length).toFixed(1);

  const cards = [
    {
      icon: Users,
      label: language === 'es' ? 'Personas' : 'People',
      value: totalMembers,
      detail: `${coreMembers} Core · ${extMembers} Extended`,
      accent: 'text-adaptativa-blue',
    },
    {
      icon: Clock,
      label: language === 'es' ? 'Capacidad Total' : 'Total Capacity',
      value: `${totalHours}h`,
      detail: language === 'es' ? `${teams.length} equipos · ${Math.round(totalHours / teams.length)}h prom/equipo` : `${teams.length} teams · ${Math.round(totalHours / teams.length)}h avg/team`,
      accent: 'text-business-blue',
    },
    {
      icon: Target,
      label: language === 'es' ? 'Objetivos' : 'Objectives',
      value: `${onTrackObj}/${objectives.length}`,
      detail: language === 'es' ? `En camino · ${criticalObj} críticos` : `On track · ${criticalObj} critical`,
      accent: criticalObj > 0 ? 'text-status-critical' : 'text-status-success',
    },
    {
      icon: TrendingUp,
      label: language === 'es' ? 'Habilidades' : 'Skills',
      value: `${avgSkill}/5`,
      detail: `↑${growingSkills} ${language === 'es' ? 'mejorando' : 'improving'} · ↓${decliningSkills} ${language === 'es' ? 'declinando' : 'declining'}`,
      accent: 'text-entrepreneurship-green',
    },
    {
      icon: Zap,
      label: 'Happinex',
      value: `${avgHappiness}/10`,
      detail: `${digitalTeams.length} ${language === 'es' ? 'equipos digitales' : 'digital teams'} · ${avgAlignment}% ${language === 'es' ? 'alineación' : 'alignment'}`,
      accent: 'text-culture-yellow',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <Card key={i} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <card.icon className={cn("h-4 w-4 mt-0.5", card.accent)} />
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{card.detail}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
