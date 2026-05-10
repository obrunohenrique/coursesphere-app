import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica de segurança (Requisito do Edital)
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Ajuste a rota conforme seu backend (ex: /auth/signup ou /users/)
      await api.post('/users/', { 
        name: name, 
        email: email, 
        password: password
      });

      // Após registrar, redirecionamos para o login (Requisito do Edital)
      alert("Conta criada com sucesso! Agora faça seu login.");
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar conta. Tente outro e-mail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200">
            <GraduationCap size={40} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Junte-se ao CourseSphere e comece a ensinar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSignup}>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm rounded-r-lg animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-indigo-500" /> Nome Completo
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Bruno Henrique"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" /> E-mail
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="bruno@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock size={16} className="text-indigo-500" /> Senha (mín. 6 caracteres)
              </label>
              <input
                required
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Criar Conta <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Já tem uma conta?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;