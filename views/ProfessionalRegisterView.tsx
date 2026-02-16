import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AVAILABLE_SERVICES } from '../constants/searchConstants';

const ProfessionalRegisterView: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    service: '',
    bio: '',
    location: '',
    acceptTerms: false,
  });
  const [document, setDocument] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Preencha todos os campos');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.fullName || !formData.phone || !formData.service || !formData.location) {
      setError('Preencha todos os campos');
      return false;
    }
    if (!document) {
      setError('Envie um documento (RG, CNH ou Passport)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;

      // Upload do documento
      let documentUrl = '';
      if (document) {
        const storageRef = ref(storage, `professionals/documents/${userId}/${document.name}`);
        await uploadBytes(storageRef, document);
        documentUrl = await getDownloadURL(storageRef);
      }

      // Criar perfil de profissional PENDENTE
      await setDoc(doc(db, 'professionals', userId), {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        category: formData.service,
        location: formData.location,
        about: formData.bio,
        avatar: '',
        rating: 5,
        reviewCount: 0,
        trustLevel: 'PENDING',
        online: false,
        documentUrl: documentUrl,
        status: 'pending_review',
        createdAt: new Date(),
        tags: []
      });

      // Criar documento também em uma coleção de requisições
      await setDoc(doc(db, 'professional_requests', userId), {
        userId: userId,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        location: formData.location,
        documentUrl: documentUrl,
        status: 'pending',
        createdAt: new Date(),
      });

      // Enviar email de verificação
      await sendEmailVerification(userCredential.user);

      alert('Cadastro enviado para revisão! Você receberá um email de confirmação.');
      navigate('/');
    } catch (error: any) {
      console.error('Erro:', error);
      setError(error.message || 'Erro ao registrar profissional');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      navigate('/home');
    } catch (error: any) {
      console.error('Erro:', error);
      setError(error.message || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Sou Profissional
          </h1>
          <button
            onClick={() => navigate('/')}
            className="text-slate-500 dark:text-slate-400 hover:opacity-80"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Abas */}
        <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-3 px-4 font-bold text-sm transition-colors border-b-2 ${
              tab === 'login'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 dark:text-slate-400 border-transparent'
            }`}
          >
            Fazer Login
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); setStep(1); }}
            className={`flex-1 py-3 px-4 font-bold text-sm transition-colors border-b-2 ${
              tab === 'register'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 dark:text-slate-400 border-transparent'
            }`}
          >
            Registrar
          </button>
        </div>

        {/* LOGIN TAB */}
        {tab === 'login' && (
          <div className="space-y-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm text-center">
              Entre com sua conta para acessar o painel de profissional
            </p>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Senha
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Fazer Login'}
            </button>
          </div>
        )}

        {/* REGISTER TAB */}
        {tab === 'register' && (
          <>
            {/* Progresso */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
            </div>

            {/* Step 1: Login Info */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Crie sua conta profissional para começar a oferecer serviços
                </p>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirme sua senha"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Step 2: Professional Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Serviço que oferece
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Selecione um serviço</option>
                    {AVAILABLE_SERVICES.map(service => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="São Paulo, SP"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Sobre você (opcional)
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Descreva sua experiência..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Documento de Identidade (RG, CNH ou Passport) *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer block">
                      {documentPreview ? (
                        <div className="flex flex-col items-center gap-2">
                          {document?.type.startsWith('image') ? (
                            <img src={documentPreview} alt="Preview" className="max-h-20 rounded" />
                          ) : (
                            <span className="material-icons-round text-blue-600 text-4xl">description</span>
                          )}
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {document?.name}
                          </p>
                          <p className="text-xs text-slate-500">Clique para trocar</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="material-icons-round text-slate-400 text-4xl">cloud_upload</span>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Clique para enviar documento
                          </p>
                          <p className="text-xs text-slate-500">JPG, PNG ou PDF</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Aceito os termos e condições. Meu cadastro será revisado e preciso ser aprovado para trabalhar na plataforma.
                  </span>
                </label>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.acceptTerms || loading}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Enviando...' : 'Registrar'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme sua senha"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <button
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Serviço que oferece
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Selecione um serviço</option>
                {AVAILABLE_SERVICES.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Localização
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="São Paulo, SP"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Sobre você (opcional)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Descreva sua experiência..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Documento de Identidade (RG, CNH ou Passport) *
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer block">
                  {documentPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      {document?.type.startsWith('image') ? (
                        <img src={documentPreview} alt="Preview" className="max-h-20 rounded" />
                      ) : (
                        <span className="material-icons-round text-blue-600 text-4xl">description</span>
                      )}
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {document?.name}
                      </p>
                      <p className="text-xs text-slate-500">Clique para trocar</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-icons-round text-slate-400 text-4xl">cloud_upload</span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Clique para enviar documento
                      </p>
                      <p className="text-xs text-slate-500">JPG, PNG ou PDF</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Aceito os termos e condições. Meu cadastro será revisado e preciso ser aprovado para trabalhar na plataforma.
              </span>
            </label>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.acceptTerms || loading}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Registrar'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfessionalRegisterView;
