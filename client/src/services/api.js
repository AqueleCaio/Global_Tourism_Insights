import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajuste para sua URL de API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para tratamento global de erros
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data.message || 'Erro na requisição',
        status: error.response.status,
      });
    } else if (error.request) {
      return Promise.reject({ message: 'Sem resposta do servidor' });
    } else {
      return Promise.reject({ message: 'Erro ao configurar requisição' });
    }
  }
);

export default api;