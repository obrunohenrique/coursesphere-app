import { useState } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
  setLoading(true);
  setError(null);
  try {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/users/login', formData);
    
    // Verifique se o nome da propriedade é exatamente access_token
    const { access_token } = response.data; 

    if (access_token) {
      localStorage.setItem('@CourseSphere:token', access_token);

      if (response.data.user && response.data.user.id) {
    localStorage.setItem('@CourseSphere:user_id', String(response.data.user.id));
  }
      
      api.defaults.headers.Authorization = `Bearer ${access_token}`;
      return true;
    }
    
    return false;
  } catch (err: any) {
    // Debug: Veja o erro real no console do navegador (F12)
    console.error("Erro no Login:", err.response?.data || err.message);
    
    // Se o backend retornou 200 mas caiu aqui, o erro é na lógica acima!
    setError(err.response?.data?.detail || 'Erro ao processar login');
    return false;
  } finally {
    setLoading(false);
  }
};

  return { login, loading, error };
};