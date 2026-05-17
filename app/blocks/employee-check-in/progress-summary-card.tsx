import styles from './progress-summary-card.module.css';

interface Entry {
  goalId: string;
  computedScore: number;
}

interface Props {
  entries: Entry[];
  goals: { id: string; weightage: number }[];
  onSubmit: () => void;
}

export function ProgressSummaryCard({ entries, goals, onSubmit }: Props) {
  const totalWeight = goals.reduce((s, g) => s + g.weightage, 0) || 100;
  const weightedScore = entries.reduce((s, e) => {
    const goal = goals.find(g => g.id === e.goalId);
    if (!goal) return s;
    return s + (e.computedScore * (goal.weightage / totalWeight));
  }, 0);

  const filledCount = entries.filter(e => e.computedScore > 0).length;
  const allFilled = goals.length > 0 && filledCount === goals.length;
  const scoreColor = weightedScore >= 100
    ? 'var(--color-success)'
    : weightedScore >= 70
      ? 'var(--color-warning)'
      : weightedScore > 0
        ? 'var(--color-info)'
        : 'var(--color-text-muted)';

  return (
    <div className={styles.card}>
      <div className={styles.header}>Quarter Summary</div>
      <div className={styles.scoreSection}>
        <div className={styles.score} style={{ color: scoreColor }}>{weightedScore.toFixed(1)}%</div>
        <div className={styles.scoreLabel}>Weighted Avg Score</div>
      </div>
      <div className={styles.breakdown}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{goals.length}</span>
          <span className={styles.statLabel}>Goals</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{filledCount}/{goals.length}</span>
          <span className={styles.statLabel}>Filled</span>
        </div>
      </div>
      <button
        type="button"
        className={`${styles.submitBtn} ${!allFilled ? styles.submitDisabled : ''}`}
        onClick={() => allFilled && onSubmit()}
        disabled={!allFilled}
      >
        Submit Check-in
      </button>
      {!allFilled && (
        <p className={styles.hint}>Fill in all {goals.length} goal{goals.length === 1 ? '' : 's'} to submit</p>
      )}
    </div>
  );
}
