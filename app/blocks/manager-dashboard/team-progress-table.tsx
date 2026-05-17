import { useState } from 'react';
import { Link } from 'react-router';
import { IconChevronRight } from '@tabler/icons-react';
import type { User, Goal, CheckIn } from '~/data/mock-data';
import styles from './team-progress-table.module.css';

interface Props {
  employees: User[];
  goals: Goal[];
  checkIns: CheckIn[];
  activeQuarter: string;
}

export function TeamProgressTable({ employees, goals, checkIns, activeQuarter }: Props) {
  const [filter, setFilter] = useState('');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(filter.toLowerCase()) ||
    e.department.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Team Progress</h2>
        <input
          className={styles.search}
          placeholder="Search employees..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Goals Submitted</th>
              <th>Goals Approved</th>
              <th>Check-in Status</th>
              <th>Overall Score %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => {
              const empGoals = goals.filter(g => g.employeeId === emp.id);
              const submitted = empGoals.filter(g => g.status === 'submitted' || g.status === 'approved' || g.status === 'locked').length;
              const approved = empGoals.filter(g => g.status === 'approved' || g.status === 'locked').length;
              const empCheckIns = checkIns.filter(ci => empGoals.some(g => g.id === ci.goalId) && ci.quarter === activeQuarter);
              const checkInStatus = empCheckIns.length > 0 ? 'Submitted' : 'Pending';
              const avgScore = empCheckIns.length > 0
                ? empCheckIns.reduce((s, ci) => s + (ci.computedScore || 0), 0) / empCheckIns.length
                : 0;

              return (
                <tr key={emp.id} className={styles.row}>
                  <td>
                    <div className={styles.empName}>{emp.name}</div>
                    <div className={styles.empDept}>{emp.department}</div>
                  </td>
                  <td>{submitted}</td>
                  <td>{approved}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${checkInStatus === 'Submitted' ? styles.statusDone : styles.statusPending}`}>
                      {checkInStatus}
                    </span>
                  </td>
                  <td>
                    <span className={styles.score}>{avgScore > 0 ? `${avgScore.toFixed(1)}%` : '—'}</span>
                  </td>
                  <td>
                    <Link to={`/manager/team/${emp.id}`} className={styles.viewBtn}>
                      View <IconChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
