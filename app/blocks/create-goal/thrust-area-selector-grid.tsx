import { THRUST_AREAS } from '~/data/mock-data';
import styles from './thrust-area-selector-grid.module.css';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function ThrustAreaSelectorGrid({ selected, onSelect }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Select Thrust Area</h2>
      <p className={styles.sub}>Choose the strategic category for your goal</p>
      <div className={styles.grid}>
        {THRUST_AREAS.map(area => (
          <button
            key={area.id}
            className={`${styles.card} ${selected === area.id ? styles.selected : ''}`}
            onClick={() => onSelect(area.id)}
          >
            <div className={styles.icon}>{area.icon}</div>
            <div className={styles.name}>{area.name}</div>
            <div className={styles.desc}>{area.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
