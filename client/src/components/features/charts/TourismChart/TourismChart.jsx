import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import styles from './TourismChart.module.css';

const TourismChart = ({ data, chartType = 'line' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels: data.labels,
          datasets: data.datasets.map(dataset => ({
          label: dataset.label,
          data: dataset.data,
          borderColor: dataset.borderColor,
          backgroundColor: dataset.backgroundColor,
          borderWidth: 2,
          fill: chartType === 'line'
        }))

        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Tourism Data Visualization'
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, chartType]);

  return (
    <div className={styles.chartContainer}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default TourismChart;