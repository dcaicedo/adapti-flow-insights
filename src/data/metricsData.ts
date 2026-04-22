// ============= Enhanced Metrics Data =============
// Per-member, per-day breakdowns and Kanban workflow states

export interface DailyMetric {
  day: string; // e.g. "Mon", "Tue"
  date: string; // e.g. "2025-07-07"
  itemsCompleted: number;
  cycleTime: number;
  leadTime: number;
}

export interface MemberMetrics {
  memberId: string;
  name: string;
  avgCycleTime: number;
  avgLeadTime: number;
  throughput: number;
  velocity: number;
  happiness: number;
  daily: DailyMetric[];
}

export interface KanbanSnapshot {
  sprint: string;
  backlog: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  blocked: number;
}

export interface SprintFlowData {
  day: string;
  backlog: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}

// Generates realistic per-member daily data for a sprint (10 working days)
function generateMemberDaily(baseCycle: number, baseLead: number, baseThroughput: number): DailyMetric[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dates = [
    '2025-07-07','2025-07-08','2025-07-09','2025-07-10','2025-07-11',
    '2025-07-14','2025-07-15','2025-07-16','2025-07-17','2025-07-18'
  ];
  return days.map((day, i) => {
    const dayFactor = (day === 'Mon' || day === 'Fri') ? 0.8 : 1.1;
    return {
      day: `${day} ${dates[i].slice(5)}`,
      date: dates[i],
      itemsCompleted: Math.max(0, Math.round((baseThroughput / 10) * dayFactor + (Math.random() - 0.5) * 2)),
      cycleTime: +(baseCycle * (0.7 + Math.random() * 0.6)).toFixed(1),
      leadTime: +(baseLead * (0.7 + Math.random() * 0.6)).toFixed(1),
    };
  });
}

// Generate member metrics for a team
export function generateTeamMemberMetrics(
  members: { id: string; name: string }[],
  teamBaseCycle: number,
  teamBaseLead: number,
  teamBaseThroughput: number,
  teamBaseVelocity: number,
  teamBaseHappiness: number,
): MemberMetrics[] {
  return members.map((m, i) => {
    const seniority = i < Math.ceil(members.length * 0.3) ? 1.2 : i < Math.ceil(members.length * 0.6) ? 1.0 : 0.85;
    const variance = 0.8 + Math.random() * 0.4;
    const memberCycle = +(teamBaseCycle * (1 / seniority) * variance).toFixed(1);
    const memberLead = +(teamBaseLead * (1 / seniority) * variance).toFixed(1);
    const memberThroughput = Math.round((teamBaseThroughput / members.length) * seniority * variance);
    const memberVelocity = Math.round((teamBaseVelocity / members.length) * seniority * variance);
    const memberHappiness = +(teamBaseHappiness * (0.85 + Math.random() * 0.3)).toFixed(1);

    return {
      memberId: m.id,
      name: m.name,
      avgCycleTime: memberCycle,
      avgLeadTime: memberLead,
      throughput: Math.max(1, memberThroughput),
      velocity: Math.max(2, memberVelocity),
      happiness: Math.min(10, Math.max(3, memberHappiness)),
      daily: generateMemberDaily(memberCycle, memberLead, memberThroughput),
    };
  });
}

// Generate Kanban snapshots aligned with sprint metrics
export function generateKanbanSnapshots(throughputHistory: number[]): KanbanSnapshot[] {
  const sprints = ['S1','S2','S3','S4','S5','S6','S7','S8'];
  let totalDone = 0;
  return sprints.slice(0, throughputHistory.length).map((sprint, i) => {
    const done = throughputHistory[i];
    totalDone += done;
    const wip = Math.round(done * (0.3 + Math.random() * 0.4));
    const review = Math.round(done * (0.15 + Math.random() * 0.2));
    const todo = Math.round(done * (0.4 + Math.random() * 0.3));
    const backlog = Math.max(0, Math.round(done * (1.2 + Math.random() * 0.8) - totalDone * 0.1));
    const blocked = Math.round(wip * (0.05 + Math.random() * 0.15));
    return { sprint, backlog, todo, inProgress: wip, review, done, blocked };
  });
}

// Generate cumulative flow diagram data (daily within a sprint)
export function generateCumulativeFlowData(totalItems: number): SprintFlowData[] {
  const days = ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7','Day 8','Day 9','Day 10'];
  let done = 0, review = 0, inProgress = 0;
  const backlogStart = totalItems;
  
  return days.map((day, i) => {
    const progress = (i + 1) / days.length;
    const completedToday = Math.round(totalItems * (0.05 + Math.random() * 0.08) * (0.5 + progress));
    done += completedToday;
    review = Math.max(1, Math.round(totalItems * 0.12 * (1 - progress * 0.3) + (Math.random() - 0.5) * 2));
    inProgress = Math.max(1, Math.round(totalItems * 0.2 * (1 - progress * 0.2) + (Math.random() - 0.5) * 3));
    const todo = Math.max(0, Math.round(totalItems * 0.25 * (1 - progress * 0.8)));
    const backlog = Math.max(0, backlogStart - done - review - inProgress - todo);
    
    return {
      day,
      backlog: Math.max(0, backlog),
      todo: Math.max(0, todo),
      inProgress: Math.max(1, inProgress),
      review: Math.max(0, review),
      done: Math.min(totalItems, done),
    };
  });
}

// Cycle time distribution data (individual item cycle times)
export interface CycleTimeItem {
  id: number;
  cycleTime: number;
  category: 'feature' | 'bug' | 'task' | 'spike';
  percentile: string;
}

export function generateCycleTimeDistribution(baseCycleTime: number, count: number = 40): CycleTimeItem[] {
  const categories: CycleTimeItem['category'][] = ['feature', 'bug', 'task', 'spike'];
  const items: CycleTimeItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const catMultiplier = cat === 'feature' ? 1.5 : cat === 'bug' ? 0.7 : cat === 'task' ? 0.5 : 1.2;
    // Log-normal-ish distribution
    const raw = baseCycleTime * catMultiplier * Math.exp((Math.random() - 0.5) * 1.2);
    items.push({
      id: i,
      cycleTime: +Math.max(0.5, raw).toFixed(1),
      category: cat,
      percentile: '',
    });
  }
  
  // Sort and assign percentiles
  items.sort((a, b) => a.cycleTime - b.cycleTime);
  items.forEach((item, i) => {
    const pct = ((i + 1) / items.length) * 100;
    if (pct <= 50) item.percentile = '≤P50';
    else if (pct <= 85) item.percentile = 'P50-P85';
    else if (pct <= 95) item.percentile = 'P85-P95';
    else item.percentile = '>P95';
  });
  
  return items;
}

// Heatmap data: member × day activity
export interface HeatmapCell {
  member: string;
  day: string;
  value: number;
  metric: string;
}

export function generateHeatmapData(memberMetrics: MemberMetrics[], metric: 'itemsCompleted' | 'cycleTime'): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  memberMetrics.forEach(m => {
    m.daily.forEach(d => {
      cells.push({
        member: m.name.split(' ')[0],
        day: d.day,
        value: d[metric],
        metric,
      });
    });
  });
  return cells;
}
