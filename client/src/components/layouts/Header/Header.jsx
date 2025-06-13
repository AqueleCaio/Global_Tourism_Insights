import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Global Tourism Insights</h1>
      <p className={styles.subtitle}>Explore international tourism trends and plan your next adventure</p>
    </header>
  );
};

export default Header;