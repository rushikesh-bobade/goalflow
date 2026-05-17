import { useState } from 'react';
import { IconPencil, IconCheck, IconX, IconRefresh } from '@tabler/icons-react';
import type { Goal, User } from '~/data/mock-data';
import styles from './goal-review-panel.module.css';

interface Props {
  employee: User | null;
  goals: Goal[];
  onApproveAll: (goalIds: string[], comment?: string) => void;
  onRejectAll: (goalIds: string[], comment: string) => void;
  onReworkAll: (goalIds: string[], comment: string) => void;
}

export function GoalReviewPanel({ employee, goals, onApproveAll, onRejectAll, onReworkAll }: Props) {
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [showReworkBox, setShowReworkBox] = useState(false);

  if (!employee) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>👁️</div>
        <div>Select an employee to review their goals</div>
      </div>
    );
  }

  const goalIds = goals.map(g => g.id);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.empInfo}>
          <div className={styles.empAvatar}>{employee.avatarInitials}</div>
          <div>
            <div className={styles.empName}>{employee.name}</div>
            <div className={styles.empDept}>{employee.department}</div>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Goal Title</th>
              <th>Thrust Area</th>
              <th>UoM</th>
              <th>Target</th>
              <th>Weightage</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(goal => (
              <tr key={goal.id}>
                <td className={styles.goalTitle}>{goal.title}</td>
                <td>TA-{goal.thrustAreaId.split('-')[1]}</td>
                <td>{goal.uomType}</td>
                <td>
                  {editingGoal === goal.id ? (
                    <input
                      type="number"
                      className={styles.inlineInput}
                      defaultValue={goal.targetValue}
                      onBlur={() => setEditingGoal(null)}
                      autoFocus
                    />
                  ) : (
                    <span className={styles.editableCell} onClick={() => setEditingGoal(goal.id)}>
                      {goal.targetValue?.toLocaleString() ?? goal.targetDate}
                      <IconPencil size={12} className={styles.pencil} />
                    </span>
                  )}
                </td>
                <td>{goal.weightage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnApprove} onClick={() => onApproveAll(goalIds)}>
          <IconCheck size={16} /> Approve All
        </button>
        <button className={styles.btnReject} onClick={() => onRejectAll(goalIds, 'Rejected by manager')}>
          <IconX size={16} /> Reject All
        </button>
        <button className={styles.btnRework} onClick={() => setShowReworkBox(p => !p)}>
          <IconRefresh size={16} /> Send for Rework
        </button>
      </div>

      {showReworkBox && (
        <div className={styles.reworkBox}>
          <label className={styles.reworkLabel}>Rework comment (required)</label>
          <textarea
            className={styles.reworkInput}
            rows={3}
            placeholder="Explain what needs to be revised..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            className={styles.btnSubmitRework}
            onClick={() => {
              if (comment.trim()) {
                onReworkAll(goalIds, comment);
                setComment('');
                setShowReworkBox(false);
              }
            }}
          >
            Submit Rework Request
          </button>
        </div>
      )}
    </div>
  );
}
