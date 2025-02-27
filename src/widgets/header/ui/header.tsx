import { Link } from 'react-router-dom';
import styles from './header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.link}>
        Dashboard
      </Link>
    </header>
  );
}