import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { THRUST_AREAS } from '~/data/mock-data';
import type { Goal } from '~/data/mock-data';
import styles from './goal-distribution-charts.module.css';

const PIE_COLORS = ['#FF6B2B', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

interface Props { goals: Goal[]; }

export function GoalDistributionCharts({ goals }: Props) {
  const byThrust = THRUST_AREAS.map(ta => ({
    name: ta.name.split(' ')[0],
    value: goals.filter(g => g.thrustAreaId === ta.id).length,
  })).filter(d => d.value > 0);

  const byUom = ['numeric_min', 'numeric_max', 'timeline', 'zero'].map(uom => ({
    name: uom.replace('_', '\n'),
    count: goals.filter(g => g.uomType === uom).length,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.chartCard}>
        <h3 className={styles.title}>Goals by Thrust Area</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={byThrust} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: '#8B90A7' }}>
              {byThrust.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2A2E42', borderRadius: 8, color: '#F0F2F8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartCard}>
        <h3 className={styles.title}>Goals by UoM Type</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byUom} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2E42" />
            <XAxis dataKey="name" tick={{ fill: '#8B90A7', fontSize: 11 }} />
            <YAxis tick={{ fill: '#8B90A7', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2A2E42', borderRadius: 8, color: '#F0F2F8' }} />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
