import { useEffect, useState } from 'react';
import { IconUsers, IconSend, IconCheck, IconClock } from '@tabler/icons-react';
import styles from './team-stats-cards.module.css';

interface Stat { label: string; value: number; icon: React.ElementType; color: string; }

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

interface Props { stats: Stat[]; }

export function TeamStatsCards({ stats }: Props) {
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
