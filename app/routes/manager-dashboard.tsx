import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { TeamStatsCards } from '~/blocks/manager-dashboard/team-stats-cards';
import { TeamProgressTable } from '~/blocks/manager-dashboard/team-progress-table';
import { CompletionHeatmapGrid } from '~/blocks/manager-dashboard/completion-heatmap-grid';
import { IconUsers, IconSend, IconCheck, IconClock } from '@tabler/icons-react';
import styles from './manager-dashboard.module.css';

export function meta() {
  return [{ title: 'Team Dashboard — AtomQuest' }];
}

export default function ManagerDashboard() {
  return (
    <AuthenticatedPage allowedRoles={['manager']}>
      <ManagerDashboardInner />
    </AuthenticatedPage>
  );
}

function ManagerDashboardInner() {
  const { currentUser, users, goals, checkIns } = useAppState();

  const myTeam = users.filter(u => u.managerId === currentUser?.id && u.role === 'employee');
  const teamGoals = goals.filter(g => myTeam.some(e => e.id === g.employeeId));
  const teamCheckIns = checkIns.filter(ci => teamGoals.some(g => g.id === ci.goalId));

  const employeesWithCheckIns = new Set(
    teamCheckIns.map(ci => teamGoals.find(g => g.id === ci.goalId)?.employeeId).filter(Boolean)
  );
  const pendingCount = myTeam.length - employeesWithCheckIns.size;

  const stats = [
    { label: 'Direct Reports', value: myTeam.length, icon: IconUsers, color: '#3B82F6' },
    { label: 'Goals Submitted', value: teamGoals.filter(g => g.status !== 'draft').length, icon: IconSend, color: '#FF6B2B' },
    { label: 'Goals Approved', value: teamGoals.filter(g => g.status === 'approved' || g.status === 'locked').length, icon: IconCheck, color: '#22C55E' },
    { label: 'Check-ins Pending', value: Math.max(0, pendingCount), icon: IconClock, color: '#F59E0B' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Team Dashboard</h1>
          <p className={styles.sub}>Welcome back, {currentUser?.name}. Here's how your team is tracking.</p>
        </div>
        <TeamStatsCards stats={stats} />
        <TeamProgressTable employees={myTeam} goals={teamGoals} checkIns={teamCheckIns} activeQuarter="Q1" />
        <CompletionHeatmapGrid employees={myTeam} goals={teamGoals} checkIns={teamCheckIns} />
      </div>
    </div>
  );
}
