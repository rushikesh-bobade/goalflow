import { useState, useEffect } from 'react';
import { computeScore } from '~/data/score-engine';
import type { Goal } from '~/data/mock-data';
import styles from './goal-check-in-form-list.module.css';

const UOM_LABELS: Record<string, string> = {
  numeric_min: '↑ Higher is Better',
  numeric_max: '↓ Lower is Better',
  timeline: '📅 Date Milestone',
  zero: '🛡 Zero Incidents',
};

interface GoalCheckInEntry {
  goalId: string;
  actualValue?: number;
  actualDate?: string;
  progressStatus: 'not_started' | 'on_track' | 'completed';
  computedScore: number;
}

interface Props {
  goals: Goal[];
  onEntriesChange: (entries: GoalCheckInEntry[]) => void;
}

export function GoalCheckInFormList({ goals, onEntriesChange }: Props) {
  const [entries, setEntries] = useState<GoalCheckInEntry[]>(
    goals.map(g => ({ goalId: g.id, progressStatus: 'not_started', computedScore: 0 }))
  );

  useEffect(() => {
    onEntriesChange(entries);
  }, [entries, onEntriesChange]);

  function updateEntry(goalId: string, updates: Partial<GoalCheckInEntry>) {
    setEntries(prev => prev.map(e => {
      if (e.goalId !== goalId) return e;
      const updated = { ...e, ...updates };
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        if (goal.uomType === 'timeline' && updated.actualDate) {
          updated.computedScore = computeScore(goal.uomType, goal.targetValue || 0, 0, goal.targetDate ? new Date(goal.targetDate) : undefined, new Date(updated.actualDate));
        } else if (updated.actualValue !== undefined && goal.targetValue !== undefined) {
          updated.computedScore = computeScore(goal.uomType, goal.targetValue, updated.actualValue);
        }
      }
      return updated;
    }));
  }

  return (
    <div className={styles.list}>
      {goals.map(goal => {
        const entry = entries.find(e => e.goalId === goal.id);
        const score = entry?.computedScore || 0;
        const scoreColor = score >= 100 ? 'var(--color-success)' : score >= 70 ? 'var(--color-warning)' : 'var(--color-danger)';

        return (
          <div key={goal.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.goalInfo}>
                <div className={styles.goalTitle}>{goal.title}</div>
                <div className={styles.goalMeta}>
                  <span className={styles.uomBadge}>{UOM_LABELS[goal.uomType]}</span>
                  <span className={styles.target}>
                    Target: {goal.targetValue !== undefined ? goal.targetValue.toLocaleString() : goal.targetDate}
                  </span>
                </div>
              </div>
              <div className={styles.scoreDisplay} style={{ color: scoreColor }}>
                <div className={styles.scoreNum}>{score.toFixed(1)}</div>
                <div className={styles.scoreLabel}>Score %</div>
              </div>
            </div>

            <div className={styles.inputs}>
              {goal.uomType === 'timeline' ? (
                <div className={styles.field}>
                  <label className={styles.label}>Completion Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    onChange={e => updateEntry(goal.id, { actualDate: e.target.value })}
                  />
                </div>
              ) : (
                <div className={styles.field}>
                  <label className={styles.label}>Actual Achievement {goal.uomType === 'zero' ? '(incidents)' : ''}</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="Enter actual value"
                    min={0}
                    onChange={e => updateEntry(goal.id, { actualValue: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
              <div className={styles.field}>
                <label className={styles.label}>Progress Status</label>
                <select
                  className={styles.select}
                  value={entry?.progressStatus || 'not_started'}
                  onChange={e => updateEntry(goal.id, { progressStatus: e.target.value as any })}
                >
                  <option value="not_started">Not Started</option>
                  <option value="on_track">On Track</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
