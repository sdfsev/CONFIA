
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROFESSIONALS } from '../constants';
import ProCard from '../components/ProCard';

const HomeView: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${encodeURIComponent(category)}`);
  };

  return (
    <div className="pb-32 bg-slate-50 dark:bg-background-dark">
      <header className="relative bg-[#0A1F44] text-white pt-16 pb-16 px-6 rounded-b-[3.5rem] shadow-2xl overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
              <span className="material-icons-round text-white text-2xl">verified</span>
            </div>
            <span className="text-2xl font-black tracking-tighter">Confia</span>
          </div>
          <button 
            onClick={() => navigate('/notifications')}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
          >
            <span className="material-icons-outlined">notifications</span>
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0A1F44]"></span>
          </button>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-3 leading-[1.1] tracking-tight">
            Contrate quem é<br/><span className="text-primary italic">verificado.</span>
          </h1>
          <p className="text-blue-200/60 text-sm font-medium mb-10 max-w-[280px]">Profissionais de elite com garantia de segurança e qualidade.</p>

          <div 
            onClick={() => navigate('/search')}
            className="bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl p-2.5 flex items-center gap-2 group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <span className="material-icons-round text-slate-300 group-hover:text-primary transition-colors">search</span>
              <span className="text-slate-400 text-sm font-bold">O que você precisa hoje?</span>
            </div>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-icons-round text-white">tune</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-8 relative z-20 space-y-12">
        <section>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Limpeza', icon: 'cleaning_services', color: 'bg-blue-500' },
              { label: 'Elétrica', icon: 'bolt', color: 'bg-amber-500' },
              { label: 'Obras', icon: 'engineering', color: 'bg-orange-500' },
              { label: 'Jardim', icon: 'park', color: 'bg-green-500' }
            ].map((cat) => (
              <button 
                key={cat.label} 
                onClick={() => handleCategoryClick(cat.label)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-3xl bg-white dark:bg-surface-dark flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:shadow-primary/20 border border-slate-100 dark:border-white/5">
                  <span className="material-icons-outlined text-2xl">{cat.icon}</span>
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Profissionais Elite</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Ranking 1% Regional</p>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl"
            >
              Ver todos
            </button>
          </div>
          <div className="flex overflow-x-auto gap-5 -mx-6 px-6 no-scrollbar pb-6 snap-x">
            {MOCK_PROFESSIONALS.filter(p => p.trustLevel === 'ELITE').map((pro) => (
              <div key={pro.id} className="snap-center shrink-0 w-80">
                <ProCard pro={pro} />
              </div>
            ))}
          </div>
        </section>

        <section className="relative rounded-[2.5rem] bg-slate-900 dark:bg-white p-8 overflow-hidden shadow-2xl group cursor-pointer" onClick={() => navigate('/onboarding')}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
              <span className="material-icons-round text-white">rocket_launch</span>
            </div>
            <h3 className="text-2xl font-black text-white dark:text-slate-900 mb-2">Trabalhe com Segurança</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Mostre seus selos de verificação e conquiste os melhores clientes da sua região.</p>
            <button className="flex items-center gap-2 text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.2em] group">
              Começar Agora 
              <span className="material-icons-round text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </div>
          <span className="material-icons-round text-white/5 dark:text-slate-900/5 text-[180px] absolute right-[-40px] bottom-[-40px] pointer-events-none">workspace_premium</span>
        </section>
      </main>
    </div>
  );
};

export default HomeView;
