import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, PlayCircle, ArrowLeft, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import api from '../services/api';
import NewLessonModal from '../components/NewLessonModal';

const CourseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // Estados de visibilidade (Acordeão)
  const [showPublished, setShowPublished] = useState(true);
  const [showDrafts, setShowDrafts] = useState(true);

  // Funções de busca
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      setLessons(response.data.lessons || []); 
    } catch (error) {
      console.error("Erro ao carregar detalhes", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshLessons = async () => {
    const response = await api.get(`/courses/${id}`);
    setCourse(response.data);
    setLessons(response.data.lessons || []);
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Filtros de aulas
  const publishedLessons = Array.isArray(lessons) ? lessons.filter(l => l.status === 'published') : [];
  const draftLessons = Array.isArray(lessons) ? lessons.filter(l => l.status === 'draft') : [];

  // Funções de Modal
  const handleOpenNewLesson = () => {
    setSelectedLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Carregando curso...</div>;
  if (!course) return <div className="p-10 text-center">Curso não encontrado.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Barra Superior */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Voltar ao Dashboard
        </button>
        
        <button 
          onClick={handleOpenNewLesson}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} /> Nova Aula
        </button>
      </div>

      {/* Hero do Curso */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{course.name || course.title}</h1>
          <p className="text-gray-600 leading-relaxed text-lg max-w-3xl">{course.description}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
              <Clock size={16} /> {course.duration}h totais
            </span>
            <span className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100">
              <Calendar size={16} /> Início: {course.start_date || 'N/A'}
            </span>
            <span className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100">
              <Calendar size={16} /> Término: {course.end_date || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Aulas Publicadas */}
      <section className="space-y-4">
        <button 
          onClick={() => setShowPublished(!showPublished)}
          className="w-full flex justify-between items-center bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PlayCircle className="text-green-500" /> Aulas Publicadas ({publishedLessons.length})
          </h3>
          {showPublished ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </button>
        
        {showPublished && (
          <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {publishedLessons.length > 0 ? (
              publishedLessons.map((lesson, idx) => (
                <div key={lesson.id} className="p-5 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-800">{idx + 1}. {lesson.title}</span>
                    {lesson.video_url && (
                      <a 
                        href={lesson.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
                      >
                        Assistir aula externa <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md tracking-wider">ATIVA</span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-gray-400 italic bg-white rounded-2xl border border-dashed border-gray-200">Nenhuma aula ativa.</p>
            )}
          </div>
        )}
      </section>

      {/* Rascunhos */}
      <section className="space-y-4">
        <button 
          onClick={() => setShowDrafts(!showDrafts)}
          className="w-full flex justify-between items-center bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-500 flex items-center gap-2">
            <FileText size={22} /> Rascunhos ({draftLessons.length})
          </h3>
          {showDrafts ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </button>
        
        {showDrafts && (
          <div className="grid gap-3 border-l-4 border-gray-100 ml-2 pl-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {draftLessons.length > 0 ? (
              draftLessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  onClick={() => handleEditLesson(lesson)}
                  className="p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl flex justify-between items-center italic cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                >
                  <span className="text-gray-500 font-medium group-hover:text-indigo-700">{lesson.title}</span>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-1 rounded uppercase">Draft</span>
                </div>
              ))
            ) : (
              <p className="py-2 text-gray-400 text-sm">Não há rascunhos pendentes.</p>
            )}
          </div>
        )}
      </section>

      <NewLessonModal 
        isOpen={isLessonModalOpen} 
        onClose={() => setIsLessonModalOpen(false)} 
        onSuccess={refreshLessons} 
        courseId={id}
        lessonToEdit={selectedLesson}
      />
    </div>
  );
};

export default CourseDetails;