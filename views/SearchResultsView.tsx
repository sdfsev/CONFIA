import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Professional } from '../types';

const SearchResultsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'available'>('rating');
  const [searchService, setSearchService] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const serviceParam = searchParams.get('service') || '';
  const locationParam = searchParams.get('location') || '';

  // Carregar profissionais do Firestore - apenas ativos
  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true);
        let q;

        // Buscar por categoria (serviço) E status ativo
        if (serviceParam) {
          q = query(
            collection(db, 'professionals'),
            where('category', '==', serviceParam),
            where('status', '==', 'active')
          );
        } else {
          q = query(
            collection(db, 'professionals'),
            where('status', '==', 'active')
          );
        }

        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Professional[];

        // Filtrar por localização se informada
        if (locationParam) {
          data = data.filter(p =>
            p.location.toLowerCase().includes(locationParam.toLowerCase())
          );
        }

        // Ordenar por rating por padrão
        data.sort((a, b) => b.rating - a.rating);
        setProfessionals(data);
        setFilteredProfessionals(data);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, [serviceParam, locationParam]);

  // Aplicar ordenação
  useEffect(() => {
    let sorted = [...professionals];

    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    }

    setFilteredProfessionals(sorted);
  }, [sortBy, professionals]);

  return (
    <div className="max-w-md mx-auto min-h-screen relative pb-20 bg-background-light dark:bg-background-dark font-display">
      {/* iOS Status Bar */}
      <div className="h-12 w-full flex items-center justify-between px-6 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-50">
        <span className="text-sm font-semibold text-gray-800 dark:text-white">9:41</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-900 dark:bg-white/20"></div>
          <div className="w-4 h-4 rounded-full bg-gray-900 dark:bg-white/20"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-5 pt-2 pb-4 sticky top-12 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm z-40 transition-all duration-300">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-icons-round text-2xl text-gray-800 dark:text-white">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {serviceParam} em {locationParam}
            </h1>
          </div>
          <button className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-gray-600 dark:text-gray-300">
            <span className="material-icons-round text-xl">filter_list</span>
          </button>
        </div>

        {/* Search Tags */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-2 flex items-center shadow-card border border-gray-100 dark:border-white/10">
          <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center text-primary-dark dark:text-primary mr-3 shrink-0">
            <span className="material-icons-round text-xl">search</span>
          </div>
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
            <div className="bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-800 dark:text-white truncate">
              {serviceParam}
            </div>
            <div className="bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-800 dark:text-white truncate">
              {locationParam}
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <span className="material-icons-round text-xl">edit</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="pl-5 pb-6 overflow-x-auto hide-scrollbar flex gap-3 sticky top-[152px] bg-background-light dark:bg-background-dark z-30 py-2">
        <button
          onClick={() => setSortBy('rating')}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-transform active:scale-95 ${sortBy === 'rating'
            ? 'bg-primary text-gray-900 shadow-primary/20'
            : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary/50'
            }`}
        >
          Recomendados
        </button>
        <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium text-sm hover:border-primary/50 transition-all active:scale-95">
          Mais Referências
        </button>
        <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium text-sm hover:border-primary/50 transition-all active:scale-95">
          Melhor Avaliados
        </button>
      </div>

      {/* Main Content */}
      <main className="px-5 space-y-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nenhum profissional encontrado.</p>
          </div>
        ) : (
          filteredProfessionals.map((prof, index) => (
            <article
              key={prof.id}
              className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-white/5 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {prof.avatar ? (
                      <img
                        alt={prof.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                        src={prof.avatar}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm text-white text-2xl font-bold">
                        {prof.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                      {prof.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {prof.location} {prof.location && '•'} {prof.location ? '0.5km' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-wide border border-primary/20">
                        <span className="material-icons-round text-sm">emoji_events</span>
                        Nível Ouro
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 text-xs font-bold border border-green-100 dark:border-green-500/20">
                        <span className="material-icons-round text-sm">schedule</span>
                        100% Assiduidade
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Shield */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-16 bg-gradient-to-b from-primary to-yellow-500 trust-shield flex flex-col items-center justify-center shadow-lg shadow-yellow-500/30 text-white pt-1">
                    <span className="text-[10px] font-medium opacity-90 uppercase tracking-tight -mb-1">Score</span>
                    <span className="text-xl font-black tracking-tighter">
                      {(prof.rating / 2).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 font-medium">Confia</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 dark:bg-white/10 mb-4"></div>

              {/* Price and Action */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Investimento Estimado</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    R$ 180 - R$ 220
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/profile/${prof.id}`)}
                  className="flex-1 max-w-[140px] bg-action-blue hover:bg-action-blue-hover text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  Ver Perfil
                  <span className="material-icons-round text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          ))
        )}
      </main>

      {/* Bottom Nav - Only Search */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a170d] border-t border-gray-100 dark:border-white/5 pb-6 pt-2 px-6 flex justify-center items-center z-50 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center gap-1 p-2 text-primary hover:opacity-80"
        >
          <span className="material-icons-round text-2xl">search</span>
          <span className="text-[10px] font-bold">Buscar</span>
        </button>
      </nav>
    </div>
  );


};

export default SearchResultsView;
