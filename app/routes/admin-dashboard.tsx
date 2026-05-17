import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { OrgStatsCards } from '~/blocks/admin-dashboard/org-stats-cards';
import { CycleManagementPanel } from '~/blocks/admin-dashboard/cycle-management-panel';
import { ExceptionHandlingTable } from '~/blocks/admin-dashboard/exception-handling-table';
import { GoalUnlockTool } from '~/blocks/admin-dashboard/goal-unlock-tool';
import { SharedGoalPusher } from '~/blocks/admin-dashboard/shared-goal-pusher';
import { IconUsers, IconSend, IconCheck, IconClock } from '@tabler/icons-react';
import styles from './admin-dashboard.module.css';

export function meta() {
  return [{ title: 'Admin Dashboard — AtomQuest' }];
}

export default function AdminDashboard() {
  return (
    <AuthenticatedPage allowedRoles={['admin']}>
      <AdminDashboardInner />
    </AuthenticatedPage>
  );
}

function AdminDashboardInner() {
  const { users, goals, checkIns } = useAppState();

  const employees = users.filter(u => u.role === 'employee');
  const employeesWithCheckIns = new Set(
    checkIns.map(ci => goals.find(g => g.id === ci.goalId)?.employeeId).filter(Boolean)
  );

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: IconUsers, color: '#3B82F6' },
    { label: 'Goals Submitted', value: goals.filter(g => g.status !== 'draft').length, icon: IconSend, color: '#FF6B2B' },
    { label: 'Goals Approved', value: goals.filter(g => g.status === 'approved' || g.status === 'locked').length, icon: IconCheck, color: '#22C55E' },
    { label: 'Check-ins Pending', value: Math.max(0, employees.length - employeesWithCheckIns.size), icon: IconClock, color: '#F59E0B' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Control Center</h1>
          <p className={styles.sub}>Org-wide cycle management, exception handling, and goal operations.</p>
        </div>
        <OrgStatsCards stats={stats} />
        <CycleManagementPanel />
        <div className={styles.twoCol}>
          <ExceptionHandlingTable />
          <GoalUnlockTool />
        </div>
        <SharedGoalPusher />
      </div>
    </div>
  );
}
