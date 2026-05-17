import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { PendingEmployeesList } from '~/blocks/manager-approvals/pending-employees-list';
import { GoalReviewPanel } from '~/blocks/manager-approvals/goal-review-panel';
import styles from './manager-approvals.module.css';

export function meta() {
  return [{ title: 'Goal Approvals — AtomQuest' }];
}

export default function ManagerApprovalsPage() {
  return (
    <AuthenticatedPage allowedRoles={['manager']}>
      <ManagerApprovalsInner />
    </AuthenticatedPage>
  );
}

function ManagerApprovalsInner() {
  const { currentUser, users, goals, approveGoals, rejectGoals, reworkGoals } = useAppState();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const myTeam = users.filter(u => u.managerId === currentUser?.id && u.role === 'employee');
  const pendingEmployees = myTeam.filter(emp =>
    goals.some(g => g.employeeId === emp.id && g.status === 'submitted')
  );

  const selectedEmployee = selectedEmployeeId ? users.find(u => u.id === selectedEmployeeId) : null;
  const selectedGoals = selectedEmployeeId
    ? goals.filter(g => g.employeeId === selectedEmployeeId && g.status === 'submitted')
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Goal Approvals</h1>
          <p className={styles.sub}>{pendingEmployees.length} employee{pendingEmployees.length === 1 ? '' : 's'} awaiting review</p>
        </div>
        <div className={styles.splitLayout}>
          <div className={styles.leftPanel}>
            <PendingEmployeesList
              employees={pendingEmployees}
              goals={goals}
              selectedEmployeeId={selectedEmployeeId}
              onSelect={setSelectedEmployeeId}
            />
          </div>
          <div className={styles.rightPanel}>
            <GoalReviewPanel
              employee={selectedEmployee ?? null}
              goals={selectedGoals}
              onApproveAll={(goalIds) => {
                approveGoals(goalIds, currentUser?.id || '');
                setSelectedEmployeeId(null);
              }}
              onRejectAll={(goalIds, comment) => {
                rejectGoals(goalIds, currentUser?.id || '', comment);
                setSelectedEmployeeId(null);
              }}
              onReworkAll={(goalIds, comment) => {
                reworkGoals(goalIds, currentUser?.id || '', comment);
                setSelectedEmployeeId(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
