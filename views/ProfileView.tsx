
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROFESSIONALS } from '../constants';

const ProfileView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pro = MOCK_PROFESSIONALS.find(p => p.id === id) || MOCK_PROFESSIONALS[0];

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá ${pro.name}, vi seu perfil no Confia e gostaria de um orçamento.`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+5511999999999';
  };

  return (
    <div className="pb-32 bg-slate-50 dark:bg-background-dark min-h-screen">
      <div className="relative h-[480px] w-full">
        <img src={pro.avatar} alt={pro.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
        
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-20">
          <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-black/30 backdrop-blur-xl flex items-center justify-center text-white border border-white/20">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-2xl bg-black/30 backdrop-blur-xl flex items-center justify-center text-white border border-white/20">
              <span className="material-icons-round">favorite_border</span>
            </button>
            <button className="w-12 h-12 rounded-2xl bg-black/30 backdrop-blur-xl flex items-center justify-center text-white border border-white/20">
              <span className="material-icons-round">share</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-8 right-8">
          <div className="inline-flex items-center gap-2 bg-gold/30 backdrop-blur-xl border border-gold/40 text-gold px-4 py-2 rounded-2xl mb-4">
            <span className="material-icons-round text-[16px]">military_tech</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{pro.trustLevel} PROFESSIONAL</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{pro.name}</h1>
          <p className="text-slate-300 text-xl font-medium mb-6 uppercase tracking-widest">{pro.category}</p>
          <div className="flex flex-wrap items-center gap-6 text-[10px] text-slate-300 font-black uppercase tracking-widest">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-icons-round text-sm">verified</span>
              <span>ID VERIFICADO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons-round text-sm">location_on</span>
              <span>{pro.location}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-8 -mt-6 space-y-12 relative z-10">
        <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 grid grid-cols-3 gap-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <p className="text-3xl font-black text-slate-900 dark:text-white">{pro.trustScore || 98}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Trust Score</p>
          </div>
          <div className="flex flex-col items-center text-center border-x border-slate-100 dark:border-white/10">
            <p className="text-3xl font-black text-slate-900 dark:text-white">&lt;{pro.responseTime}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Resposta</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-3xl font-black text-green-500">{pro.recommendationRate || 99}%</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Aprovado</p>
          </div>
        </div>

        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Biografia Profissional</h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-[1.8] font-medium">
            {pro.about || 'Profissional dedicada com foco em excelência e satisfação do cliente. Especialista certificada pela plataforma Confia com histórico impecável de atendimento.'}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {pro.tags?.map(t => (
              <span key={t} className="px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Galeria de Trabalhos</h2>
            <button className="text-[10px] font-black text-primary uppercase">Ver Álbum</button>
          </div>
          <div className="flex gap-5 overflow-x-auto no-scrollbar -mx-8 px-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="shrink-0 w-48 h-64 rounded-[2.5rem] overflow-hidden bg-slate-200 dark:bg-white/5 relative group cursor-pointer">
                <img 
                  src={`https://picsum.photos/400/600?random=${i + 20}`} 
                  alt="Trabalho" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-5 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Ver Detalhes</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40">
        <div className="flex gap-4 max-w-md mx-auto">
          <button 
            onClick={handleCall}
            className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
          >
            <span className="material-icons-round">phone</span>
          </button>
          <button 
            onClick={handleWhatsApp}
            className="flex-1 h-16 rounded-3xl bg-whatsapp text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] hover:scale-[1.02] transition-transform active:scale-95"
          >
            <span className="material-icons-round text-lg">chat</span> Solicitar Orçamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
