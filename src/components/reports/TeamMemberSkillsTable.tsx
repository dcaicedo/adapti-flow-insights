import { useLanguage } from '@/contexts/LanguageContext';
import { teams, skills, keyResults, objectives, getSkillColor, type Team, type TeamMember } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, Clock, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MemberSkillGap {
  member: TeamMember;
  teamName: string;
  teamIcon: string;
  relevantSkills: {
    name: string;
    current: number;
    target: number;
    gap: number;
  }[];
}

function getSkillsForMember(member: TeamMember, team: Team): MemberSkillGap['relevantSkills'] {
  const teamSkillIds = team.skillIds;
  const teamSkills = skills.filter(s => teamSkillIds.includes(s.id));

  return teamSkills.map(s => ({
    name: s.name,
    current: s.currentValue,
    target: 5,
    gap: 5 - s.currentValue,
  }));
}

export function TeamMemberSkillsTable() {
  const { language } = useLanguage();
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {language === 'es' ? 'Equipos, Miembros y Crecimiento de Habilidades' : 'Teams, Members & Skill Growth'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === 'es'
            ? 'Core (>20 hrs/sem) participan tiempo completo • Extended (≤20 hrs/sem) participan parcialmente'
            : 'Core (>20 hrs/wk) participate full-time • Extended (≤20 hrs/wk) participate part-time'}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {teams.map(team => {
          const isExpanded = expandedTeam === team.id;
          const coreCount = team.members.filter(m => m.unitType === 'core').length;
          const extCount = team.members.filter(m => m.unitType === 'extended').length;
          const totalHours = team.members.reduce((s, m) => s + m.hoursPerWeek, 0);
          const teamSkills = skills.filter(s => team.skillIds.includes(s.id));
          const avgSkillLevel = teamSkills.length > 0
            ? (teamSkills.reduce((s, sk) => s + sk.currentValue, 0) / teamSkills.length).toFixed(1)
            : '—';

          // Get connected objectives
          const teamKRs = keyResults.filter(kr => kr.teamIds.includes(team.id));
          const connectedObjIds = [...new Set(teamKRs.map(kr => kr.objectiveId))];
          const connectedObjs = objectives.filter(o => connectedObjIds.includes(o.id));

          return (
            <div key={team.id} className="border rounded-lg overflow-hidden">
              {/* Team Header */}
              <button
                onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <span className="text-xl">{team.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">
                      {language === 'es' ? team.nameEs : team.name}
                    </span>
                    {team.teamCategory && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {team.teamCategory === 'digital-build' ? '🔨 Digital Build'
                          : team.teamCategory === 'digital-maintain' ? '🔧 Digital Maintain'
                          : '📋 Business'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="text-status-success font-medium">{coreCount} Core</span>
                    <span className="text-status-warning font-medium">{extCount} Extended</span>
                    <span>
                      <Clock className="h-3 w-3 inline mr-0.5" />
                      {totalHours} {language === 'es' ? 'hrs/sem' : 'hrs/wk'}
                    </span>
                    <span>
                      {language === 'es' ? 'Nivel promedio' : 'Avg skill'}: {avgSkillLevel}/5
                    </span>
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>

              {/* Expanded Members */}
              {isExpanded && (
                <div className="border-t">
                  {/* Connected Objectives */}
                  {connectedObjs.length > 0 && (
                    <div className="px-4 py-2 bg-muted/30 border-b">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {language === 'es' ? 'Objetivos conectados' : 'Connected Objectives'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {connectedObjs.map(obj => (
                          <Badge key={obj.id} variant="secondary" className="text-[10px]">
                            {(language === 'es' ? obj.titleEs : obj.title).slice(0, 50)}...
                            <span className={cn(
                              "ml-1 font-bold",
                              obj.status === 'on-track' ? 'text-status-success' : obj.status === 'attention' ? 'text-status-warning' : 'text-status-critical'
                            )}>{obj.progress}%</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills needed */}
                  {teamSkills.length > 0 && (
                    <div className="px-4 py-2 bg-muted/20 border-b">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        {language === 'es' ? 'Habilidades a desarrollar' : 'Skills to Develop'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {teamSkills.map(sk => {
                          const gap = 5 - sk.currentValue;
                          const trend = sk.currentValue > sk.initialValue ? 'up' : sk.currentValue < sk.initialValue ? 'down' : 'stable';
                          return (
                            <div key={sk.id} className="flex items-center gap-1.5 bg-background rounded-md px-2 py-1 border">
                              <span className="text-xs font-medium">{language === 'es' ? sk.nameEs : sk.name}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(v => (
                                  <div
                                    key={v}
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      v <= sk.currentValue
                                        ? `bg-${getSkillColor(sk.currentValue)}`
                                        : "bg-muted"
                                    )}
                                    style={{
                                      backgroundColor: v <= sk.currentValue
                                        ? sk.currentValue >= 4 ? 'hsl(var(--status-success))' : sk.currentValue >= 3 ? 'hsl(var(--status-warning))' : 'hsl(var(--status-critical))'
                                        : undefined
                                    }}
                                  />
                                ))}
                              </div>
                              {trend === 'up' && <TrendingUp className="h-3 w-3 text-status-success" />}
                              {trend === 'down' && <TrendingDown className="h-3 w-3 text-status-critical" />}
                              {trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
                              {gap > 0 && (
                                <span className="text-[10px] text-status-warning font-medium">+{gap}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Members table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="text-left p-2 font-medium">{language === 'es' ? 'Miembro' : 'Member'}</th>
                          <th className="text-left p-2 font-medium">{language === 'es' ? 'Rol' : 'Role'}</th>
                          <th className="text-center p-2 font-medium">{language === 'es' ? 'Tipo' : 'Type'}</th>
                          <th className="text-center p-2 font-medium">{language === 'es' ? 'Hrs/Sem' : 'Hrs/Wk'}</th>
                          <th className="text-left p-2 font-medium">{language === 'es' ? 'Área' : 'Area'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.members.map(member => (
                          <tr key={member.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="p-2 font-medium">{member.name}</td>
                            <td className="p-2 text-muted-foreground">{language === 'es' ? member.roleEs : member.role}</td>
                            <td className="p-2 text-center">
                              <Badge
                                variant={member.unitType === 'core' ? 'default' : 'outline'}
                                className={cn(
                                  "text-[10px] px-1.5",
                                  member.unitType === 'core'
                                    ? 'bg-status-success/15 text-status-success border-status-success/30'
                                    : 'bg-status-warning/15 text-status-warning border-status-warning/30'
                                )}
                              >
                                {member.unitType === 'core' ? 'Core' : 'Extended'}
                              </Badge>
                            </td>
                            <td className="p-2 text-center font-mono">
                              <span className={cn(
                                "font-medium",
                                member.hoursPerWeek > 20 ? 'text-status-success' : 'text-status-warning'
                              )}>
                                {member.hoursPerWeek}h
                              </span>
                            </td>
                            <td className="p-2 text-muted-foreground">{language === 'es' ? member.areaEs : member.area}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
