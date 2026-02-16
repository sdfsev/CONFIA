import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, LogIn } from 'lucide-react';
import { db } from '../firebaseService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Professional } from '../types';

const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const categories = ['Todos', 'Encanador', 'Eletricista', 'Pintor', 'Carpinteiro', 'Pedreiro'];

  // Carregar profissionais do Firestore
  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        const q = query(collection(db, 'professionals'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Professional[];
        setProfessionals(data);
        setFilteredProfessionals(data);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, []);

  // Filtrar profissionais
  useEffect(() => {
    let filtered = professionals;

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  }, [searchQuery, selectedCategory, professionals]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Confia</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn size={18} />
            Entrar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Encontre Profissionais de Confiança
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Conecte-se com os melhores prestadores de serviço da sua região
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar profissionais ou serviços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Nenhum profissional encontrado. Tente outra busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map(professional => (
              <div
                key={professional.id}
                onClick={() => navigate(`/profile/${professional.id}`)}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                {/* Avatar */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                  {professional.avatar ? (
                    <img
                      src={professional.avatar}
                      alt={professional.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-5xl text-white font-bold">
                        {professional.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {professional.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">
                    {professional.category}
                  </p>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm mb-3">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{professional.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {professional.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        ({professional.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Trust Level Badge */}
                  <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                    ✓ {professional.trustLevel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 mb-4">
            © 2026 Confia - Encontre profissionais de confiança
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Registrar-se Como Profissional
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
