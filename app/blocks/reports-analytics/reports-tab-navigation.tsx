import styles from './reports-tab-navigation.module.css';

export type ReportTab = 'achievement' | 'completion' | 'qoq' | 'distribution' | 'effectiveness';

const TABS: { key: ReportTab; label: string }[] = [
  { key: 'achievement', label: 'Achievement Summary' },
  { key: 'completion', label: 'Completion Dashboard' },
  { key: 'qoq', label: 'QoQ Trend' },
  { key: 'distribution', label: 'Goal Distribution' },
  { key: 'effectiveness', label: 'Manager Effectiveness' },
];

interface Props {
  activeTab: ReportTab;
  onChange: (tab: ReportTab) => void;
}

export function ReportsTabNavigation({ activeTab, onChange }: Props) {
  return (
    <div className={styles.tabs}>
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
