import React from 'react';
import styles from './ChartTypeSelector.module.css';

const ChartTypeSelector = ({ value, onChange }) => {
  const chartTypes = [
    { id: 'line', label: 'Line', icon: 'chart-line' },
    { id: 'bar', label: 'Bar', icon: 'chart-bar' }
  ];

  return (
    <div className={styles.container}>
      <label className={styles.label}>Chart Type</label>
      <div className={styles.buttonsContainer}>
        {chartTypes.map((type) => (
          <button
            key={type.id}
            className={`${styles.button} ${
              value === type.id ? styles.buttonActive : styles.buttonInactive
            }`}
            onClick={() => onChange(type.id)}
          >
            <i className={`fas fa-${type.icon}`} />
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartTypeSelector;