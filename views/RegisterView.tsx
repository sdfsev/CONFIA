import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseService';

const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Email inválido');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não conferem');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Você precisa aceitar os termos');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Iniciando registro com:', formData.email);
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log('Usuário criado:', userCredential.user.uid);

      // Salvar dados do usuário no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString(),
        profile: {
          avatar: '',
          category: '',
          location: '',
          description: '',
          trustScore: 0,
          verified: false,
        },
      });

      console.log('Perfil salvo com sucesso');
      navigate('/onboarding');
    } catch (err: any) {
      console.error('Erro completo:', err);
      console.error('Código de erro:', err.code);
      console.error('Mensagem:', err.message);
      
      const errorMap: { [key: string]: string } = {
        'auth/email-already-in-use': 'Este email já está registrado',
        'auth/invalid-email': 'Email inválido',
        'auth/weak-password': 'Senha muito fraca',
        'auth/operation-not-allowed': 'Registro desativado. Ative no Firebase Console',
        'permission-denied': 'Permissão negada. Verifique as regras do Firestore',
        'PERMISSION_DENIED': 'Permissão negada. Verifique as regras do Firestore',
      };
      
      const mensagem = errorMap[err.code] || err.message || 'Erro ao criar conta. Tente novamente.';
      setError(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark to-[#051a38] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 mx-auto mb-4">
            <span className="material-icons-round text-white text-4xl">verified</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Confia</h1>
          <p className="text-sm text-blue-200">Crie sua conta agora</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-dark rounded-3xl p-8 shadow-2xl border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-1">Criar Conta</h2>
          <p className="text-slate-400 text-sm mb-8">Junte-se à nossa comunidade de profissionais verificados</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="João Silva"
                required
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <label className="flex items-start gap-3 py-3">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1.5 w-5 h-5 rounded accent-primary cursor-pointer"
              />
              <span className="text-xs text-slate-400">
                Aceito os{' '}
                <a href="#" className="text-primary hover:text-primary-dark">
                  termos de uso
                </a>{' '}
                e a{' '}
                <a href="#" className="text-primary hover:text-primary-dark">
                  política de privacidade
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-slate-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <span className="material-icons-round animate-spin text-sm">sync</span>
                  Criando Conta...
                </>
              ) : (
                <>
                  <span className="material-icons-round text-sm">person_add</span>
                  CRIAR CONTA
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-slate-400 text-sm">
              Já tem conta?{' '}
              <Link
                to="/login"
                className="text-primary font-bold hover:text-primary-dark transition-colors"
              >
                Fazer Login
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

export default RegisterView;
