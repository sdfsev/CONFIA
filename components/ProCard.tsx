
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Professional, TrustLevel } from '../types';

interface ProCardProps {
  pro: Professional;
}

const ProCard: React.FC<ProCardProps> = ({ pro }) => {
  const navigate = useNavigate();

  const getBadgeStyle = (level: TrustLevel) => {
    switch (level) {
      case TrustLevel.ELITE: return 'bg-primary text-white';
      case TrustLevel.GOLD: return 'bg-gold text-slate-900';
      case TrustLevel.DIAMOND: return 'bg-blue-400 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Olá ${pro.name}, vi seu perfil no Confia e gostaria de um orçamento para ${pro.category}.`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div 
      onClick={() => navigate(`/profile/${pro.id}`)}
      className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer group hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
            <img 
              src={pro.avatar} 
              alt={pro.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-lg p-1 border-2 border-white dark:border-surface-dark shadow-lg">
            <span className="material-icons-round text-[12px]">verified</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white truncate">{pro.name}</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{pro.category}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1 text-primary font-bold text-sm bg-primary/5 px-2 py-0.5 rounded-lg">
                {pro.rating.toFixed(1)} <span className="material-icons-round text-[14px] text-gold">star</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getBadgeStyle(pro.trustLevel)}`}>
              {pro.trustLevel}
            </span>
            {pro.online && (
              <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Disponível
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-white/5">
        <button className="py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-colors uppercase tracking-widest">
          Perfil
        </button>
        <button 
          onClick={handleWhatsApp}
          className="py-2.5 rounded-2xl bg-whatsapp hover:bg-whatsapp/90 text-white font-extrabold text-xs shadow-lg shadow-whatsapp/20 flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-widest"
        >
          <span className="material-icons-round text-sm">chat</span> WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProCard;
