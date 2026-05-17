import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { User, Goal, CheckIn } from '~/data/mock-data';
import styles from './manager-effectiveness-chart.module.css';

interface Props {
  managers: User[];
  employees: User[];
  goals: Goal[];
  checkIns: CheckIn[];
}

export function ManagerEffectivenessChart({ managers, employees, goals, checkIns }: Props) {
  const data = managers.map(mgr => {
    const teamEmployees = employees.filter(e => e.managerId === mgr.id);
    const teamGoals = goals.filter(g => teamEmployees.some(e => e.id === g.employeeId));
    const totalGoalCheckInSlots = teamGoals.length * 4;
    const actualCheckIns = checkIns.filter(ci => teamGoals.some(g => g.id === ci.goalId)).length;
    const onTime = totalGoalCheckInSlots > 0 ? Math.round((actualCheckIns / totalGoalCheckInSlots) * 100) : 0;
    return { manager: mgr.name.split(' ')[0], onTime };
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Manager Effectiveness (Team Check-in Completion %)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2E42" />
          <XAxis dataKey="manager" tick={{ fill: '#8B90A7', fontSize: 12 }} />
          <YAxis tick={{ fill: '#8B90A7', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2A2E42', borderRadius: 8, color: '#F0F2F8' }}
            formatter={(value) => [`${value}%`, 'On-time Completion']}
          />
          <Bar dataKey="onTime" fill="#22C55E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
