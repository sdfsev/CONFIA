
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MOCK_PROFESSIONALS } from '../constants';
import ProCard from '../components/ProCard';
import { getSmartSearchSuggestions } from '../geminiService';

const SearchView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    location: '',
    minRating: 0,
    eliteOnly: false
  });

  const filteredPros = useMemo(() => {
    return MOCK_PROFESSIONALS.filter(pro => {
      const matchText = !searchTerm || 
        pro.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pro.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.about?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = !activeFilters.category || pro.category.toLowerCase().includes(activeFilters.category.toLowerCase());
      const matchLocation = !activeFilters.location || pro.location.toLowerCase().includes(activeFilters.location.toLowerCase());
      const matchElite = !activeFilters.eliteOnly || pro.trustLevel === 'ELITE';
      
      return matchText && matchCategory && matchLocation && matchElite;
    });
  }, [searchTerm, activeFilters]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    const intent = await getSmartSearchSuggestions(searchTerm);
    if (intent) {
      setActiveFilters(prev => ({
        ...prev,
        category: intent.category || '',
        location: intent.location || ''
      }));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialQuery) handleSearch();
  }, [initialQuery]);

  return (
    <div className="pb-24 min-h-screen bg-slate-50 dark:bg-background-dark">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-4 pt-12 pb-4">
        <form onSubmit={handleSearch} className="flex items-center gap-3 mb-4">
          <button type="button" onClick={() => navigate('/')} className="p-1">
            <span className="material-icons-round">arrow_back</span>
          </button>
          <div className="relative flex-1 group">
            <span className={`material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm transition-colors ${isLoading ? 'animate-spin' : ''}`}>
              {isLoading ? 'sync' : 'search'}
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-surface-dark border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all shadow-inner"
              placeholder="Ex: Diarista em Moema"
            />
          </div>
        </form>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Todos', 'Elite', 'Disponíveis', 'Preço'].map(f => (
            <button 
              key={f} 
              onClick={() => f === 'Elite' && setActiveFilters(p => ({...p, eliteOnly: !p.eliteOnly}))}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                (f === 'Elite' && activeFilters.eliteOnly) 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-white dark:bg-surface-dark text-slate-500 border-slate-200 dark:border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white dark:bg-surface-dark rounded-3xl shimmer opacity-50"></div>
            ))}
          </div>
        ) : filteredPros.length > 0 ? (
          <>
            <div className="flex justify-between items-center px-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {filteredPros.length} Profissionais Encontrados
              </p>
              {activeFilters.location && (
                <span className="text-primary text-[10px] font-black uppercase bg-primary/10 px-2 py-1 rounded-lg">
                  {activeFilters.location}
                </span>
              )}
            </div>
            {filteredPros.map(pro => (
              <ProCard key={pro.id} pro={pro} />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-20 h-20 bg-slate-100 dark:bg-surface-dark rounded-full flex items-center justify-center mb-4">
              <span className="material-icons-round text-4xl text-slate-300">search_off</span>
            </div>
            <h3 className="text-lg font-extrabold mb-2">Nenhum resultado</h3>
            <p className="text-sm text-slate-400">Tente ajustar sua busca ou remover os filtros para encontrar mais profissionais.</p>
          </div>
        )}
      </main>

      <button 
        onClick={() => setShowFilters(true)}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-2 active:scale-95 transition-all z-40 border border-white/10"
      >
        <span className="material-icons-round text-sm">tune</span>
        <span className="font-black text-xs uppercase tracking-widest">Ajustar Filtros</span>
      </button>

      {showFilters && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowFilters(false)}></div>
          <div className="relative bg-white dark:bg-background-dark w-full max-w-md rounded-t-[3rem] p-8 pb-12 shadow-2xl animate-slide-up">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-8"></div>
            <h2 className="text-2xl font-black mb-8">Filtros Avançados</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Localização</h3>
                <input 
                  type="text" 
                  value={activeFilters.location}
                  onChange={(e) => setActiveFilters(p => ({...p, location: e.target.value}))}
                  placeholder="Ex: Pinheiros, São Paulo"
                  className="w-full bg-slate-50 dark:bg-surface-dark border-none rounded-2xl p-4 text-sm font-bold focus:ring-primary"
                />
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Nível de Confiança</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'elite', label: 'Elite', icon: 'stars' },
                    { id: 'verified', label: 'Verificados', icon: 'verified' }
                  ].map(btn => (
                    <button 
                      key={btn.id}
                      onClick={() => btn.id === 'elite' && setActiveFilters(p => ({...p, eliteOnly: !p.eliteOnly}))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                        (btn.id === 'elite' && activeFilters.eliteOnly) 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-surface-dark text-slate-400'
                      }`}
                    >
                      <span className="material-icons-round">{btn.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
              >
                Ver {filteredPros.length} Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchView;
