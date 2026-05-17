import { useAppState } from '~/hooks/use-app-state';
import styles from './cycle-management-panel.module.css';

const PHASE_LABELS: Record<string, string> = {
  goal_setting: 'Goal Setting', q1: 'Q1', q2: 'Q2', q3: 'Q3', q4: 'Q4'
};

export function CycleManagementPanel() {
  const { goalCycles, toggleCycleActive } = useAppState();

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Cycle Management</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cycle Name</th>
              <th>Phase</th>
              <th>Window Open</th>
              <th>Window Close</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {goalCycles.map(cycle => (
              <tr key={cycle.id}>
                <td className={styles.cycleName}>{cycle.name}</td>
                <td><span className={styles.phaseBadge}>{PHASE_LABELS[cycle.phase]}</span></td>
                <td>{cycle.windowOpen}</td>
                <td>{cycle.windowClose}</td>
                <td>
                  <span className={`${styles.statusBadge} ${cycle.isActive ? styles.active : styles.inactive}`}>
                    {cycle.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    className={`${styles.toggleBtn} ${cycle.isActive ? styles.deactivate : styles.activate}`}
                    onClick={() => toggleCycleActive(cycle.id)}
                  >
                    {cycle.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
