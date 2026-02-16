import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseService';

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMap: { [key: string]: string } = {
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuário desativado',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/invalid-credential': 'Email ou senha incorretos',
      };
      setError(errorMap[err.code] || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark to-[#051a38] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 mx-auto mb-4">
            <span className="material-icons-round text-white text-4xl">verified</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Confia</h1>
          <p className="text-sm text-blue-200">Plataforma de Profissionais Verificados</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-dark rounded-3xl p-8 shadow-2xl border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-1">Bem-vindo!</h2>
          <p className="text-slate-400 text-sm mb-8">Faça login com sua conta</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-slate-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-icons-round animate-spin text-sm">sync</span>
                  Entrando...
                </>
              ) : (
                <>
                  <span className="material-icons-round text-sm">login</span>
                  ENTRAR
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-slate-400 text-sm">
              Não tem conta?{' '}
              <Link
                to="/register"
                className="text-primary font-bold hover:text-primary-dark transition-colors"
              >
                Criar Conta
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Profissionais de elite com garantia de segurança
        </p>
      </div>
    </div>
  );
};

export default LoginView;
