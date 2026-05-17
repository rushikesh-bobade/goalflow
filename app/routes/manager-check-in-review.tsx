import { useState } from 'react';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { QuarterAndEmployeeFilter } from '~/blocks/manager-check-in-review/quarter-and-employee-filter';
import { CheckInReviewTable } from '~/blocks/manager-check-in-review/check-in-review-table';
import styles from './manager-check-in-review.module.css';

export function meta() {
  return [{ title: 'Check-in Review — AtomQuest' }];
}

export default function ManagerCheckInReviewPage() {
  return (
    <AuthenticatedPage allowedRoles={['manager']}>
      <ManagerCheckInReviewInner />
    </AuthenticatedPage>
  );
}

function ManagerCheckInReviewInner() {
  const { currentUser, users, goals, checkIns } = useAppState();
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const myTeam = users.filter(u => u.managerId === currentUser?.id && u.role === 'employee');
  const teamGoals = goals.filter(g => myTeam.some(e => e.id === g.employeeId));
  const filteredGoals = selectedEmployeeId
    ? teamGoals.filter(g => g.employeeId === selectedEmployeeId)
    : teamGoals;

  function handleSaveComments() {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Check-in Review</h1>
          <p className={styles.sub}>Review your team's quarterly check-in submissions and leave feedback.</p>
        </div>
        <QuarterAndEmployeeFilter
          employees={myTeam}
          selectedQuarter={selectedQuarter}
          selectedEmployeeId={selectedEmployeeId}
          onQuarterChange={setSelectedQuarter}
          onEmployeeChange={setSelectedEmployeeId}
        />
        {savedNotice && <div className={styles.savedBanner}>✓ Comments saved.</div>}
        <CheckInReviewTable
          goals={filteredGoals}
          checkIns={checkIns}
          quarter={selectedQuarter}
          onSaveComments={handleSaveComments}
        />
      </div>
    </div>
  );
}
