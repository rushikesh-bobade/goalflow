import styles from './quarter-selector-tabs.module.css';

interface Props {
  activeQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  onChange: (q: 'Q1' | 'Q2' | 'Q3' | 'Q4') => void;
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

export function QuarterSelectorTabs({ activeQuarter, onChange }: Props) {
  return (
    <div className={styles.tabs}>
      {QUARTERS.map(q => (
        <button
          key={q}
          className={`${styles.tab} ${activeQuarter === q ? styles.active : ''}`}
          onClick={() => onChange(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
