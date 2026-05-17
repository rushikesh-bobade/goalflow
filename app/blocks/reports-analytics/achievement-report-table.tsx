import { useState } from 'react';
import type { Goal, User, CheckIn } from '~/data/mock-data';
import { THRUST_AREAS } from '~/data/mock-data';
import styles from './achievement-report-table.module.css';

interface Props {
  goals: Goal[];
  users: User[];
  checkIns: CheckIn[];
}

interface ReportRow {
  goal: Goal;
  emp: User | undefined;
  ta: typeof THRUST_AREAS[0] | undefined;
  ci: CheckIn | null;
}

export function AchievementReportTable({ goals, users, checkIns }: Props) {
  const [filter, setFilter] = useState('');

  const allRows: ReportRow[] = [];
  goals.forEach(g => {
    const emp = users.find(u => u.id === g.employeeId);
    const ta = THRUST_AREAS.find(t => t.id === g.thrustAreaId);
    const goalCheckIns = checkIns.filter(ci => ci.goalId === g.id);
    if (goalCheckIns.length === 0) {
      allRows.push({ goal: g, emp, ta, ci: null });
    } else {
      goalCheckIns.forEach(ci => allRows.push({ goal: g, emp, ta, ci }));
    }
  });
  const rows = allRows.filter(row =>
    !filter || row.emp?.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Filter by employee..." value={filter} onChange={e => setFilter(e.target.value)} />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Goal Title</th>
              <th>Thrust Area</th>
              <th>UoM</th>
              <th>Target</th>
              <th>Actual</th>
              <th>Score %</th>
              <th>Quarter</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className={styles.empName}>{row.emp?.name || '—'}</td>
                <td>{row.emp?.department || '—'}</td>
                <td className={styles.goalTitle}>{row.goal.title}</td>
                <td>{row.ta?.name || '—'}</td>
                <td><span className={styles.uomBadge}>{row.goal.uomType}</span></td>
                <td>{row.goal.targetValue?.toLocaleString() || row.goal.targetDate || '—'}</td>
                <td>{row.ci?.actualValue?.toLocaleString() || row.ci?.actualDate || '—'}</td>
                <td>
                  {row.ci?.computedScore !== undefined
                    ? <span className={styles.score}>{row.ci.computedScore.toFixed(1)}%</span>
                    : '—'
                  }
                </td>
                <td>{row.ci?.quarter || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
