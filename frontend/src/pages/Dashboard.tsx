import React from 'react';
import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';
import { Plus } from 'lucide-react';
import { useState } from 'react'
import NewCourseModal from '../components/NewCourseModal';

const Dashboard: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { courses, loading, error, refresh } = useCourses();
    
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium text-gray-500">Carregando seus cursos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Seus Cursos</h2>
          <p className="text-gray-500 mt-1">Gerencie seu catálogo de aprendizado e especialistas</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
            >
            <Plus size={20} /> 
            <span className="font-semibold">Novo Curso</span>
        </button>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}

        {courses.length === 0 && !error && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-4xl bg-white/50">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <Plus size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">Nenhum curso por aqui</h3>
            <p className="text-gray-400 max-w-xs mx-auto mt-2">
              Sua lista está vazia. Comece criando um novo curso para seu catálogo.
            </p>
          </div>
        )}
      </div>

        <NewCourseModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={refresh} 
        />

    </div>
  );
};

export default Dashboard;