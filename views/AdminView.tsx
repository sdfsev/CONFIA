
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminView: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { 
      id: '99231', 
      name: 'Ana Souza', 
      category: 'Eletricista Residencial', 
      avatar: 'https://picsum.photos/200?random=10', 
      status: 'Sinalizado', 
      reason: 'Denúncias de atraso recorrente.',
      type: 'PRO'
    },
    { 
      id: '99232', 
      name: 'Roberto Silva', 
      category: 'Consultor Financeiro', 
      avatar: 'https://picsum.photos/200?random=11', 
      status: 'Pendente', 
      reason: 'Novo cadastro aguardando verificação de RG.',
      type: 'ELITE'
    }
  ]);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setItems(prev => prev.filter(item => item.id !== id));
    // In a real app, toast or feedback would go here
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark pb-20">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Moderação</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fila de Revisão Prioritária</p>
          </div>
          <button onClick={() => navigate('/')} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-surface-dark flex items-center justify-center">
            <span className="material-icons-round">home</span>
          </button>
        </div>
        
        <div className="relative group">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Filtrar por ID ou profissional..." 
            className="w-full bg-slate-100 dark:bg-surface-dark border-none rounded-2xl py-4 pl-12 text-sm font-bold shadow-inner focus:ring-primary transition-all"
          />
        </div>
      </header>

      <main className="p-6 space-y-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pendentes', val: items.length, color: 'text-amber-500' },
            { label: 'Denúncias', val: items.filter(i => i.status === 'Sinalizado').length, color: 'text-red-500' },
            { label: 'Meta Diária', val: '85%', color: 'text-primary' }
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-surface-dark p-5 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prioridade de Revisão</h2>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">LIVE FEED</span>
          </div>

          {items.length > 0 ? items.map((item) => (
            <article key={item.id} className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden animate-fade-in">
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="relative shrink-0">
                    <img src={item.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt={item.name} />
                    <span className={`absolute -bottom-1 -right-1 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-md ${item.type === 'ELITE' ? 'bg-gold text-slate-900' : 'bg-slate-900'}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-lg truncate">{item.name}</h3>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${item.status === 'Sinalizado' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                    <p className="text-[10px] text-slate-400 mt-2">ID: #{item.id}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-round text-sm text-slate-400">info</span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contexto</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {item.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleAction(item.id, 'reject')}
                    className="py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Rejeitar
                  </button>
                  <button 
                    onClick={() => handleAction(item.id, 'approve')}
                    className="py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
                  >
                    Aprovar Profissional
                  </button>
                </div>
              </div>
            </article>
          )) : (
            <div className="bg-green-500/10 rounded-[2.5rem] p-10 text-center border-2 border-dashed border-green-500/20">
              <span className="material-icons-round text-4xl text-green-500 mb-4">check_circle</span>
              <h3 className="text-lg font-black text-green-600 mb-1">Tudo em dia!</h3>
              <p className="text-sm text-green-500/60 font-bold">Nenhum profissional aguardando revisão no momento.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminView;
