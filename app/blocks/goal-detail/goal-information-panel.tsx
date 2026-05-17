import { IconLink } from '@tabler/icons-react';
import type { Goal } from '~/data/mock-data';
import { THRUST_AREAS } from '~/data/mock-data';
import styles from './goal-information-panel.module.css';

interface Props { goal: Goal; }

export function GoalInformationPanel({ goal }: Props) {
  const thrustArea = THRUST_AREAS.find(t => t.id === goal.thrustAreaId);

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Goal Information</h2>
      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Thrust Area</span>
          <span className={styles.fieldValue}>{thrustArea?.icon} {thrustArea?.name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Weightage</span>
          <span className={styles.fieldValue}>{goal.weightage}%</span>
        </div>
        {goal.targetValue !== undefined && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Target Value</span>
            <span className={styles.fieldValue}>{goal.targetValue.toLocaleString()}</span>
          </div>
        )}
        {goal.targetDate && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Target Date</span>
            <span className={styles.fieldValue}>{goal.targetDate}</span>
          </div>
        )}
        {goal.isShared && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Shared Goal</span>
            <span className={`${styles.fieldValue} ${styles.shared}`}>
              <IconLink size={14} /> Yes — pushed by Admin
            </span>
          </div>
        )}
        <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
          <span className={styles.fieldLabel}>Description</span>
          <span className={styles.fieldValue}>{goal.description || 'No description provided.'}</span>
        </div>
      </div>
    </div>
  );
}
