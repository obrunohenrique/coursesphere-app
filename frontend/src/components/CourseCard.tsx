import React, { useEffect, useState } from 'react';
import { Clock, Star } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom'

interface CourseCardProps {
  course: {
    id: number;
    name: string; // Garanta que o nome da propriedade bate com o JSON do Backend
    duration: number;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [instructor, setInstructor] = useState<{name: string, photo: string} | null>(null);

  useEffect(() => {
    // Adicionamos um pequeno atraso aleatório ou um parâmetro único
    // para garantir que a API externa retorne pessoas diferentes
    const fetchInstructor = async () => {
      try {
        // Usamos o ID do curso como 'seed' para a API retornar sempre o mesmo instrutor 
        // para aquele curso específico, mas instrutores diferentes entre cursos.
        const response = await api.get(`/courses/suggest/instructor?seed=${course.id}`);
        setInstructor(response.data);
      } catch (error) {
        setInstructor({ name: "Instrutor Padrão", photo: "https://via.placeholder.com/150" });
      }
    };

    fetchInstructor();
  }, [course.id]);

  return (
    <Link to={`/course/${course.id}`} className="block group">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
      <div className="h-24 bg-indigo-600 p-6 flex justify-between items-start">
         <span className="px-3 py-1 bg-white/20 text-white text-[10px] uppercase font-bold rounded-full backdrop-blur-md">
           COURSESPHERE
         </span>
         <Star className="text-white/40 group-hover:text-yellow-400 transition-colors" size={20} />
      </div>
      
      <div className="p-6 -mt-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 mb-4 min-h-25 flex flex-col justify-center">
          {/* LOG DE DEPURAÇÃO: Se continuar 'Sem título', mude para course.name ou course.titulo */}
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {course.name || "Curso sem título"} 
          </h3>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1"><Clock size={14}/> {course.duration || 0}h</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          {instructor ? (
            <>
              <img src={instructor.photo} alt={instructor.name} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Especialista</p>
                <p className="text-sm font-semibold text-gray-700 truncate">{instructor.name}</p>
              </div>
            </>
          ) : (
            <div className="animate-pulse flex items-center gap-2 w-full">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}
        </div>
      </div>
    </div>
    </Link>
  );
};

export default CourseCard;