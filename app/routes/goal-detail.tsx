import { useParams } from 'react-router';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { GoalDetailHeader } from '~/blocks/goal-detail/goal-detail-header';
import { GoalInformationPanel } from '~/blocks/goal-detail/goal-information-panel';
import { GoalStatusTimeline } from '~/blocks/goal-detail/goal-status-timeline';
import { CheckInHistoryTable } from '~/blocks/goal-detail/check-in-history-table';
import styles from './goal-detail.module.css';

export function meta() {
  return [{ title: 'Goal Details — AtomQuest' }];
}

export default function GoalDetailPage() {
  return (
    <AuthenticatedPage>
      <GoalDetailInner />
    </AuthenticatedPage>
  );
}

function GoalDetailInner() {
  const { goalId } = useParams();
  const { goals, checkIns } = useAppState();

  const goal = goals.find(g => g.id === goalId);
  const goalCheckIns = checkIns.filter(ci => ci.goalId === goalId);

  if (!goal) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.notFound}>Goal not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <GoalDetailHeader goal={goal} />
        <div className={styles.content}>
          <div className={styles.mainCol}>
            <GoalInformationPanel goal={goal} />
            <CheckInHistoryTable checkIns={goalCheckIns} />
          </div>
          <div className={styles.sideCol}>
            <GoalStatusTimeline goal={goal} />
          </div>
        </div>
      </div>
    </div>
  );
}
