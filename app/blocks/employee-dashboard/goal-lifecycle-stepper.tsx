import type { Goal } from '~/data/mock-data';
import styles from './goal-lifecycle-stepper.module.css';

const STAGES = [
  { key: 'draft', label: 'Draft', desc: 'Goal created and being edited' },
  { key: 'submitted', label: 'Submitted', desc: 'Awaiting manager review' },
  { key: 'review', label: 'Manager Review', desc: 'Manager is reviewing your goal' },
  { key: 'approved', label: 'Approved', desc: 'Goal approved and locked' },
  { key: 'checkin', label: 'Check-in', desc: 'Quarterly progress being tracked' },
  { key: 'completed', label: 'Completed', desc: 'Goal cycle completed' },
];

function getStageIndex(status: string): number {
  if (status === 'draft') return 0;
  if (status === 'submitted') return 1;
  if (status === 'rework') return 1;
  if (status === 'approved' || status === 'locked') return 3;
  return 0;
}

interface Props {
  goal: Goal;
}

export function GoalLifecycleStepper({ goal }: Props) {
  const currentIndex = getStageIndex(goal.status);

  return (
    <div className={styles.stepper}>
      <h3 className={styles.title}>Goal Lifecycle</h3>
      <div className={styles.steps}>
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;
          return (
            <div key={stage.key} className={`${styles.step} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}>
              <div className={styles.stepIndicator}>
                <div className={styles.stepDot}>
                  {isDone ? '✔' : isActive ? '●' : idx + 1}
                </div>
                {idx < STAGES.length - 1 && <div className={styles.stepLine} />}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepLabel}>{stage.label}</div>
                <div className={styles.stepDesc}>{stage.desc}</div>
                {isActive && goal.status === 'rework' && (
                  <div className={styles.reworkTag}>Returned for Rework</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
