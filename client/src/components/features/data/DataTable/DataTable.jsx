import styles from './DataTable.module.css';

// Recebe os dados (data) do HomePage
const DataTable = ({ data }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Country</th>
            <th>Year</th>
            <th>Visitors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={`${item.countryId}-${item.year}`}>
                <td>{item.countryName}</td>
                <td>{item.year}</td>
                <td>{typeof item.value === 'number' ? item.value.toLocaleString() : 'N/A'}</td>
                <td>
                  <button className={styles.actionButton}>
                    Add to Wishlist
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noData}>
                No data available. Please generate a report.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;