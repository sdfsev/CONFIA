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

  const serviceParam = searchParams.get('service') || '';
  const locationParam = searchParams.get('location') || '';

  // Carregar profissionais do Firestore
  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true);
        let q;

        // Buscar por categoria (serviço)
        if (serviceParam) {
          q = query(
            collection(db, 'professionals'),
            where('category', '==', serviceParam)
          );
        } else {
          q = query(collection(db, 'professionals'));
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display pb-24">
      {/* iOS Status Bar Spacer */}
      <div className="h-12 w-full bg-background-light dark:bg-background-dark sticky top-0 z-50"></div>

      {/* Header Navigation */}
      <header className="sticky top-12 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-sm hover:opacity-80"
          >
            <span className="material-icons-round text-slate-600 dark:text-slate-300">chevron_left</span>
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Busca
            </h1>
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {serviceParam} em {locationParam || 'todas as cidades'}
            </p>
          </div>
          <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-sm hover:opacity-80">
            <span className="material-icons-round text-slate-600 dark:text-slate-300 text-xl">tune</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-4">
        {/* Filter Row */}
        <div className="flex gap-3 overflow-x-auto py-4 -mx-6 px-6 hide-scrollbar">
          <button
            onClick={() => setSortBy('rating')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-md transition-all ${
              sortBy === 'rating'
                ? 'bg-blue-600 text-white shadow-blue-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700'
            }`}
          >
            <span className="material-icons-round text-sm">star</span>
            Melhor Avaliado
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm transition-all ${
              sortBy === 'price'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700'
            }`}
          >
            Preço
            <span className="material-icons-round text-sm">expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm border border-slate-100 dark:border-slate-700">
            Disponível Hoje
          </button>
        </div>

        {/* Metadata */}
        <div className="mt-4 mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {filteredProfessionals.length}
            </span>{' '}
            profissionais encontrados na sua região
          </p>
        </div>

        {/* Professionals List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              Nenhum profissional encontrado com esses critérios.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProfessionals.map((professional, index) => (
              <div
                key={professional.id}
                className={`rounded-lg p-6 shadow-lg border transition-all ${
                  index === 0
                    ? 'bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border-2 border-amber-200/20'
                    : 'bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none border border-slate-50 dark:border-slate-700'
                } relative overflow-hidden`}
              >
                {/* Destaque Badge (only first professional) */}
                {index === 0 && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-amber-400 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-lg tracking-widest flex items-center gap-1">
                      <span className="material-icons-round text-xs">verified</span>
                      Destaque
                    </div>
                  </div>
                )}

                <div className="flex gap-4 items-start mb-4 pt-2">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {professional.avatar ? (
                      <img
                        src={professional.avatar}
                        alt={professional.name}
                        className={`w-20 h-20 rounded-full object-cover ${
                          index === 0 ? 'border-4 border-amber-200/20' : ''
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold ${
                          index === 0 ? 'border-4 border-amber-200/20' : ''
                        }`}
                      >
                        {professional.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {professional.name}
                    </h2>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {professional.category}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-400">
                      <span className="material-icons-round text-lg">star</span>
                      <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                        {professional.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                        ({professional.reviewCount} avaliações)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {professional.about || `Profissional especializado em ${professional.category}`}
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/profile/${professional.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3.5 font-bold text-sm transition-all shadow-lg shadow-blue-600/25"
                  >
                    Ver Perfil
                  </button>
                  <button className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-full py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <span className="material-icons-round text-green-600 text-xl">chat</span>
                    Conversar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Map Toggle FAB */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-full shadow-2xl shadow-black/30 font-bold text-sm hover:opacity-90 transition-opacity max-w-md">
          <span className="material-icons-round text-sm">map</span>
          Ver no Mapa
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-8 py-3 flex justify-between items-center z-40 max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center text-blue-600 hover:opacity-80"
        >
          <span className="material-icons-round">search</span>
          <span className="text-[10px] font-bold mt-1">Buscar</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <span className="material-icons-round">calendar_today</span>
          <span className="text-[10px] font-bold mt-1">Agendados</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <span className="material-icons-round">chat_bubble_outline</span>
          <span className="text-[10px] font-bold mt-1">Chat</span>
        </button>
        <button
          onClick={() => navigate('/login')}
          className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <span className="material-icons-round">person_outline</span>
          <span className="text-[10px] font-bold mt-1">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default SearchResultsView;
