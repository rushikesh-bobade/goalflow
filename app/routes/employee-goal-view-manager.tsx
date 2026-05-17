import { useParams } from 'react-router';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { EmployeeProfileHeader } from '~/blocks/employee-goal-view-manager/employee-profile-header';
import { EmployeeGoalList } from '~/blocks/employee-goal-view-manager/employee-goal-list';
import styles from './employee-goal-view-manager.module.css';

export function meta() {
  return [{ title: 'Team Member — AtomQuest' }];
}

export default function EmployeeGoalViewManagerPage() {
  return (
    <AuthenticatedPage allowedRoles={['manager', 'admin']}>
      <EmployeeGoalViewManagerInner />
    </AuthenticatedPage>
  );
}

function EmployeeGoalViewManagerInner() {
  const { employeeId } = useParams();
  const { users, goals, checkIns } = useAppState();

  const employee = users.find(u => u.id === employeeId);
  const empGoals = goals.filter(g => g.employeeId === employeeId);
  const empCheckIns = checkIns.filter(ci => empGoals.some(g => g.id === ci.goalId));

  if (!employee) {
    return <div className={styles.notFound}>Employee not found.</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <EmployeeProfileHeader employee={employee} goals={empGoals} checkIns={empCheckIns} />
        <EmployeeGoalList goals={empGoals} checkIns={empCheckIns} />
      </div>
    </div>
  );
}
