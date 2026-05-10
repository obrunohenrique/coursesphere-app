import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { X, Save, Video, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseId: string | undefined;
  lessonToEdit: any;
}

const NewLessonModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, courseId, lessonToEdit }) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // GATILHO DE SINCRONIZAÇÃO: Preenche o formulário ao abrir para editar
  useEffect(() => {
    if (isOpen) {
      if (lessonToEdit) {
        setTitle(lessonToEdit.title || '');
        setVideoUrl(lessonToEdit.video_url || '');
      } else {
        // Limpa os campos se for uma aula nova
        setTitle('');
        setVideoUrl('');
      }
    }
  }, [lessonToEdit, isOpen]);

  const handleSubmit = async (status: 'published' | 'draft') => {
    setLoading(true);
    const payload = { 
      title, 
      video_url: videoUrl, 
      status, 
      course_id: Number(courseId) 
    };
    
    try {
      if (lessonToEdit) {
        // Rota de edição da aula: PUT /lessons/{id}
        await api.put(`/lessons/${lessonToEdit.id}`, payload); 
      } else {
        // Rota de criação vinculada ao curso: POST /courses/{id}/lessons
        await api.post(`/courses/${courseId}/lessons`, payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert("Erro ao salvar aula.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Video size={24} /> {lessonToEdit ? 'Editar Aula' : 'Nova Aula'}
          </h3>
          <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Título da Aula</label>
            <input 
              required 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Aula 02 - Espaços Vetoriais" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">URL do Vídeo (Opcional)</label>
            <input 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)} 
              placeholder="https://youtube.com/..." 
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('draft')}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all disabled:opacity-50"
            >
              Salvar Rascunho
            </button>
            <button 
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('published')}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Publicar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLessonModal;