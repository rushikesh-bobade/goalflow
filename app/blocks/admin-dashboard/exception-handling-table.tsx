import { IconBell } from '@tabler/icons-react';
import styles from './exception-handling-table.module.css';

const EXCEPTIONS = [
  { id: 'e1', employee: 'Anjali Verma', action: 'Goals Not Submitted', daysLate: 5 },
  { id: 'e2', employee: 'Karan Joshi', action: 'Check-in Missing', daysLate: 3 },
];

export function ExceptionHandlingTable() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Exception Handling</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Action Overdue</th>
              <th>Days Late</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {EXCEPTIONS.map(ex => (
              <tr key={ex.id}>
                <td className={styles.empName}>{ex.employee}</td>
                <td><span className={styles.actionBadge}>{ex.action}</span></td>
                <td><span className={styles.days}>{ex.daysLate} days</span></td>
                <td>
                  <button className={styles.nudgeBtn} onClick={() => alert(`Nudge sent to ${ex.employee}!`)}>
                    <IconBell size={14} /> Nudge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
