import { useState } from 'react';
import type { AuditLog } from '~/data/mock-data';
import { USERS } from '~/data/mock-data';
import styles from './audit-log-table.module.css';

interface Props { logs: AuditLog[]; }

const PAGE_SIZE = 15;

export function AuditLogTable({ logs }: Props) {
  const [page, setPage] = useState(1);
  const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function getUserName(userId: string) {
    return USERS.find(u => u.id === userId)?.name || userId;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Goal</th>
              <th>Action</th>
              <th>Field Changed</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(log => (
              <tr key={log.id}>
                <td className={styles.timestamp}>{new Date(log.timestamp).toLocaleString()}</td>
                <td className={styles.user}>{getUserName(log.userId)}</td>
                <td className={styles.goal}>{log.goalId ? log.goalId.split('-').slice(0, 2).join('-') : '—'}</td>
                <td><span className={styles.action}>{log.action.replace(/_/g, ' ')}</span></td>
                <td>{log.fieldChanged || '—'}</td>
                <td className={styles.value}>{log.oldValue || '—'}</td>
                <td className={styles.value}>{log.newValue || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
          <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
          <button className={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
}
