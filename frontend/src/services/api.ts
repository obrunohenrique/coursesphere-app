import axios from 'axios';


const api = axios.create({
    // Se estiver rodando local fora do docker, use localhost. 
    // No futuro, ajustaremos para o nome do serviço no docker.
    baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CourseSphere:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
    }, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response, // Se a resposta for sucesso, não faz nada
  (error) => {
    // Se o erro for 401 (Não autorizado), o token provavelmente expirou
    if (error.response && error.response.status === 401) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      
      // Limpa o token para não tentar usar um token inválido de novo
      localStorage.removeItem('@CourseSphere:token');
      
      // Redireciona para a raiz (Login)
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;