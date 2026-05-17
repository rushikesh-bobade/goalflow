import { IconBulb, IconClipboardList, IconChartBar, IconAward } from '@tabler/icons-react';
import styles from './how-it-works.module.css';

const STEPS = [
  { icon: IconBulb, title: 'Plan', desc: 'Employees draft goals against strategic thrust areas with weightages.' },
  { icon: IconClipboardList, title: 'Approve', desc: 'Managers review, edit inline, approve, or send back for rework.' },
  { icon: IconChartBar, title: 'Track', desc: 'Quarterly check-ins capture actuals and auto-compute scores live.' },
  { icon: IconAward, title: 'Review', desc: 'Annual roll-up with QoQ trends, heatmaps, and effectiveness analytics.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Workflow</span>
          <h2 className={styles.heading}>From planning to performance review</h2>
        </div>
        <div className={styles.steps}>
          {STEPS.map((step, idx) => (
            <div key={step.title} className={styles.step}>
              <div className={styles.stepNum}>0{idx + 1}</div>
              <div className={styles.stepIcon}><step.icon size={24} stroke={1.8} /></div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {idx < STEPS.length - 1 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
