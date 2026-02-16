import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseService';
import { collection, getDocs } from 'firebase/firestore';
import { Professional } from '../types';

const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchService, setSearchService] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Limpeza', icon: 'cleaning_services' },
    { name: 'Piscina', icon: 'pool' },
    { name: 'Jardim', icon: 'grass' },
    { name: 'Ar-cond.', icon: 'ac_unit' },
  ];

  // Carregar profissionais
  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'professionals'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Professional[];
        // Pegar apenas 4 primeiros (destaques)
        setProfessionals(data.slice(0, 4));
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-extrabold text-xl">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight">CONFIA</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/register')}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              TRABALHAR
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-full shadow-sm hover:opacity-90 transition-opacity"
            >
              APOIAR
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-20">
        {/* Hero Section */}
        <section className="px-6 py-10 text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight mb-4 text-slate-900 dark:text-white">
            O profissional que sua casa precisa...
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Conecte-se com especialistas locais sem taxas de intermediação.
          </p>
        </section>

        {/* Search Bar */}
        <section className="px-4 -mt-2 mb-10">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-xl shadow-blue-600/5 border border-slate-100 dark:border-slate-700">
            <div className="space-y-1">
              {/* Serviço */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="material-icons-round text-blue-600 text-xl">search</span>
                <input
                  type="text"
                  placeholder="Qual serviço você procura?"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 font-medium outline-none"
                />
              </div>
              {/* Localização + Filtro */}
              <div className="flex items-center gap-2">
                <div className="flex-grow flex items-center gap-3 px-4 py-3">
                  <span className="material-icons-round text-slate-400 text-xl">location_on</span>
                  <input
                    type="text"
                    placeholder="Sua localização"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 font-medium outline-none"
                  />
                </div>
                <button className="m-1 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95">
                  <span className="material-icons-round text-xl">tune</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-10 px-4 mb-10">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Categorias</h2>
            <button className="text-blue-600 text-sm font-bold hover:opacity-80">Ver todas</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-600/20 transition-colors active:scale-90 cursor-pointer">
                  <span className="material-icons-round text-3xl">{cat.icon}</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Professionals */}
        <section className="mt-12 px-4 mb-12">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="font-bold text-xl text-slate-900 dark:text-white">Destaques da Região</h2>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">Nenhum profissional encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {professionals.map((pro) => (
                <div
                  key={pro.id}
                  onClick={() => navigate(`/profile/${pro.id}`)}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700 relative cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Destaque
                  </div>
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-3">
                      {pro.avatar ? (
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-slate-50 dark:border-slate-700 text-white text-2xl font-bold">
                          {pro.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                    </div>
                    {/* Name */}
                    <h3 className="font-bold text-sm mb-1 truncate w-full text-slate-900 dark:text-white">
                      {pro.name}
                    </h3>
                    {/* Category */}
                    <p className="text-slate-400 text-[11px] font-medium mb-2">
                      {pro.category}
                    </p>
                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-full">
                      <span className="material-icons-round text-yellow-400 text-sm">star</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {pro.rating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({pro.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/search')}
            className="w-full mt-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Ver todos os profissionais
          </button>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 pb-8 z-40 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo(0, 0)}
            className="flex flex-col items-center gap-1 text-blue-600 hover:opacity-80"
          >
            <span className="material-icons-round">explore</span>
            <span className="text-[10px] font-bold">Explorar</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span className="material-icons-round">bookmark_border</span>
            <span className="text-[10px] font-bold">Salvos</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span className="material-icons-round">chat_bubble_outline</span>
            <span className="text-[10px] font-bold">Mensagens</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <span className="material-icons-round">person_outline</span>
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LandingView;
