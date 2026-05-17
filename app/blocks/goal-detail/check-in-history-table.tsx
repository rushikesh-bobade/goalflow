import type { CheckIn } from '~/data/mock-data';
import styles from './check-in-history-table.module.css';

interface Props {
  checkIns: CheckIn[];
}

const PROGRESS_COLORS: Record<string, string> = {
  not_started: 'var(--color-text-muted)',
  on_track: 'var(--color-info)',
  completed: 'var(--color-success)',
};

export function CheckInHistoryTable({ checkIns }: Props) {
  if (checkIns.length === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Check-in History</h2>
        <div className={styles.empty}>No check-ins recorded yet for this goal.</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Check-in History</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Quarter</th>
              <th>Actual Value</th>
              <th>Progress Status</th>
              <th>Score</th>
              <th>Manager Comment</th>
            </tr>
          </thead>
          <tbody>
            {checkIns.map(ci => (
              <tr key={ci.id}>
                <td><span className={styles.quarterBadge}>{ci.quarter}</span></td>
                <td>{ci.actualValue ?? ci.actualDate ?? '—'}</td>
                <td>
                  <span style={{ color: PROGRESS_COLORS[ci.progressStatus] }}>
                    {ci.progressStatus.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={styles.score}>
                    {ci.computedScore !== undefined ? `${ci.computedScore.toFixed(1)}%` : '—'}
                  </span>
                </td>
                <td className={styles.comment}>{ci.managerComment || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
