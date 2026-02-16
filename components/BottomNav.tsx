
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const navItemsLeft = [
    { label: 'Início', icon: 'home', path: '/' },
    { label: 'Avisos', icon: 'notifications', path: '/notifications' },
  ];

  const navItemsRight = [
    { label: 'Planos', icon: 'workspace_premium', path: '/plans' },
    { label: 'Painel', icon: 'person', path: '/dashboard' }
  ];

  const isPathActive = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Explicitly typing as React.FC to allow React's special 'key' prop in the JSX elements
  const NavButton: React.FC<{ item: any }> = ({ item }) => {
    const active = isPathActive(item.path);
    return (
      <button
        onClick={() => navigate(item.path)}
        className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${
          active ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        <span className={`material-icons-round text-[22px] ${active ? '' : 'material-icons-outlined'}`}>
          {item.icon}
        </span>
        <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 w-full z-50 px-4 pb-4">
      <nav className="max-w-md mx-auto relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] h-20 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] flex items-center justify-between px-2">
        
        {/* Lado Esquerdo */}
        <div className="flex flex-1 justify-around">
          {navItemsLeft.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </div>

        {/* Centro - Botão de Busca Elevado */}
        <div className="relative -mt-12 group">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-125 group-hover:scale-150 transition-transform duration-500"></div>
          <button
            onClick={() => navigate('/search')}
            className={`relative w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-300 active:scale-90 shadow-2xl ${
              isPathActive('/search')
                ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-primary/40'
                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-200 border border-slate-100 dark:border-white/5'
            }`}
          >
            <span className="material-icons-round text-3xl">search</span>
          </button>
          <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            isPathActive('/search') ? 'text-primary opacity-100' : 'text-slate-400 opacity-60'
          }`}>
            Busca
          </span>
        </div>

        {/* Lado Direito */}
        <div className="flex flex-1 justify-around">
          {navItemsRight.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </div>

        {/* Menu de Usuário */}
        <div className="absolute -top-20 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl hidden group-hover:block p-2 z-50"
          style={{ display: showMenu ? 'block' : 'none' }}>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="material-icons-round text-sm">logout</span>
            Sair
          </button>
        </div>
      </nav>

      {/* Botão flutuante de Menu (alternativa ao hover em mobile) */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="fixed bottom-24 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all"
      >
        <span className="material-icons-round">more_vert</span>
      </button>

      {showMenu && (
        <div className="fixed bottom-40 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-2 z-50">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-icons-round text-sm">logout</span>
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default BottomNav;
