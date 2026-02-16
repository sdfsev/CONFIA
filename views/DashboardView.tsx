
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Prevent non-logged users
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const firstName = user.name?.split(' ')[0] || 'Profissional';

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Header Section */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                alt="Profile Picture"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                src={user.avatar || `https://ui-avatars.com/api/?name=${firstName}&background=f4c025&color=fff`}
              />
              <div className="absolute -bottom-1 -right-1 bg-primary w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-background-dark">
                <span className="material-icons-round text-white text-[12px]">verified</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">{user.name || 'Bem-vindo'}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                Plano Grátis
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm"
          >
            <span className="material-icons-round text-slate-400">notifications</span>
          </button>
        </div>

        {/* Profile Completion */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Perfil 85% completo</span>
            <span
              onClick={() => navigate(`/profile/${user.uid}`)}
              className="text-xs font-bold text-primary cursor-pointer"
            >
              Finalizar
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[85%] rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="px-6 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center">
          <span className="material-icons-round text-primary/40 mb-1">visibility</span>
          <span className="text-lg font-bold leading-none">320</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 mt-1 tracking-tight leading-tight">Vistas</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center">
          <span className="material-icons-round text-primary/40 mb-1">chat</span>
          <span className="text-lg font-bold leading-none">45</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 mt-1 tracking-tight leading-tight">Contatos</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm text-center">
          <span className="material-icons-round text-yellow-400 mb-1">star</span>
          <span className="text-lg font-bold leading-none">4.9</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 mt-1 tracking-tight leading-tight">Avaliações</span>
        </div>
      </section>

      {/* Premium Banner */}
      <section className="px-6 mb-8">
        <div className="bg-primary rounded-lg p-6 relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <h3 className="text-white text-xl font-extrabold leading-tight mb-2">Seja Destaque e receba pedidos 30 min antes</h3>
            <p className="text-white/80 text-sm mb-4">Aumente sua visibilidade e feche mais serviços diariamente.</p>
            <button
              onClick={() => navigate('/plans')}
              className="bg-white text-primary px-6 py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform"
            >
              Assinar Premium R$ 14,90
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>
      </section>

      {/* Main Actions */}
      <section className="px-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate(`/profile/${user.uid}`)}
          className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm flex flex-col items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <span className="material-icons-round text-slate-600 dark:text-slate-300">person_outline</span>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm leading-tight">Editar Perfil</span>
            <span className="block text-xs text-slate-400 mt-1">Dados básicos</span>
          </div>
        </button>

        <button
          className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm flex flex-col items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => navigate('/search')}
        >
          {/* Using Search here as requested "Pesquisar também" */}
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <span className="material-icons-round text-slate-600 dark:text-slate-300">search</span>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm leading-tight">Buscar</span>
            <span className="block text-xs text-slate-400 mt-1">Outros profissionais</span>
          </div>
        </button>

        <button
          onClick={() => navigate(`/profile/${user.uid}/reviews`)} // Assuming a reviews route or just profile
          className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm flex flex-col items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <span className="material-icons-round text-slate-600 dark:text-slate-300">rate_review</span>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm leading-tight">Ver Reviews</span>
            <span className="block text-xs text-slate-400 mt-1">O que dizem de você</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/support')}
          className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm flex flex-col items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-icons-round text-primary">volunteer_activism</span>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm leading-tight">Apoiar SIXFIX</span>
            <span className="block text-xs text-slate-400 mt-1">Contribuição PIX</span>
          </div>
        </button>
      </section>
    </div>
  );
};

export default DashboardView;
