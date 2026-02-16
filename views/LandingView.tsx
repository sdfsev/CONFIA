import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Professional } from '../types';
import { BRAZILIAN_CITIES, AVAILABLE_SERVICES, filterCities } from '../constants/searchConstants';

const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchService, setSearchService] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [cityDropdown, setCityDropdown] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Categorias com ícones
  const categories = [
    { name: 'Diaristas', icon: 'cleaning_services' },
    { name: 'Eletricistas', icon: 'electrical_services' },
    { name: 'Babás', icon: 'child_care' },
    { name: 'Encanadores', icon: 'plumbing' },
    { name: 'Pintores', icon: 'format_paint' },
    { name: 'Reparos', icon: 'handyman' },
    { name: 'Mudanças', icon: 'local_shipping' },
  ];

  // Carregar profissionais verificados
  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        const snapshot = await getDocs(
          query(collection(db, 'professionals'), where('status', '==', 'active'))
        );
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Professional[];
        setProfessionals(data.slice(0, 1)); // Featured professional
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, []);

  // Handle cidade input/dropdown
  const handleCityChange = (value: string) => {
    setSearchLocation(value);
    if (value.length > 0) {
      const filtered = filterCities(value);
      setCityDropdown(filtered);
      setShowCityDropdown(true);
    } else {
      setCityDropdown([]);
      setShowCityDropdown(false);
    }
  };

  const selectCity = (city: string) => {
    setSearchLocation(city);
    setShowCityDropdown(false);
  };

  // Handle busca
  const handleSearch = () => {
    if (!searchService || !searchLocation) {
      alert('Por favor, selecione um serviço e uma localização');
      return;
    }
    navigate(`/search-results?service=${encodeURIComponent(searchService)}&location=${encodeURIComponent(searchLocation)}`);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-navy-light/95 border-b border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-sm ">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-navy dark:bg-primary text-primary dark:text-navy">
              <span className="material-symbols-outlined" style={{fontSize: '20px', fontVariationSettings: "'FILL' 1"}}>shield_person</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy dark:text-white">Confia</h1>
          </div>
          <button
            onClick={() => navigate('/professional-register')}
            className="text-xs font-semibold text-navy dark:text-primary border border-navy dark:border-primary px-3 py-1.5 rounded-full hover:bg-navy hover:text-white dark:hover:bg-primary dark:hover:text-navy transition-colors duration-200"
          >
            Sou Profissional
          </button>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-navy dark:bg-background-dark">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[radial-gradient(#f4c025_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative px-5 pt-10 pb-12 flex flex-col gap-6 z-10">
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                100% Verificado
              </span>
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
                Confiança não se fala, <span className="text-primary">se mensura</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-[320px] mx-auto">
                Encontre profissionais com score de assiduidade e antecedentes criminais verificados em tempo real.
              </p>
            </div>

            {/* Search Card */}
            <div className="bg-white dark:bg-navy-light rounded-2xl p-4 shadow-xl shadow-navy/20 dark:shadow-black/40 mt-2">
              <form className="flex flex-col gap-3">
                {/* Service Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Qual serviço você precisa?"
                    onClick={() => setSearchService('')}
                    list="service-list"
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 text-sm font-medium transition-colors"
                  />
                  <datalist id="service-list">
                    {AVAILABLE_SERVICES.map(service => (
                      <option key={service} value={service} />
                    ))}
                  </datalist>
                </div>

                {/* Location Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Bairro ou CEP"
                    value={searchLocation}
                    onChange={(e) => handleCityChange(e.target.value)}
                    onFocus={() => searchLocation.length > 0 && setShowCityDropdown(true)}
                    className="block w-full pl-10 pr-3 py-3.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 text-sm font-medium transition-colors"
                  />
                  {/* City Dropdown */}
                  {showCityDropdown && cityDropdown.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                      {cityDropdown.map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => selectCity(city)}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 text-navy dark:text-white text-sm font-medium border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="mt-2 w-full bg-primary hover:bg-primary-dark text-navy font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Buscar Profissional Verificado</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-white dark:bg-navy-light border-b border-gray-100 dark:border-gray-800 py-6 px-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <div className="flex items-center -space-x-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-navy-light bg-gray-200 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/50"></div>
                </div>
              ))}
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-navy-light bg-navy text-primary text-[10px] font-bold">
                +5k
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                ))}
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Mais de 5.000 serviços concluídos</p>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-8 px-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-navy dark:text-white tracking-tight">Categorias Populares</h3>
            <button className="text-sm font-semibold text-primary hover:text-primary-dark">Ver tudo</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setSearchService(cat.name);
                  setCityDropdown(BRAZILIAN_CITIES.slice(0, 10));
                  setShowCityDropdown(true);
                }}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-navy-light shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-navy dark:text-primary text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                </div>
                <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300 group-hover:text-navy dark:group-hover:text-primary">{cat.name}</span>
              </button>
            ))}
            {/* Mais/Others */}
            <button className="group flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-none border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-all duration-300">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">grid_view</span>
              </div>
              <span className="text-xs font-medium text-center text-gray-500 dark:text-gray-400">Outros</span>
            </button>
          </div>
        </section>

        {/* Featured Professional Banner */}
        {!loading && professionals.length > 0 && (
          <section className="px-5 pb-8">
            <button
              onClick={() => navigate(`/profile/${professionals[0].id}`)}
              className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: `linear-gradient(to bottom, transparent 30%, rgba(15, 23, 42, 0.9)), url('${professionals[0].avatar || 'https://images.unsplash.com/photo-1607631814075-e51df1bdc82f?w=500&h=300&fit=crop'}')`}}>
              </div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary text-navy text-[10px] font-bold px-2 py-0.5 rounded-sm">DESTAQUE</span>
                  <div className="flex text-primary text-[10px]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    ))}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">{professionals[0].name}</h3>
                <p className="text-gray-200 text-xs mt-1 line-clamp-1">{professionals[0].category} • {professionals[0].location}</p>
              </div>
            </button>
          </section>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="sticky bottom-0 bg-white dark:bg-navy-light border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-6">
        <div className="flex items-center justify-center pb-3 max-w-lg mx-auto">
          <button
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="flex flex-col items-center gap-1 text-primary hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>search</span>
            <span className="text-[10px] font-medium">Buscar</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LandingView;
