import { Link } from 'react-router';
import { IconLock, IconLink, IconChevronRight } from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import { THRUST_AREAS } from '~/data/mock-data';
import type { Goal } from '~/data/mock-data';
import styles from './goal-cards-grid.module.css';

const STATUS_COLORS: Record<string, string> = {
  draft: 'var(--color-text-muted)',
  submitted: 'var(--color-info)',
  approved: 'var(--color-success)',
  rework: 'var(--color-warning)',
  locked: 'var(--color-primary)',
};

const STATUS_BG: Record<string, string> = {
  draft: 'rgba(90,97,120,0.16)',
  submitted: 'var(--color-info-bg)',
  approved: 'var(--color-success-bg)',
  rework: 'var(--color-warning-bg)',
  locked: 'rgba(255,107,43,0.12)',
};

const UOM_LABELS: Record<string, string> = {
  numeric_min: '↑ Higher',
  numeric_max: '↓ Lower',
  timeline: '📅 Date',
  zero: '🛡 Zero',
};

interface Props {
  goals: Goal[];
  onSelectGoal?: (goalId: string) => void;
  selectedGoalId?: string;
}

export function GoalCardsGrid({ goals, onSelectGoal, selectedGoalId }: Props) {
  const { users } = useAppState();

  if (goals.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🎯</div>
        <div className={styles.emptyTitle}>No goals yet</div>
        <div className={styles.emptyText}>Click "Add New Goal" below to create your first goal for FY 2025–26.</div>
        <Link to="/employee/goals/new" className={styles.emptyBtn}>Create First Goal</Link>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {goals.map(goal => {
        const thrustArea = THRUST_AREAS.find(t => t.id === goal.thrustAreaId);
        const isSelected = selectedGoalId === goal.id;
        const isLocked = goal.status === 'locked' || goal.status === 'approved';
        const sharedBy = goal.sharedBy ? users.find(u => u.id === goal.sharedBy) : null;

        return (
          <div
            key={goal.id}
            role="button"
            tabIndex={0}
            className={`${styles.card} ${isSelected ? styles.selected : ''} ${isLocked ? styles.locked : ''}`}
            onClick={() => onSelectGoal?.(goal.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectGoal?.(goal.id); } }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.thrustTag}>
                {thrustArea?.icon} {thrustArea?.name ?? '—'}
              </span>
              {goal.isShared && (
                <span className={styles.sharedBadge} title={`Shared by ${sharedBy?.name ?? 'Admin'}`}>
                  <IconLink size={11} /> Shared
                </span>
              )}
              <span
                className={styles.statusChip}
                style={{ color: STATUS_COLORS[goal.status], backgroundColor: STATUS_BG[goal.status] }}
              >
                {isLocked && <IconLock size={10} />}
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{goal.title}</h3>
            <div className={styles.cardMeta}>
              <span className={styles.uomBadge}>{UOM_LABELS[goal.uomType]}</span>
              {goal.targetValue !== undefined && (
                <span className={styles.target}>Target: <strong>{goal.targetValue.toLocaleString()}</strong></span>
              )}
              {goal.targetDate && (
                <span className={styles.target}>By: <strong>{goal.targetDate}</strong></span>
              )}
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.weightage}>{goal.weightage}% weight</span>
              <Link to={`/employee/goals/${goal.id}`} className={styles.viewLink} onClick={e => e.stopPropagation()}>
                Details <IconChevronRight size={13} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
