import { useState, useEffect } from 'react';
import api from '../services/api';

export interface Course {
  id: number;
  name: string;
  description: string;
  duration: number;
  creator_id: any;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/');
      setCourses(response.data);
    } catch (err: any) {
      setError('Não foi possível carregar os cursos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, error, refresh: fetchCourses };
};