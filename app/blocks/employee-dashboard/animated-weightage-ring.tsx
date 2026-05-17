import { useEffect, useState } from 'react';
import styles from './animated-weightage-ring.module.css';

interface Props {
  percentage: number;
}

const RADIUS = 72;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AnimatedWeightageRing({ percentage }: Props) {
  const [animated, setAnimated] = useState(0);
  const isComplete = percentage === 100;
  const isOverflow = percentage > 100;
  const color = isOverflow ? 'var(--color-danger)' : isComplete ? 'var(--color-success)' : 'var(--color-primary)';
  const trackColor = 'var(--color-surface-elevated)';
  const offset = CIRCUMFERENCE - (Math.min(percentage, 100) / 100) * CIRCUMFERENCE;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={styles.wrapper}>
      <svg width={180} height={180} className={styles.svg}>
        <circle
          cx={90} cy={90} r={RADIUS}
          fill="none"
          stroke={trackColor}
          strokeWidth={STROKE}
        />
        <circle
          cx={90} cy={90} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.percentage} style={{ color }}>{Math.min(percentage, 100)}%</span>
        <span className={styles.label}>Weightage</span>
        {isComplete && <span className={styles.checkmark}>✔</span>}
        {isOverflow && <span className={styles.warning}>Over 100%!</span>}
      </div>
    </div>
  );
}
