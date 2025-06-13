import React from 'react';
import styles from './AggregationSelector.module.css';

const AggregationSelector = ({ selectedAggregation, onAggregationChange }) => {
  const aggregationOptions = [
    { id: 'none', label: 'No Aggregation' },
    { id: 'sum', label: 'Sum (Total Visitors)' },
    { id: 'avg', label: 'Average Visitors' },
    { id: 'max', label: 'Maximum Visitors' },
    { id: 'min', label: 'Minimum Visitors' }
  ];

/*
const applyAggregation = (data) => {
  switch(aggregation) {
    case 'sum':
      return data.reduce((sum, item) => sum + item.visitors, 0);
    case 'avg':
      return data.reduce((sum, item) => sum + item.visitors, 0) / data.length;
    case 'max':
      return Math.max(...data.map(item => item.visitors));
    case 'min':
      return Math.min(...data.map(item => item.visitors));
    default:
      return data;
  }
};
*/

  return (
    <div className={styles.container}>
      <label className={styles.label}>Aggregation</label>
      <div className={styles.optionsContainer}>
        {aggregationOptions.map((option) => (
          <div key={option.id} className={styles.option}>
            <input
              type="radio"
              id={`agg-${option.id}`}
              name="aggregation"
              value={option.id}
              checked={selectedAggregation === option.id}
              onChange={() => onAggregationChange(option.id)}
              className={styles.radioInput}
            />
            <label htmlFor={`agg-${option.id}`} className={styles.radioLabel}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AggregationSelector;