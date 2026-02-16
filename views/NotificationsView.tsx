
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../constants';

const NotificationsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark pb-28">
      <header className="px-6 pt-14 pb-6 bg-white dark:bg-background-dark sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black">Notificações</h1>
          <button className="text-xs font-bold text-primary">Ler tudo</button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {['Todas', 'Avaliações', 'Sistema', 'Pagamentos'].map((tab, idx) => (
            <button 
              key={tab}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${
                idx === 0 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-slate-100 dark:bg-surface-dark text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Hoje</h2>
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.map(n => (
              <div 
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  n.unread 
                  ? 'bg-primary/5 border-primary/10' 
                  : 'bg-white dark:bg-surface-dark border-transparent shadow-sm'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    n.type === 'review' ? 'bg-yellow-50 text-yellow-500' :
                    n.type === 'verification' ? 'bg-red-50 text-red-500' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-icons-round">
                      {n.type === 'review' ? 'star' : n.type === 'verification' ? 'error_outline' : 'info_outline'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold">{n.title}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.content}</p>
                    {n.type === 'verification' && (
                      <button className="mt-3 text-[10px] font-black text-red-500 flex items-center gap-1 uppercase tracking-wider">
                        Resolver agora <span className="material-icons-round text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsView;
