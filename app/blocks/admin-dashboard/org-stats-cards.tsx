import { useEffect, useState } from 'react';
import { IconUsers, IconSend, IconCheck, IconClock } from '@tabler/icons-react';
import styles from './org-stats-cards.module.css';

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (800 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

interface Stat { label: string; value: number; icon: React.ElementType; color: string; }

export function OrgStatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className={styles.grid}>
      {stats.map(stat => (
        <div key={stat.label} className={styles.card}>
          <div className={styles.iconWrapper} style={{ background: `${stat.color}1A` }}>
            <stat.icon size={22} style={{ color: stat.color }} />
          </div>
          <div className={styles.info}>
            <div className={styles.value}><CountUp target={stat.value} /></div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
