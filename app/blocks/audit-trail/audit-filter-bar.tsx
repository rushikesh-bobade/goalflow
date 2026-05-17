import { IconDownload } from '@tabler/icons-react';
import Papa from 'papaparse';
import type { AuditLog } from '~/data/mock-data';
import styles from './audit-filter-bar.module.css';

interface Props {
  startDate: string;
  endDate: string;
  actionType: string;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onActionTypeChange: (v: string) => void;
  logs: AuditLog[];
}

export function AuditFilterBar({ startDate, endDate, actionType, onStartDateChange, onEndDateChange, onActionTypeChange, logs }: Props) {
  function exportCSV() {
    const csv = Papa.unparse(logs.map(l => ({
      Timestamp: l.timestamp,
      User: l.userId,
      Goal: l.goalId || '',
      Action: l.action,
      'Field Changed': l.fieldChanged || '',
      'Old Value': l.oldValue || '',
      'New Value': l.newValue || '',
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audit-log.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        <div className={styles.field}>
          <label className={styles.label}>Start Date</label>
          <input type="date" className={styles.input} value={startDate} onChange={e => onStartDateChange(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>End Date</label>
          <input type="date" className={styles.input} value={endDate} onChange={e => onEndDateChange(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Action Type</label>
          <select className={styles.select} value={actionType} onChange={e => onActionTypeChange(e.target.value)}>
            <option value="">All Actions</option>
            <option value="goal_created">Goal Created</option>
            <option value="goal_submitted">Goal Submitted</option>
            <option value="goal_approved">Goal Approved</option>
            <option value="goal_rework">Goal Rework</option>
            <option value="goal_unlocked">Goal Unlocked</option>
            <option value="checkin_submitted">Check-in Submitted</option>
            <option value="shared_goal_pushed">Shared Goal Pushed</option>
          </select>
        </div>
      </div>
      <button className={styles.exportBtn} onClick={exportCSV}>
        <IconDownload size={16} /> Export CSV
      </button>
    </div>
  );
}
