import { useState } from 'react';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import type { Goal, CheckIn } from '~/data/mock-data';
import styles from './employee-goal-list.module.css';

interface Props {
  goals: Goal[];
  checkIns: CheckIn[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'var(--color-text-muted)', submitted: 'var(--color-info)',
  approved: 'var(--color-success)', rework: 'var(--color-warning)', locked: 'var(--color-primary)',
};

export function EmployeeGoalList({ goals, checkIns }: Props) {
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  return (
    <div className={styles.list}>
      <h2 className={styles.title}>Goals</h2>
      {goals.map(goal => {
        const goalCheckIns = checkIns.filter(ci => ci.goalId === goal.id);
        const isExpanded = expandedGoalId === goal.id;
        return (
          <div key={goal.id} className={styles.card}>
            <button className={styles.cardHeader} onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}>
              <div className={styles.headerLeft}>
                <span className={styles.statusDot} style={{ backgroundColor: STATUS_COLORS[goal.status] }} />
                <span className={styles.goalTitle}>{goal.title}</span>
              </div>
              <div className={styles.headerRight}>
                <span className={styles.weightage}>{goal.weightage}%</span>
                <span className={styles.status} style={{ color: STATUS_COLORS[goal.status] }}>
                  {goal.status}
                </span>
                {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
              </div>
            </button>
            {isExpanded && (
              <div className={styles.checkInHistory}>
                {goalCheckIns.length === 0 ? (
                  <div className={styles.noCheckIns}>No check-ins recorded</div>
                ) : (
                  goalCheckIns.map(ci => (
                    <div key={ci.id} className={styles.ciRow}>
                      <span className={styles.ciQuarter}>{ci.quarter}</span>
                      <span>Actual: {ci.actualValue ?? ci.actualDate ?? '—'}</span>
                      <span>Score: {ci.computedScore?.toFixed(1) ?? '—'}%</span>
                      <span className={styles.ciStatus}>{ci.progressStatus.replace('_', ' ')}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
