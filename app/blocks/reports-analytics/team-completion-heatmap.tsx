import type { User, Goal, CheckIn } from '~/data/mock-data';
import styles from './team-completion-heatmap.module.css';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

function getCellColor(score: number | null): string {
  if (score === null) return 'var(--color-surface-elevated)';
  if (score >= 70) return 'rgba(34, 197, 94, 0.3)';
  if (score >= 40) return 'rgba(245, 158, 11, 0.3)';
  return 'rgba(239, 68, 68, 0.3)';
}

function getCellTextColor(score: number | null): string {
  if (score === null) return 'var(--color-text-muted)';
  if (score >= 70) return 'var(--color-success)';
  if (score >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

interface Props { employees: User[]; goals: Goal[]; checkIns: CheckIn[]; }

export function TeamCompletionHeatmap({ employees, goals, checkIns }: Props) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Team Completion Heatmap</h3>
      <div className={styles.grid}>
        <div className={styles.headerRow}>
          <div className={styles.empCell}>Employee</div>
          {QUARTERS.map(q => <div key={q} className={styles.qHeader}>{q}</div>)}
        </div>
        {employees.map(emp => {
          const empGoals = goals.filter(g => g.employeeId === emp.id);
          return (
            <div key={emp.id} className={styles.row}>
              <div className={styles.empCell}>{emp.name.split(' ')[0]}</div>
              {QUARTERS.map(q => {
                const qci = checkIns.filter(ci => empGoals.some(g => g.id === ci.goalId) && ci.quarter === q);
                const score = qci.length > 0 ? qci.reduce((s, ci) => s + (ci.computedScore || 0), 0) / qci.length : null;
                return (
                  <div key={q} className={styles.cell} style={{ backgroundColor: getCellColor(score) }}
                    title={score !== null ? `${emp.name} ${q}: ${score.toFixed(1)}%` : `${emp.name} ${q}: No data`}>
                    <span style={{ color: getCellTextColor(score) }}>
                      {score !== null ? `${score.toFixed(0)}%` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
