import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { THRUST_AREAS } from '~/data/mock-data';
import type { Goal } from '~/data/mock-data';
import { IconSend } from '@tabler/icons-react';
import styles from './shared-goal-pusher.module.css';

export function SharedGoalPusher() {
  const { currentUser, users, goalCycles, pushSharedGoal } = useAppState();
  const [selectedThrust, setSelectedThrust] = useState('');
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState<number | ''>('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const employees = users.filter(u => u.role === 'employee');
  const activeCycle = goalCycles.find(c => c.isActive);

  function toggleEmployee(id: string) {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  }

  function handlePush() {
    if (!selectedThrust || !title.trim() || !target || selectedEmployees.length === 0) return;
    const goalTemplate: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      employeeId: '',
      cycleId: activeCycle?.id || '',
      thrustAreaId: selectedThrust,
      title,
      description: 'Shared goal pushed by Admin',
      uomType: 'numeric_min',
      targetValue: Number(target),
      weightage: 10,
      status: 'submitted',
      isShared: true,
      sharedBy: currentUser?.id,
    };
    pushSharedGoal(goalTemplate, selectedEmployees);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setTitle(''); setTarget(''); setSelectedEmployees([]); setSelectedThrust('');
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Shared Goal Pusher</h2>
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Thrust Area</label>
            <select className={styles.select} value={selectedThrust} onChange={e => setSelectedThrust(e.target.value)}>
              <option value="">Select thrust area...</option>
              {THRUST_AREAS.map(ta => <option key={ta.id} value={ta.id}>{ta.icon} {ta.name}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Goal Title</label>
            <input className={styles.input} placeholder="Enter shared goal title..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Target Value</label>
            <input type="number" className={styles.input} placeholder="Target..." value={target} onChange={e => setTarget(Number(e.target.value) || '')} />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Select Employees ({selectedEmployees.length} selected)</label>
          <div className={styles.empGrid}>
            {employees.map(emp => (
              <button
                key={emp.id}
                className={`${styles.empChip} ${selectedEmployees.includes(emp.id) ? styles.empSelected : ''}`}
                onClick={() => toggleEmployee(emp.id)}
              >
                <span className={styles.empInitials}>{emp.avatarInitials}</span>
                <span>{emp.name}</span>
              </button>
            ))}
          </div>
        </div>

        {success && <div className={styles.success}>Shared goal pushed to {selectedEmployees.length} employees!</div>}

        <button className={styles.pushBtn} onClick={handlePush}>
          <IconSend size={16} /> Push to Selected Employees
        </button>
      </div>
    </div>
  );
}
