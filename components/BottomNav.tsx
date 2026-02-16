import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Início', icon: 'home', path: '/home' },
    { label: 'Buscar', icon: 'search', path: '/search' },
    { label: 'Pedidos', icon: 'receipt_long', path: '/dashboard' },
    { label: 'Perfil', icon: 'person', path: '/profile' }
  ];

  const isPathActive = (path: string) => {
    return location.pathname === path || (path !== '/home' && location.pathname.startsWith(path));
  };

  return (
    <nav className="sticky bottom-0 bg-white dark:bg-navy-light border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-6">
      <div className="flex items-center justify-between pb-3 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 group transition-colors ${
              isPathActive(item.path)
                ? 'text-navy dark:text-primary'
                : 'text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined group-hover:-translate-y-0.5 transition-transform"
              style={{fontVariationSettings: isPathActive(item.path) ? "'FILL' 1" : "'FILL' 0"}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

