import api from './api';

const TourismService = {
// Pega a requisição de filtro dos dados de turismo e joga pra o back-end
getTourismData: async ({ countryIds, startYear, endYear, aggregation }) => {
  try {
    // Converte a string de IDs (ex: "AL,BR") em array (ex: ["AL", "BR"])
    const idsArray = countryIds ? countryIds.split(',') : [];

    if (idsArray.length === 0) {
      throw new Error('Nenhum país selecionado');
    }

    const responses = await Promise.all(
      idsArray.map(async (id) => {
        const response = await api.get(`/tourism`, {
          params: {
            countryIds: id,
            startYear,
            endYear,
            aggregation
          }
        });
        
        return response;
      })
    );
    
    return responses.flat();
  } catch (error) {
    console.error('Erro ao buscar dados de turismo:', error);
    throw error;
  }
},

  /**
   * Busca a lista de países disponíveis
   * @returns {Promise} Lista de países
   */
  getCountries: async () => {
    try {
      const response = await api.get('/countries');
      return response;
    } catch (error) {
      console.error('Erro ao buscar países:', error);
      throw error;
    }
  },
};

export default TourismService;