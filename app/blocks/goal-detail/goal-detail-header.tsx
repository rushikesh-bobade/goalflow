import { useNavigate } from 'react-router';
import { IconArrowLeft, IconLock } from '@tabler/icons-react';
import type { Goal } from '~/data/mock-data';
import styles from './goal-detail-header.module.css';

const STATUS_COLORS: Record<string, string> = {
  draft: 'var(--color-text-muted)',
  submitted: 'var(--color-info)',
  approved: 'var(--color-success)',
  rework: 'var(--color-warning)',
  locked: 'var(--color-primary)',
};

const STATUS_BG: Record<string, string> = {
  draft: 'rgba(90,95,122,0.15)',
  submitted: 'var(--color-info-bg)',
  approved: 'var(--color-success-bg)',
  rework: 'var(--color-warning-bg)',
  locked: 'rgba(255,107,43,0.12)',
};

const UOM_LABELS: Record<string, string> = {
  numeric_min: '↑ Higher is Better',
  numeric_max: '↓ Lower is Better',
  timeline: '📅 Date Milestone',
  zero: '🛡 Zero Incidents',
};

interface Props { goal: Goal; }

export function GoalDetailHeader({ goal }: Props) {
  const navigate = useNavigate();
  const isLocked = goal.status === 'locked' || goal.status === 'approved';

  return (
    <div className={styles.header}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <IconArrowLeft size={16} /> Back
      </button>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{goal.title}</h1>
        <div className={styles.badges}>
          <span className={styles.uomBadge}>{UOM_LABELS[goal.uomType]}</span>
          <span
            className={styles.statusChip}
            style={{ color: STATUS_COLORS[goal.status], backgroundColor: STATUS_BG[goal.status] }}
          >
            {isLocked && <IconLock size={12} />}
            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
          </span>
        </div>
      </div>
      {isLocked && (
        <div className={styles.lockedMsg}>
          <IconLock size={14} /> This goal is approved and locked. Contact admin to request an edit.
        </div>
      )}
    </div>
  );
}
