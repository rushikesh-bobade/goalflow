import { Link } from 'react-router';
import { IconUser, IconLayoutDashboard, IconShieldLock, IconArrowRight } from '@tabler/icons-react';
import styles from './roles-showcase.module.css';

const ROLES = [
  {
    icon: IconUser,
    label: 'Employee',
    perks: ['Create up to 8 goals', 'Live weightage validation', 'Quarterly self check-ins', 'View your scorecard'],
    color: '#3B82F6',
  },
  {
    icon: IconLayoutDashboard,
    label: 'Manager',
    perks: ['Approve / rework / reject', 'Inline edit goals', 'Heatmap of team progress', 'Manager comments per goal'],
    color: '#22C55E',
  },
  {
    icon: IconShieldLock,
    label: 'Admin',
    perks: ['Activate goal cycles', 'Push shared goals', 'Unlock locked goals', 'Audit trail + reports export'],
    color: '#FF6B2B',
  },
];

export function RolesShowcase() {
  return (
    <section id="roles" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Roles</span>
          <h2 className={styles.heading}>Tailored for every persona</h2>
          <p className={styles.sub}>Three distinct dashboards — one cohesive workflow.</p>
        </div>
        <div className={styles.grid}>
          {ROLES.map(role => (
            <div key={role.label} className={styles.card} style={{ '--role-color': role.color } as React.CSSProperties}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}><role.icon size={28} stroke={1.6} /></div>
                <div className={styles.cardName}>{role.label}</div>
              </div>
              <ul className={styles.perks}>
                {role.perks.map(p => <li key={p}><span className={styles.dot} />{p}</li>)}
              </ul>
              <Link to="/login" className={styles.tryBtn}>
                Try {role.label.toLowerCase()} demo <IconArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
