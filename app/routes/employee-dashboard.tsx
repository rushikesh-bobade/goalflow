import { useState } from 'react';
import { Link } from 'react-router';
import { IconPlus, IconSend, IconInfoCircle } from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { AnimatedWeightageRing } from '~/blocks/employee-dashboard/animated-weightage-ring';
import { GoalCardsGrid } from '~/blocks/employee-dashboard/goal-cards-grid';
import { QuarterlyCheckInBanner } from '~/blocks/employee-dashboard/quarterly-check-in-banner';
import { GoalLifecycleStepper } from '~/blocks/employee-dashboard/goal-lifecycle-stepper';
import { AlignmentTree } from '~/blocks/employee-dashboard/alignment-tree';
import styles from './employee-dashboard.module.css';

export function meta() {
  return [{ title: 'My Dashboard — AtomQuest' }];
}

const MAX_GOALS = 8;

export default function EmployeeDashboard() {
  return (
    <AuthenticatedPage allowedRoles={['employee']}>
      <EmployeeDashboardInner />
    </AuthenticatedPage>
  );
}

function EmployeeDashboardInner() {
  const { currentUser, goals, goalCycles, submitGoals } = useAppState();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const myGoals = goals.filter(g => g.employeeId === currentUser?.id);
  const totalWeightage = myGoals.reduce((sum, g) => sum + g.weightage, 0);
  const draftGoals = myGoals.filter(g => g.status === 'draft' || g.status === 'rework');
  const hasSubmittable = draftGoals.length > 0;
  const activeCheckinCycle = goalCycles.find(c => c.isActive && c.phase !== 'goal_setting');
  const selectedGoal = selectedGoalId ? myGoals.find(g => g.id === selectedGoalId) : null;
  const atMax = myGoals.length >= MAX_GOALS;
  const canSubmit = totalWeightage === 100 && hasSubmittable;

  function handleSubmitAll() {
    const ids = draftGoals.map(g => g.id);
    if (ids.length > 0) submitGoals(ids);
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {activeCheckinCycle && (
          <QuarterlyCheckInBanner
            quarter={activeCheckinCycle.phase.toUpperCase()}
            closeDate={activeCheckinCycle.windowClose}
          />
        )}

        <header className={styles.greeting}>
          <div>
            <h1 className={styles.greetTitle}>Hi {currentUser?.name?.split(' ')[0]} 👋</h1>
            <p className={styles.greetSub}>
              You have <strong>{myGoals.length}</strong> goal{myGoals.length === 1 ? '' : 's'}
              {draftGoals.length > 0 && <> — <strong>{draftGoals.length}</strong> awaiting submission</>}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link
              to="/employee/goals/new"
              className={`${styles.btn} ${styles.btnSecondary} ${atMax ? styles.btnDisabled : ''}`}
              onClick={e => atMax && e.preventDefault()}
              aria-disabled={atMax}
            >
              <IconPlus size={15} /> Add Goal
            </Link>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary} ${!canSubmit ? styles.btnDisabled : ''}`}
              onClick={handleSubmitAll}
              disabled={!canSubmit}
              title={!canSubmit && totalWeightage !== 100 ? `Total must equal 100% (currently ${totalWeightage}%)` : ''}
            >
              <IconSend size={15} /> Submit for Approval
            </button>
          </div>
        </header>

        {(atMax || totalWeightage !== 100 && myGoals.length > 0) && (
          <div className={styles.validationBanner}>
            <IconInfoCircle size={14} />
            {atMax && <span>Maximum of 8 goals reached.</span>}
            {totalWeightage > 100 && (
              <span>Total weightage is <strong>{totalWeightage}%</strong> — reduce one to bring it to 100%.</span>
            )}
            {totalWeightage < 100 && totalWeightage > 0 && (
              <span>Total weightage is <strong>{totalWeightage}%</strong> — add {100 - totalWeightage}% more to submit.</span>
            )}
          </div>
        )}

        <div className={styles.content}>
          <section className={styles.mainCol}>
            <div className={styles.ringRow}>
              <AnimatedWeightageRing percentage={totalWeightage} />
              <div className={styles.ringInfo}>
                <div className={styles.ringStat}>
                  <span className={styles.ringStatNum}>{myGoals.length}</span>
                  <span className={styles.ringStatLabel}>Total Goals</span>
                </div>
                <div className={styles.ringDivider} />
                <div className={styles.ringStat}>
                  <span className={styles.ringStatNum}>{myGoals.filter(g => g.status === 'approved' || g.status === 'locked').length}</span>
                  <span className={styles.ringStatLabel}>Approved</span>
                </div>
                <div className={styles.ringDivider} />
                <div className={styles.ringStat}>
                  <span className={styles.ringStatNum}>{myGoals.filter(g => g.status === 'submitted').length}</span>
                  <span className={styles.ringStatLabel}>Pending</span>
                </div>
                <div className={styles.ringDivider} />
                <div className={styles.ringStat}>
                  <span className={styles.ringStatNum}>{MAX_GOALS - myGoals.length}</span>
                  <span className={styles.ringStatLabel}>Slots Left</span>
                </div>
              </div>
            </div>

            <GoalCardsGrid
              goals={myGoals}
              onSelectGoal={setSelectedGoalId}
              selectedGoalId={selectedGoalId ?? undefined}
            />
          </section>

          <aside className={styles.sideCol}>
            {selectedGoal ? (
              <GoalLifecycleStepper goal={selectedGoal} />
            ) : (
              <div className={styles.sideHint}>
                <div className={styles.sideHintIcon}>💡</div>
                <div className={styles.sideHintTitle}>Pick a goal</div>
                <div className={styles.sideHintText}>
                  Click any goal card to see its lifecycle status and review history.
                </div>
              </div>
            )}
            <AlignmentTree />
          </aside>
        </div>
      </div>
    </div>
  );
}
