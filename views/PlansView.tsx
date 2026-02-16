
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlansView: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    { 
      name: 'Básico', 
      price: '0', 
      features: ['Perfil básico', 'Listagem padrão', 'Até 3 fotos no portfólio'],
      current: true 
    },
    { 
      name: 'Profissional', 
      price: '29,90', 
      features: ['Selo Verificado', 'Destaque nas buscas', 'Até 10 fotos', 'Sem anúncios'],
      highlight: false
    },
    { 
      name: 'Elite', 
      price: '59,90', 
      features: ['Topo do Ranking', 'Perfil de Vídeo Premium', 'Badge Resposta Rápida', 'Antecedentes Criminais'],
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark pb-12">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4 sticky top-0 bg-slate-50/95 dark:bg-background-dark/95 backdrop-blur-sm z-30">
        <button onClick={() => navigate(-1)} className="p-1">
          <span className="material-icons-round">chevron_left</span>
        </button>
        <h1 className="text-lg font-bold">Planos e Preços</h1>
      </header>

      <div className="px-6 text-center mb-10">
        <h2 className="text-2xl font-extrabold mb-2 leading-tight">Maximize sua visibilidade no <span className="text-primary">Confia</span></h2>
        <p className="text-sm text-slate-500">Escolha o plano ideal para alavancar sua carreira.</p>
      </div>

      <div className="px-6 space-y-6">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`bg-white dark:bg-surface-dark rounded-3xl p-6 border-2 relative overflow-hidden transition-all transform hover:scale-[1.02] ${
              plan.highlight ? 'border-gold shadow-2xl' : 'border-slate-100 dark:border-white/5 shadow-lg'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-gold text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl">
                MAIS VANTAJOSO
              </div>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-xl font-bold ${plan.highlight ? 'text-gold' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name} {plan.highlight && '⭐'}
                </h3>
                <p className="text-xs text-slate-400">Mensal</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900 dark:text-white">R$ {plan.price}</p>
                <p className="text-[10px] text-slate-400">/mês</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-medium">
                  <span className={`material-icons-round text-lg ${plan.highlight ? 'text-gold' : 'text-primary'}`}>check_circle</span>
                  {f}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
              plan.current 
              ? 'bg-slate-100 text-slate-400 cursor-default' 
              : plan.highlight 
                ? 'bg-gold text-slate-900 shadow-gold/20' 
                : 'bg-primary text-white shadow-primary/20'
            }`}>
              {plan.current ? 'Plano Atual' : `Assinar ${plan.name} Agora`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansView;
