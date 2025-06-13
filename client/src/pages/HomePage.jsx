import React, { useState, useEffect } from 'react';
import  services  from '../services/index';

import Header from '../components/layouts/Header/Header';
import CountrySelector from '../components/features/filters/CountrySelector/CountrySelector';
import YearRange from '../components/features/filters/YearRange/YearRange';
import AggregationSelector from '../components/features/filters/AggregationSelector/AggregationSelector';
import ChartTypeSelector from '../components/features/filters/ChartTypeSelector/ChartTypeSelector';
import TourismChart from '../components/features/charts/TourismChart/TourismChart';
import DataTable from '../components/features/data/DataTable/DataTable';
import Button from '../components/common/Button/Button';
import styles from './HomePage.module.css';

const HomePage = () => {
  // Estados do componente
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [yearRange, setYearRange] = useState({ start: 2018, end: 2020 });
  const [aggregation, setAggregation] = useState('none');
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Busca países do back-end ao carregar o componente
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setError(null);
        const response = await services.getCountries();
        setCountries(response);
      } catch (error) {
        console.error('Erro ao buscar países:', error);
        setError('Falha ao carregar a lista de países. Tente recarregar a página.');
      }
    };

    fetchCountries();
  }, []);

const handleGenerateReport = async () => {
  if (selectedCountries.length === 0) return;

  setLoading(true);
  setError(null);

  // isso aqui é uma questão ainda
  try {

    const countryIds = selectedCountries.length > 0 ? selectedCountries.join(',') : undefined;
    const { start, end } = yearRange;

    const response = await services.getTourismData({
      countryIds,
      startYear: start,
      endYear: end,
      aggregation
    });

    const data = response;

    let formattedData;

    if (aggregation !== 'none') {
      // Gráfico com agregação: eixo X = país, Y = valor agregado
      formattedData = {
        labels: data.map(d => d.countryName),
        datasets: [
          {
            label: `Aggregation: ${aggregation}`,
            data: data.map(d => d.value),
            backgroundColor: data.map(() =>
              `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}80`
            ),
            borderColor: data.map(() =>
              `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
            ),
            borderWidth: 2
          }
        ]
      };
    } else {
      // Gráfico normal: eixo X = ano, Y = valor por país
      const years = [...new Set(data.map(item => item.year))].sort((a, b) => a - b);
      formattedData = {
        labels: years,
        datasets: selectedCountries.map(countryId => {
          const country = countries.find(c => c.id === countryId);
          const countryData = data.filter(item => item.countryId === countryId);
          const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

          return {
            label: country?.name || `País ${countryId}`,
            data: years.map(year => {
              const entry = countryData.find(item => item.year === year);
              return entry ? entry.value : 0;
            }),
            borderColor: color,
            backgroundColor: `${color}40`,
            borderWidth: 2
          };
        })
      };
    }
    
    setChartData(formattedData);  // Dados formatados para gráfico
    setTableData(data);           // Dados brutos para a tabela
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    setError('Falha ao gerar o relatório. Verifique os filtros e tente novamente.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      <Header />
      
      {/* Mensagem de erro */}
      {error && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <div className={styles.grid}>
        {/* Seção de Filtros */}
        <div className={styles.filters}>
          <h2 className={styles.sectionTitle}>Filters</h2>
          
          <CountrySelector 
            countries={countries} 
            selectedCountries={selectedCountries}
            onAddCountry={setSelectedCountries}
          />
          
          <YearRange 
            value={yearRange}
            onChange={setYearRange}
          />
          
          <AggregationSelector 
            selectedAggregation={aggregation}
            onAggregationChange={setAggregation}
          />
          
          <ChartTypeSelector 
            value={chartType}
            onChange={setChartType}
          />
          
          <Button 
            onClick={handleGenerateReport}
            disabled={loading || selectedCountries.length === 0}
            className={`${styles.generateButton} ${styles.green}`}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              <>
                <i className="fas fa-chart-pie"></i> Generate Report
              </>
            )}
          </Button>
        </div>
        
        {/* Conteúdo Principal */}
        <div className={styles.mainContent}>
          {/* Seção do Gráfico */}
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>International Tourism Arrivals</h2>
              {chartData && (
                <div className={styles.chartControls}>
                  <button className={styles.controlButton}>
                    <i className="fas fa-download"></i>
                  </button>
                  <button className={styles.controlButton}>
                    <i className="fas fa-expand"></i>
                  </button>
                </div>
              )}
            </div>
            <TourismChart 
              data={chartData} 
              chartType={chartType}
            />
          </div>
          
          {/* Seção da Tabela */}
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Tourism Data Table</h2>
              {tableData.length > 0 && (
                <button className={styles.exportButton}>
                  <i className="fas fa-file-export"></i> Export
                </button>
              )}
            </div>
            <DataTable 
              data={tableData}
              onAddToWishlist={(countryId) => {
                const country = countries.find(c => c.id === countryId);
                if (country) {
                  // Lógica para adicionar à lista de desejos
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;