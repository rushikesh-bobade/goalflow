import { useState, useCallback } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { QuarterSelectorTabs } from '~/blocks/employee-check-in/quarter-selector-tabs';
import { GoalCheckInFormList } from '~/blocks/employee-check-in/goal-check-in-form-list';
import { ProgressSummaryCard } from '~/blocks/employee-check-in/progress-summary-card';
import type { CheckIn } from '~/data/mock-data';
import styles from './employee-check-in.module.css';

export function meta() {
  return [{ title: 'Quarterly Check-in — AtomQuest' }];
}

export default function EmployeeCheckInPage() {
  return (
    <AuthenticatedPage allowedRoles={['employee']}>
      <EmployeeCheckInInner />
    </AuthenticatedPage>
  );
}

function EmployeeCheckInInner() {
  const { currentUser, goals, goalCycles, addCheckIn } = useAppState();
  const [activeQuarter, setActiveQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [entries, setEntries] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const myApprovedGoals = goals.filter(
    g => g.employeeId === currentUser?.id && (g.status === 'approved' || g.status === 'locked')
  );

  const activeCycle = goalCycles.find(c => c.isActive);

  const handleEntriesChange = useCallback((newEntries: any[]) => {
    setEntries(newEntries);
  }, []);

  function handleSubmit() {
    entries.forEach(entry => {
      const checkIn: CheckIn = {
        id: `ci-${Date.now()}-${entry.goalId}`,
        goalId: entry.goalId,
        cycleId: activeCycle?.id || '',
        quarter: activeQuarter,
        actualValue: entry.actualValue,
        actualDate: entry.actualDate,
        progressStatus: entry.progressStatus,
        computedScore: entry.computedScore,
        employeeSubmittedAt: new Date().toISOString(),
      };
      addCheckIn(checkIn);
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quarterly Check-in</h1>
          <p className={styles.sub}>Report your actual achievements for <strong>{activeQuarter}</strong> — FY 2025–26. Scores compute live as you type.</p>
        </div>
        <QuarterSelectorTabs activeQuarter={activeQuarter} onChange={setActiveQuarter} />

        {submitted && (
          <div className={styles.successBanner}>✓ Check-in submitted successfully! Your manager has been notified.</div>
        )}

        <div className={styles.content}>
          <div className={styles.mainCol}>
            {myApprovedGoals.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🎯</div>
                <div className={styles.emptyTitle}>No approved goals yet</div>
                <div className={styles.emptyText}>Wait for your manager to approve your goals before you can check in.</div>
              </div>
            ) : (
              <GoalCheckInFormList goals={myApprovedGoals} onEntriesChange={handleEntriesChange} />
            )}
          </div>
          <div className={styles.sideCol}>
            <ProgressSummaryCard
              entries={entries}
              goals={myApprovedGoals}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
