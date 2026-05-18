import { IconTarget, IconUsers, IconUserCircle } from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import styles from './alignment-tree.module.css';

export function AlignmentTree() {
  const { currentUser, goals, users } = useAppState();

  if (!currentUser) return null;

  const manager = users.find(u => u.id === currentUser.managerId);
  const admin = users.find(u => u.role === 'admin');

  // Find a goal created by the admin (Company Goal)
  const companyGoal = goals.find(g => g.employeeId === admin?.id) || { title: 'Grow Revenue by 20% in Q3' };
  
  // Find a goal created by the manager (Team Goal)
  const teamGoal = goals.find(g => g.employeeId === manager?.id) || { title: 'Increase Regional Sales Conversion' };

  // Get the employee's top goal
  const myGoals = goals.filter(g => g.employeeId === currentUser.id);
  const myTopGoal = myGoals.sort((a, b) => b.weightage - a.weightage)[0] || { title: 'Draft your first goal' };

  return (
    <div className={styles.treeWrap}>
      <h3 className={styles.title}>Goal Alignment</h3>
      <p className={styles.subtitle}>See how your work contributes to AtomQuest's success.</p>
      
      <div className={styles.tree}>
        <div className={styles.node}>
          <div className={`${styles.card} ${styles.company}`}>
            <IconTarget size={16} />
            <div className={styles.meta}>Company OKR</div>
            <div className={styles.goalTitle}>{companyGoal.title}</div>
          </div>
        </div>
        
        <div className={styles.line} />
        
        <div className={styles.node}>
          <div className={`${styles.card} ${styles.team}`}>
            <IconUsers size={16} />
            <div className={styles.meta}>{manager?.name || 'Department'} OKR</div>
            <div className={styles.goalTitle}>{teamGoal.title}</div>
          </div>
        </div>

        <div className={styles.line} />

        <div className={styles.node}>
          <div className={`${styles.card} ${styles.personal}`}>
            <IconUserCircle size={16} />
            <div className={styles.meta}>Your Top Goal</div>
            <div className={styles.goalTitle}>{myTopGoal.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
