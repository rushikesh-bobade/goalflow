import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { User, Goal, CheckIn } from '~/data/mock-data';
import styles from './completion-dashboard-chart.module.css';

interface Props {
  managers: User[];
  employees: User[];
  goals: Goal[];
  checkIns: CheckIn[];
}

export function CompletionDashboardChart({ managers, employees, goals, checkIns }: Props) {
  const data = managers.map(mgr => {
    const teamEmployees = employees.filter(e => e.managerId === mgr.id);
    const teamGoals = goals.filter(g => teamEmployees.some(e => e.id === g.employeeId));
    const checkedIn = new Set(
      checkIns.filter(ci => teamGoals.some(g => g.id === ci.goalId)).map(ci => {
        const g = teamGoals.find(g => g.id === ci.goalId);
        return g?.employeeId;
      })
    );
    const completion = teamEmployees.length > 0
      ? Math.round((checkedIn.size / teamEmployees.length) * 100)
      : 0;
    return { manager: mgr.name.split(' ')[0], completion };
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Manager-wise Check-in Completion</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2E42" />
          <XAxis dataKey="manager" tick={{ fill: '#8B90A7', fontSize: 12 }} />
          <YAxis tick={{ fill: '#8B90A7', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2A2E42', borderRadius: 8, color: '#F0F2F8' }}
            formatter={(value) => [`${value}%`, 'Completion']}
          />
          <Bar dataKey="completion" fill="#FF6B2B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
