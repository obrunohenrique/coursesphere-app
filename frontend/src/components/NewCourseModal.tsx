import React, { useState, useEffect } from 'react';
import { X, Save, Clock, BookText, Loader2, Calendar } from 'lucide-react';
import api from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseToEdit?: any; 
}

const CourseModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, courseToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(40);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setName(courseToEdit.name || courseToEdit.title || '');
        setDescription(courseToEdit.description || '');
        setDuration(courseToEdit.duration || 40);
        setStartDate(courseToEdit.start_date || '');
        setEndDate(courseToEdit.end_date || '');
      } else {
        setName('');
        setDescription('');
        setDuration(40);
        setStartDate('');
        setEndDate('');
      }
    }
  }, [courseToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      name, 
      description, 
      duration: Number(duration),
      start_date: startDate,
      end_date: endDate 
    };

    try {
      if (courseToEdit) {
        await api.put(`/courses/${courseToEdit.id}`, payload);
      } else {
        await api.post('/courses/', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert("Erro ao salvar curso. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#111827] p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">{courseToEdit ? 'Editar Curso' : 'Novo Curso'}</h3>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <BookText size={14} /> Nome do Curso
            </label>
            <input 
              required 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} /> Duração (h)
              </label>
              <input 
                type="number" 
                required 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))} 
              />
            </div>

            {/* CAMPOS DE DATA REINSERIDOS AQUI */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Início
              </label>
              <input 
                type="date" 
                required 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} /> Data de Término
            </label>
            <input 
              type="date" 
              required 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</label>
            <textarea 
              required 
              rows={3} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {courseToEdit ? 'Salvar Alterações' : 'Criar Curso'}</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;