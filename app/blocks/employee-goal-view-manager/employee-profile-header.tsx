import type { User, Goal, CheckIn } from '~/data/mock-data';
import { USERS } from '~/data/mock-data';
import styles from './employee-profile-header.module.css';

interface Props {
  employee: User;
  goals: Goal[];
  checkIns: CheckIn[];
}

export function EmployeeProfileHeader({ employee, goals, checkIns }: Props) {
  const manager = USERS.find(u => u.id === employee.managerId);
  const avgScore = checkIns.length > 0
    ? checkIns.reduce((s, ci) => s + (ci.computedScore || 0), 0) / checkIns.length
    : 0;

  return (
    <div className={styles.header}>
      <div className={styles.avatar}>{employee.avatarInitials}</div>
      <div className={styles.info}>
        <h1 className={styles.name}>{employee.name}</h1>
        <div className={styles.meta}>
          <span>{employee.department}</span>
          {manager && <span>Manager: {manager.name}</span>}
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{goals.length}</span>
          <span className={styles.statLabel}>Goals</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{avgScore.toFixed(1)}%</span>
          <span className={styles.statLabel}>Avg Score</span>
        </div>
      </div>
    </div>
  );
}
