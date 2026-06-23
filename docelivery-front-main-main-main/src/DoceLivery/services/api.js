import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, 
  headers: {
    'Content-Type': 'application/json', // Mantém o padrão para o resto do sistema
  },
});

// --- Interceptor de Requisição ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }

  // CORREÇÃO AQUI: Se os dados da requisição forem um FormData (envio de arquivo/produto)
  // nós deletamos o Content-Type fixo para o Axios gerar o multipart/form-data correto.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Interceptor de Resposta ---
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!error.config.url.includes('/auth/login')) {
        console.warn(`Acesso negado (${error.response.status}). Verifique suas permissões ou refaça o login.`);
        localStorage.clear();
        window.location.href = '/docelivery/cliente/login-cliente'; 
      }
    }
    console.error('Erro na API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;