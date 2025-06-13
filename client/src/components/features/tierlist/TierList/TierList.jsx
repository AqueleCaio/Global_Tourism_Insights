import styles from './TierList.module.css';

const TierList = ({ items, onRemoveItem }) => {
  return (
    <div className={styles.tierListContainer}>
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className={styles.tierListItem}>
            <span>{item.countryName}</span>
            <button 
              onClick={() => onRemoveItem(item.id)}
              className={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          <i className="fas fa-globe-americas" />
          <p>Add countries from the table to your wishlist</p>
        </div>
      )}
    </div>
  );
};

export default TierList;