import type { User, Goal } from '~/data/mock-data';
import styles from './pending-employees-list.module.css';

interface Props {
  employees: User[];
  goals: Goal[];
  selectedEmployeeId: string | null;
  onSelect: (id: string) => void;
}

export function PendingEmployeesList({ employees, goals, selectedEmployeeId, onSelect }: Props) {
  return (
    <div className={styles.list}>
      <div className={styles.header}>Pending Approvals</div>
      {employees.length === 0 ? (
        <div className={styles.empty}>No pending approvals</div>
      ) : (
        employees.map(emp => {
          const empGoals = goals.filter(g => g.employeeId === emp.id && g.status === 'submitted');
          const submittedDate = empGoals[0] ? new Date(empGoals[0].updatedAt).toLocaleDateString() : '';
          return (
            <button
              key={emp.id}
              className={`${styles.item} ${selectedEmployeeId === emp.id ? styles.selected : ''}`}
              onClick={() => onSelect(emp.id)}
            >
              <div className={styles.avatar}>{emp.avatarInitials}</div>
              <div className={styles.info}>
                <div className={styles.name}>{emp.name}</div>
                <div className={styles.dept}>{emp.department}</div>
                <div className={styles.meta}>{empGoals.length} goals • {submittedDate}</div>
              </div>
              <div className={styles.count}>{empGoals.length}</div>
            </button>
          );
        })
      )}
    </div>
  );
}
