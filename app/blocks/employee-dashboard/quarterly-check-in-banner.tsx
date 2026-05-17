import { Link } from 'react-router';
import { IconAlertCircle, IconArrowRight } from '@tabler/icons-react';
import styles from './quarterly-check-in-banner.module.css';

interface Props {
  quarter: string;
  closeDate: string;
}

export function QuarterlyCheckInBanner({ quarter, closeDate }: Props) {
  const formattedDate = new Date(closeDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  return (
    <div className={styles.banner}>
      <IconAlertCircle size={20} className={styles.icon} />
      <div className={styles.text}>
        <strong>{quarter.toUpperCase()} check-in window is open!</strong>
        <span>Submit your actual achievements before {formattedDate}</span>
      </div>
      <Link to="/employee/checkin" className={styles.cta}>
        Start check-in <IconArrowRight size={14} />
      </Link>
    </div>
  );
}
