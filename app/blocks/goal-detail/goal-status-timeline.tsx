import type { Goal } from '~/data/mock-data';
import styles from './goal-status-timeline.module.css';

const STAGES = [
  { key: 'draft', label: 'Draft', desc: 'Goal created' },
  { key: 'submitted', label: 'Submitted', desc: 'Submitted for manager review' },
  { key: 'review', label: 'Manager Review', desc: 'Under review' },
  { key: 'approved', label: 'Approved', desc: 'Goal locked and approved' },
  { key: 'checkin', label: 'Check-in Active', desc: 'Quarterly tracking ongoing' },
  { key: 'completed', label: 'Completed', desc: 'Annual cycle complete' },
];

function getStageIndex(status: string): number {
  if (status === 'draft') return 0;
  if (status === 'submitted') return 1;
  if (status === 'rework') return 1;
  if (status === 'approved' || status === 'locked') return 3;
  return 0;
}

interface Props { goal: Goal; }

export function GoalStatusTimeline({ goal }: Props) {
  const currentIndex = getStageIndex(goal.status);

  return (
    <div className={styles.timeline}>
      <h2 className={styles.title}>Goal Status Timeline</h2>
      <div className={styles.steps}>
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;
          return (
            <div key={stage.key} className={`${styles.step} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}>
              <div className={styles.indicator}>
                <div className={styles.dot}>{isDone ? '✔' : isActive ? '●' : ''}</div>
                {idx < STAGES.length - 1 && <div className={styles.line} />}
              </div>
              <div className={styles.content}>
                <div className={styles.label}>{stage.label}</div>
                <div className={styles.desc}>{stage.desc}</div>
                {isActive && <div className={styles.timestamp}>{new Date(goal.updatedAt).toLocaleString()}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
