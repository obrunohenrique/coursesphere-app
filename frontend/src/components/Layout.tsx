import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, LogOut, GraduationCap, Menu, X } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('@CourseSphere:token');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Meus Cursos', icon: BookOpen, to: '/courses' }, // Ajuste para a rota real depois
    { label: 'Perfil', icon: User, to: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop - Agora com cores sólidas e visíveis */}
      <aside className="w-64 bg-[#111827] text-white hidden lg:flex flex-col fixed h-full z-30">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CourseSphere</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => (
            <Link 
              key={item.to} 
              to={item.to} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive(item.to) 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
          >
            <LogOut size={20} /> Sair da conta
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar - Fixa e com fundo sólido para não ser transparente */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111827] text-white px-6 flex justify-between items-center z-50 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <GraduationCap size={24} className="text-indigo-500" />
          <span className="font-bold text-lg">CourseSphere</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay - Full screen e sem transparência */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#111827] z-40 flex flex-col p-6 pt-24">
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-xl text-lg ${
                  isActive(item.to) ? 'bg-indigo-600 text-white' : 'text-gray-300'
                }`}
              >
                <item.icon size={24} /> {item.label}
              </Link>
            ))}
          </div>
          <button 
            onClick={handleLogout} 
            className="mt-auto flex items-center gap-4 p-4 text-red-400 border-t border-gray-800 text-lg"
          >
            <LogOut size={24} /> Sair
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:ml-64 w-full">
        {/* Header Desktop - Visível */}
        <header className="h-16 bg-white border-b border-gray-200 hidden lg:flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {navItems.find(i => isActive(i.to))?.label || 'Painel'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Bruno Henrique</span>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              B
            </div>
          </div>
        </header>
        
        {/* Padding superior no mobile para não ficar atrás da Top Bar */}
        <div className="p-6 md:p-10 pt-24 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;