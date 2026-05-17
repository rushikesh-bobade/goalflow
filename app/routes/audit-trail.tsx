import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { AuditFilterBar } from '~/blocks/audit-trail/audit-filter-bar';
import { AuditLogTable } from '~/blocks/audit-trail/audit-log-table';
import styles from './audit-trail.module.css';

export function meta() {
  return [{ title: 'Audit Trail — AtomQuest' }];
}

export default function AuditTrailPage() {
  return (
    <AuthenticatedPage>
      <AuditTrailInner />
    </AuthenticatedPage>
  );
}

function AuditTrailInner() {
  const { auditLogs } = useAppState();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [actionType, setActionType] = useState('');

  const filtered = auditLogs.filter(log => {
    if (startDate && new Date(log.timestamp) < new Date(startDate)) return false;
    if (endDate && new Date(log.timestamp) > new Date(endDate)) return false;
    if (actionType && log.action !== actionType) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Audit Trail</h1>
          <p className={styles.sub}>Complete system action log — <strong>{filtered.length}</strong> entries</p>
        </div>
        <AuditFilterBar
          startDate={startDate} endDate={endDate} actionType={actionType}
          onStartDateChange={setStartDate} onEndDateChange={setEndDate} onActionTypeChange={setActionType}
          logs={filtered}
        />
        <AuditLogTable logs={filtered} />
      </div>
    </div>
  );
}
