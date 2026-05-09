import axios from 'axios';


const api = axios.create({
    // Se estiver rodando local fora do docker, use localhost. 
    // No futuro, ajustaremos para o nome do serviço no docker.
    baseURL: 'http://localhost:8000',
});

export default api;