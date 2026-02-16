
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const MOCK_DATA = [
  { day: 'S', views: 40, color: '#1363ec' },
  { day: 'T', views: 65, color: '#1363ec' },
  { day: 'Q', views: 45, color: '#1363ec' },
  { day: 'Q', views: 85, color: '#1363ec' },
  { day: 'S', views: 60, color: '#1363ec' },
  { day: 'S', views: 30, color: '#cbd5e1' },
  { day: 'D', views: 20, color: '#cbd5e1' },
];

const DashboardView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-28">
      <header className="px-6 pt-14 pb-4 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Visão Geral</h1>
            <h2 className="text-2xl font-bold">Dashboard Pro</h2>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJI2-ChlEk5k8NefYPqMmDRrI69GUoF6S-Nv8Ehpwr-EpxBhhboXhE23DtTpUL2XQ3yI8f_7yG8Bbekokc59LGqtkPAzSEZU3SXKxgAygdAkibBKtmBGtpZYA9hwRg6QyGYW_2Ps8L3LNxvUtTF5-zLCLl4bOKkYI2izjeobeZQ-g6O2kfCGZtFSWQxoxv7oomsDRaEeZRif3Uv-itpMYOhiJkJRHy1swCnjVIPVTxQY9HyTz-30sUhBukSyPNOa2NdqGI42l4fXUw" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons-outlined text-primary">visibility</span>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">↑ 12%</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">Visualizações</p>
            <p className="text-2xl font-bold">1,240</p>
          </div>
          <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="material-icons-round text-green-500">chat</span>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">↑ 24%</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">Cliques Whats</p>
            <p className="text-2xl font-bold">85</p>
          </div>
        </div>

        <section className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-100 dark:border-white/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold">Ranking Atual</h3>
              <p className="text-xs text-slate-400">Comparado com a região</p>
            </div>
            <span className="bg-gold/10 text-gold text-[10px] font-bold px-2 py-1 rounded">ELITE</span>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="views" radius={[4, 4, 4, 4]}>
                  {MOCK_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Ações Rápidas</h3>
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full bg-white dark:bg-surface-dark p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <span className="material-icons-round">verified</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Verificação Avançada</p>
                <p className="text-xs text-slate-400">Aumente sua confiança</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
          
          <button 
            onClick={() => navigate('/plans')}
            className="w-full bg-white dark:bg-surface-dark p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                <span className="material-icons-round">workspace_premium</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Upgrade de Plano</p>
                <p className="text-xs text-slate-400">Torne-se um Profissional Elite</p>
              </div>
            </div>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default DashboardView;
