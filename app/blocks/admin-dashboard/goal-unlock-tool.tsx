import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { IconSearch, IconLockOpen } from '@tabler/icons-react';
import styles from './goal-unlock-tool.module.css';

export function GoalUnlockTool() {
  const { users, goals, currentUser, unlockGoal } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);

  const filteredEmployees = users.filter(u =>
    u.role === 'employee' &&
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const empLockedGoals = goals.filter(g =>
    g.employeeId === selectedEmployee && (g.status === 'locked' || g.status === 'approved')
  );

  function handleUnlock() {
    if (!selectedGoalId || !reason.trim()) return;
    unlockGoal(selectedGoalId, reason, currentUser?.id || '');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSelectedGoalId('');
    setReason('');
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Goal Unlock Tool</h2>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Search Employee</label>
          <div className={styles.searchWrapper}>
            <IconSearch size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Type employee name..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSelectedEmployee(''); }}
            />
          </div>
          {searchQuery && filteredEmployees.length > 0 && !selectedEmployee && (
            <div className={styles.suggestions}>
              {filteredEmployees.map(emp => (
                <button key={emp.id} className={styles.suggestion} onClick={() => { setSelectedEmployee(emp.id); setSearchQuery(emp.name); }}>
                  {emp.name} — {emp.department}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedEmployee && (
          <div className={styles.field}>
            <label className={styles.label}>Select Goal to Unlock</label>
            <select className={styles.select} value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)}>
              <option value="">Choose goal...</option>
              {empLockedGoals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>
        )}

        {selectedGoalId && (
          <div className={styles.field}>
            <label className={styles.label}>Unlock Reason (required)</label>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="Explain why you are unlocking this goal..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        )}

        {success && <div className={styles.success}>Goal unlocked successfully and employee notified!</div>}

        <button
          className={`${styles.unlockBtn} ${(!selectedGoalId || !reason.trim()) ? styles.unlockDisabled : ''}`}
          onClick={handleUnlock}
          disabled={!selectedGoalId || !reason.trim()}
        >
          <IconLockOpen size={16} /> Unlock Goal
        </button>
      </div>
    </div>
  );
}
