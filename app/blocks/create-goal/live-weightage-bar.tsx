import styles from './live-weightage-bar.module.css';

interface Props {
  existingWeightage: number;
  newWeightage: number;
}

export function LiveWeightageBar({ existingWeightage, newWeightage }: Props) {
  const total = existingWeightage + newWeightage;
  const isOver = total > 100;
  const isComplete = total === 100;
  const existingPct = Math.min(existingWeightage, 100);
  const newPct = Math.min(newWeightage, Math.max(0, 100 - existingPct));

  return (
    <div className={styles.bar}>
      <div className={styles.barLabel}>
        <span>Total Weightage</span>
        <span className={`${styles.total} ${isOver ? styles.over : ''} ${isComplete ? styles.complete : ''}`}>
          {total}%
        </span>
      </div>
      <div className={styles.track}>
        <div className={styles.existing} style={{ width: `${existingPct}%` }} />
        <div
          className={`${styles.new} ${isOver ? styles.newOver : ''}`}
          style={{ width: `${newPct}%` }}
        />
      </div>
      <div className={styles.legend}>
        <span className={styles.existingLegend}>■ Existing ({existingWeightage}%)</span>
        <span className={styles.newLegend}>■ New Goal ({newWeightage}%)</span>
        <span className={styles.remainingLegend}>{Math.max(0, 100 - total)}% remaining</span>
      </div>
    </div>
  );
}
