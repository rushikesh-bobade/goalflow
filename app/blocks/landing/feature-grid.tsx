import {
  IconTarget, IconChartLine, IconLock, IconBell,
  IconUsers, IconChartPie
} from '@tabler/icons-react';
import styles from './feature-grid.module.css';

const FEATURES = [
  {
    icon: IconTarget,
    title: 'Structured Goal Framework',
    desc: 'Set up to 8 goals across thrust areas with weightage validation summing exactly to 100%.',
    color: '#FF6B2B',
  },
  {
    icon: IconChartLine,
    title: 'Auto Score Computation',
    desc: '4 UoM formulas (higher-is-better, lower-is-better, timeline, zero) computed live during check-ins.',
    color: '#22C55E',
  },
  {
    icon: IconBell,
    title: 'Real-time Notifications',
    desc: 'In-app alerts for submissions, approvals, rework requests, and admin unlocks with deep links.',
    color: '#3B82F6',
  },
  {
    icon: IconLock,
    title: 'Audit-grade Logging',
    desc: 'Every action — from goal creation to unlock — is logged with timestamps and exportable to CSV.',
    color: '#A855F7',
  },
  {
    icon: IconUsers,
    title: 'Hierarchy-aware',
    desc: 'Manager dashboards aggregate only their direct reports. Admins see org-wide views.',
    color: '#F59E0B',
  },
  {
    icon: IconChartPie,
    title: 'QoQ Analytics',
    desc: 'Quarter-over-quarter trends, completion heatmaps, and manager effectiveness charts.',
    color: '#EF4444',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Built for performance</span>
          <h2 className={styles.heading}>Everything you need to run a goal cycle</h2>
          <p className={styles.sub}>
            From goal creation to year-end review — the entire performance management loop, productized.
          </p>
        </div>
        <div className={styles.grid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.card}>
              <div className={styles.iconWrap} style={{ backgroundColor: `${f.color}1A`, color: f.color }}>
                <f.icon size={24} stroke={1.8} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
