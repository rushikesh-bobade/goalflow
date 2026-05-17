import styles from './step-progress-indicator.module.css';

interface Props {
  currentStep: 1 | 2;
}

const STEPS = [
  { num: 1, label: 'Select Thrust Area' },
  { num: 2, label: 'Goal Details' },
];

export function StepProgressIndicator({ currentStep }: Props) {
  return (
    <div className={styles.indicator}>
      {STEPS.map((step, idx) => (
        <div key={step.num} className={styles.stepWrapper}>
          <div className={`${styles.step} ${currentStep === step.num ? styles.active : ''} ${currentStep > step.num ? styles.done : ''}`}>
            <div className={styles.stepNum}>
              {currentStep > step.num ? '✔' : step.num}
            </div>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
          {idx < STEPS.length - 1 && <div className={`${styles.connector} ${currentStep > 1 ? styles.connectorDone : ''}`} />}
        </div>
      ))}
    </div>
  );
}
