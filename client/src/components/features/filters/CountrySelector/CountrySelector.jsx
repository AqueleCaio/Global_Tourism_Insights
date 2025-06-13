import { useState } from 'react';
import styles from './CountrySelector.module.css';
import Button from '../../../common/Button/Button';

const CountrySelector = ({ countries = [], onAddCountry = () => {} }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);

  const handleAddCountry = () => {
    if (selectedCountry && !selectedCountries.includes(selectedCountry)) {
      const newCountries = [...selectedCountries, selectedCountry];
      setSelectedCountries(newCountries);
      onAddCountry(newCountries);
      setSelectedCountry('');
    }
  };

  const handleRemoveCountry = (countryIdToRemove) => {
    const updatedCountries = selectedCountries.filter(id => id !== countryIdToRemove);
    setSelectedCountries(updatedCountries);
    onAddCountry(updatedCountries);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Select Countries/Regions</label>
      <div className={styles.selectorContainer}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className={styles.select}
        >
          <option value="" disabled>Select a country...</option>
          {countries?.map(country => (
            <option key={country?.id} value={country?.id}>
              {country?.name}
            </option>
          ))}
        </select>
        <Button 
          onClick={handleAddCountry} 
          className={styles.addButton}
          disabled={!selectedCountry}
        >
          Add
        </Button>
      </div>

      <div className={styles.selectedCountries}>
        {selectedCountries.map(countryId => {
          const country = countries?.find(c => c?.id === countryId);
          return country ? (
            <span key={countryId} className={styles.countryTag}>
              {country.name}
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveCountry(countryId)}
              >
                &times;
              </button>
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default CountrySelector;
