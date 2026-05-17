import { IconDownload, IconTable } from '@tabler/icons-react';
import Papa from 'papaparse';
import type { AuditLog, Goal, CheckIn, User } from '~/data/mock-data';
import styles from './export-action-bar.module.css';

interface Props {
  goals: Goal[];
  checkIns: CheckIn[];
  users: User[];
  auditLogs: AuditLog[];
}

export function ExportActionBar({ goals, checkIns, users, auditLogs }: Props) {
  function exportCSV() {
    const rows = goals.map(g => {
      const emp = users.find(u => u.id === g.employeeId);
      const empCheckIns = checkIns.filter(ci => ci.goalId === g.id);
      return {
        Employee: emp?.name || '',
        Department: emp?.department || '',
        'Goal Title': g.title,
        'Thrust Area': g.thrustAreaId,
        UoM: g.uomType,
        Target: g.targetValue || g.targetDate || '',
        Weightage: `${g.weightage}%`,
        Status: g.status,
        'Q1 Score': empCheckIns.find(ci => ci.quarter === 'Q1')?.computedScore?.toFixed(1) || '',
        'Q2 Score': empCheckIns.find(ci => ci.quarter === 'Q2')?.computedScore?.toFixed(1) || '',
        'Q3 Score': empCheckIns.find(ci => ci.quarter === 'Q3')?.computedScore?.toFixed(1) || '',
        'Q4 Score': empCheckIns.find(ci => ci.quarter === 'Q4')?.computedScore?.toFixed(1) || '',
      };
    });
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'achievement-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.bar}>
      <button className={styles.csvBtn} onClick={exportCSV}>
        <IconDownload size={16} /> Export to CSV
      </button>
      <button className={styles.xlsxBtn} onClick={() => alert('Excel export requires xlsx package — configure in production')}>
        <IconTable size={16} /> Export to Excel
      </button>
    </div>
  );
}
