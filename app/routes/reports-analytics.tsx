import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { ReportsTabNavigation, type ReportTab } from '~/blocks/reports-analytics/reports-tab-navigation';
import { ExportActionBar } from '~/blocks/reports-analytics/export-action-bar';
import { AchievementReportTable } from '~/blocks/reports-analytics/achievement-report-table';
import { CompletionDashboardChart } from '~/blocks/reports-analytics/completion-dashboard-chart';
import { QoQAchievementTrendChart } from '~/blocks/reports-analytics/qo-q-achievement-trend-chart';
import { GoalDistributionCharts } from '~/blocks/reports-analytics/goal-distribution-charts';
import { ManagerEffectivenessChart } from '~/blocks/reports-analytics/manager-effectiveness-chart';
import { TeamCompletionHeatmap } from '~/blocks/reports-analytics/team-completion-heatmap';
import styles from './reports-analytics.module.css';

export function meta() {
  return [{ title: 'Reports & Analytics — AtomQuest' }];
}

export default function ReportsAnalyticsPage() {
  return (
    <AuthenticatedPage allowedRoles={['admin']}>
      <ReportsAnalyticsInner />
    </AuthenticatedPage>
  );
}

function ReportsAnalyticsInner() {
  const { users, goals, checkIns, auditLogs } = useAppState();
  const [activeTab, setActiveTab] = useState<ReportTab>('achievement');

  const employees = users.filter(u => u.role === 'employee');
  const managers = users.filter(u => u.role === 'manager');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Reports & Analytics</h1>
          <p className={styles.sub}>Comprehensive performance insights across the organization.</p>
        </div>
        <ExportActionBar goals={goals} checkIns={checkIns} users={users} auditLogs={auditLogs} />
        <ReportsTabNavigation activeTab={activeTab} onChange={setActiveTab} />
        <div className={styles.content}>
          {activeTab === 'achievement' && (
            <AchievementReportTable goals={goals} users={users} checkIns={checkIns} />
          )}
          {activeTab === 'completion' && (
            <div className={styles.twoColCharts}>
              <CompletionDashboardChart managers={managers} employees={employees} goals={goals} checkIns={checkIns} />
              <TeamCompletionHeatmap employees={employees} goals={goals} checkIns={checkIns} />
            </div>
          )}
          {activeTab === 'qoq' && (
            <QoQAchievementTrendChart employees={employees} goals={goals} checkIns={checkIns} />
          )}
          {activeTab === 'distribution' && (
            <GoalDistributionCharts goals={goals} />
          )}
          {activeTab === 'effectiveness' && (
            <ManagerEffectivenessChart managers={managers} employees={employees} goals={goals} checkIns={checkIns} />
          )}
        </div>
      </div>
    </div>
  );
}
