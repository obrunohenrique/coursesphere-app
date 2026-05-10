import React from 'react';
import { useCourses } from '../hooks/useCourses';
import { Edit2, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useState } from 'react';
import CourseModal from '../components/NewCourseModal';

const MyCourses: React.FC = () => {
  const { courses, loading, refresh } = useCourses();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const handleEdit = (course: any) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedCourse(null); // Garante que o modal venha vazio
        setIsModalOpen(true);
    };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        await api.delete(`/courses/${id}`);
        refresh(); // Atualiza a lista após deletar
      } catch (err) {
        alert("Erro ao excluir o curso.");
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Carregando gerenciador...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Cursos</h2>
          <p className="text-gray-500">Edite informações ou remova cursos do catálogo</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Curso</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Duração</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Período</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{course.name || (course as any).title}</div>
                    <div className="text-xs text-gray-400 truncate max-w-50">{course.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock size={14} className="text-indigo-500" /> {course.duration}h
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {(course as any).start_date || 'N/A'}
                      </span>
                      <span className="text-gray-300 ml-4">até</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {(course as any).end_date || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                            onClick={() => handleEdit(course)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                            <Edit2 size={18} />
                        </button>
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {courses.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-3">
              <AlertCircle size={40} className="text-gray-200" />
              <p className="text-gray-400">Nenhum curso para gerenciar no momento.</p>
            </div>
          )}
        </div>
      </div>

          <CourseModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={refresh}
            courseToEdit={selectedCourse} 
            />

    </div>
  );
};

export default MyCourses;