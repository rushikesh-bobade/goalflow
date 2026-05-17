import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { User, Goal, CheckIn } from '~/data/mock-data';
import styles from './qo-q-achievement-trend-chart.module.css';

const COLORS = ['#FF6B2B', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

interface Props {
  employees: User[];
  goals: Goal[];
  checkIns: CheckIn[];
}

export function QoQAchievementTrendChart({ employees, goals, checkIns }: Props) {
  const data = QUARTERS.map(q => {
    const entry: Record<string, any> = { quarter: q };
    employees.forEach(emp => {
      const empGoals = goals.filter(g => g.employeeId === emp.id);
      const qCheckIns = checkIns.filter(ci => empGoals.some(g => g.id === ci.goalId) && ci.quarter === q);
      entry[emp.name.split(' ')[0]] = qCheckIns.length > 0
        ? Math.round(qCheckIns.reduce((s, ci) => s + (ci.computedScore || 0), 0) / qCheckIns.length)
        : null;
    });
    return entry;
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>QoQ Achievement Trend per Employee</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2E42" />
          <XAxis dataKey="quarter" tick={{ fill: '#8B90A7', fontSize: 12 }} />
          <YAxis tick={{ fill: '#8B90A7', fontSize: 12 }} domain={[0, 150]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2A2E42', borderRadius: 8, color: '#F0F2F8' }}
            formatter={(value) => value !== null ? [`${value}%`, 'Score'] : ['No data', '']}
          />
          <Legend wrapperStyle={{ color: '#8B90A7' }} />
          {employees.map((emp, idx) => (
            <Line
              key={emp.id}
              type="monotone"
              dataKey={emp.name.split(' ')[0]}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
