import styles from './YearRange.module.css';

const YearRange = ({ value, onChange }) => {
  const handleStartYearChange = (e) => {
    onChange({
      ...value,
      start: parseInt(e.target.value) || 2018
    });
  };

  const handleEndYearChange = (e) => {
    onChange({
      ...value,
      end: parseInt(e.target.value) || 2023
    });
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Year Range</label>
      <div className={styles.rangeContainer}>
        <input
          type="number"
          className={styles.input}
          min="1995"
          max="2020"
          value={value.start}
          onChange={handleStartYearChange}
        />
        <span className={styles.separator}>to</span>
        <input
          type="number"
          className={styles.input}
          min="1995"
          max="2020"
          value={value.end}
          onChange={handleEndYearChange}
        />
      </div>
    </div>
  );
};

export default YearRange;