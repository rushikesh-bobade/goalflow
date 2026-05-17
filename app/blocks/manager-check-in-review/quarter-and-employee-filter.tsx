import type { User } from '~/data/mock-data';
import styles from './quarter-and-employee-filter.module.css';

interface Props {
  employees: User[];
  selectedQuarter: string;
  selectedEmployeeId: string;
  onQuarterChange: (q: string) => void;
  onEmployeeChange: (id: string) => void;
}

export function QuarterAndEmployeeFilter({ employees, selectedQuarter, selectedEmployeeId, onQuarterChange, onEmployeeChange }: Props) {
  return (
    <div className={styles.filters}>
      <div className={styles.field}>
        <label className={styles.label}>Quarter</label>
        <select className={styles.select} value={selectedQuarter} onChange={e => onQuarterChange(e.target.value)}>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Employee</label>
        <select className={styles.select} value={selectedEmployeeId} onChange={e => onEmployeeChange(e.target.value)}>
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
