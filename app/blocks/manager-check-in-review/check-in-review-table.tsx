import { useState } from 'react';
import type { Goal, CheckIn } from '~/data/mock-data';
import styles from './check-in-review-table.module.css';

interface Props {
  goals: Goal[];
  checkIns: CheckIn[];
  quarter: string;
  onSaveComments: (comments: Record<string, string>) => void;
}

export function CheckInReviewTable({ goals, checkIns, quarter, onSaveComments }: Props) {
  const [comments, setComments] = useState<Record<string, string>>({});

  const relevantCheckIns = checkIns.filter(ci => ci.quarter === quarter);

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Goal Title</th>
              <th>Target</th>
              <th>Actual</th>
              <th>Score</th>
              <th>Progress</th>
              <th>Manager Comment</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(goal => {
              const ci = relevantCheckIns.find(c => c.goalId === goal.id);
              return (
                <tr key={goal.id}>
                  <td className={styles.goalTitle}>{goal.title}</td>
                  <td>{goal.targetValue?.toLocaleString() ?? goal.targetDate ?? '—'}</td>
                  <td>{ci?.actualValue ?? ci?.actualDate ?? <span className={styles.missing}>Not submitted</span>}</td>
                  <td>
                    {ci?.computedScore !== undefined
                      ? <span className={styles.score}>{ci.computedScore.toFixed(1)}%</span>
                      : '—'
                    }
                  </td>
                  <td>{ci?.progressStatus?.replace('_', ' ') ?? '—'}</td>
                  <td>
                    <input
                      className={styles.commentInput}
                      placeholder="Add comment..."
                      value={comments[goal.id] || ci?.managerComment || ''}
                      onChange={e => setComments(prev => ({ ...prev, [goal.id]: e.target.value }))}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        <button className={styles.saveBtn} onClick={() => onSaveComments(comments)}>
          Save Comments
        </button>
      </div>
    </div>
  );
}
