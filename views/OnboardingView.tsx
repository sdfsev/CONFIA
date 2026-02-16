
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/userService';
import FileUpload from '../components/FileUpload';

const OnboardingView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    cpf: '', 
    name: '', 
    category: '',
    location: '',
    description: '',
    rgFront: '',
    rgBack: '',
    selfie: '',
    avatar: ''
  });
  const [error, setError] = useState('');

  const nextStep = async () => {
    if (step < 5) {
      setStep(s => s + 1);
    } else {
      // Finalizar onboarding e salvar perfil
      if (!user) return;
      
      try {
        await updateUserProfile(user.uid, {
          name: formData.name,
          profile: {
            category: formData.category,
            location: formData.location,
            description: formData.description,
            avatar: formData.avatar,
            trustScore: 0,
            verified: false,
          }
        });
        navigate('/dashboard');
      } catch (err: any) {
        setError('Erro ao salvar perfil: ' + err.message);
      }
    }
  };

  const handleAvatarUpload = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
  };

  const handleRGFrontUpload = (url: string) => {
    setFormData(prev => ({ ...prev, rgFront: url }));
  };

  const handleSelfieUpload = (url: string) => {
    setFormData(prev => ({ ...prev, selfie: url }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background-dark">
      <header className="px-6 pt-14 pb-8 bg-white dark:bg-background-dark border-b border-slate-100 dark:border-white/5 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-dark flex items-center justify-center">
            <span className="material-icons-round text-sm">chevron_left</span>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Passo {step} de 5</p>
            <h2 className="text-sm font-black uppercase tracking-widest">
              {step === 1 ? 'Perfil' : step === 2 ? 'Especialidade' : step === 3 ? 'Segurança' : 'Análise'}
            </h2>
          </div>
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-dark flex items-center justify-center">
            <span className="material-icons-round text-sm text-red-400">close</span>
          </button>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${(step/5)*100}%` }}></div>
        </div>
      </header>

      <main className="flex-1 px-8 py-10 max-w-md mx-auto w-full space-y-10 animate-fade-in">
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black mb-3">Vamos começar.</h1>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Conte-nos um pouco sobre você para criarmos seu perfil premium.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-5 rounded-3xl bg-white dark:bg-surface-dark border-none shadow-xl shadow-slate-200/20 dark:shadow-none focus:ring-2 focus:ring-primary font-bold transition-all"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria/Profissão</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full p-5 rounded-3xl bg-white dark:bg-surface-dark border-none shadow-xl shadow-slate-200/20 dark:shadow-none focus:ring-2 focus:ring-primary font-bold transition-all"
                  placeholder="Ex: Eletricista, Encanador, Diarista..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full p-5 rounded-3xl bg-white dark:bg-surface-dark border-none shadow-xl shadow-slate-200/20 dark:shadow-none focus:ring-2 focus:ring-primary font-bold transition-all"
                  placeholder="Bairro, Cidade"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Profissional</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-5 rounded-3xl bg-white dark:bg-surface-dark border-none shadow-xl shadow-slate-200/20 dark:shadow-none focus:ring-2 focus:ring-primary font-bold transition-all resize-none h-24"
                  placeholder="Fale sobre sua experiência e serviços..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sua Foto (Avatar)</label>
                <FileUpload
                  onUploadSuccess={handleAvatarUpload}
                  accept="image/*"
                  maxSizeMB={5}
                  label="Selecione sua foto"
                  icon="photo_camera"
                />
                {formData.avatar && (
                  <div className="mt-3 relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary">
                    <img src={formData.avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black mb-3">Identidade.</h1>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">A verificação biométrica aumenta suas chances de contratação em <span className="text-primary font-bold">80%</span>.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF Verificado</label>
                <input 
                  type="text" 
                  value={formData.cpf}
                  onChange={e => setFormData({...formData, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                  className="w-full p-5 rounded-3xl bg-white dark:bg-surface-dark border-none shadow-xl shadow-slate-200/20 dark:shadow-none focus:ring-2 focus:ring-primary font-black"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">RG Frente</label>
                  <FileUpload
                    onUploadSuccess={handleRGFrontUpload}
                    accept="image/*"
                    maxSizeMB={5}
                    label="RG Frente"
                    icon="badge"
                  />
                  {formData.rgFront && (
                    <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
                      <span className="material-icons-round text-sm">check_circle</span>
                      Upload realizado
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Selfie para Verificação</label>
                  <FileUpload
                    onUploadSuccess={handleSelfieUpload}
                    accept="image/*"
                    maxSizeMB={5}
                    label="Sua Selfie"
                    icon="face"
                  />
                  {formData.selfie && (
                    <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
                      <span className="material-icons-round text-sm">check_circle</span>
                      Upload realizado
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step !== 1 && step !== 4 && (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="material-icons-round text-4xl text-primary">auto_fix_high</span>
             </div>
             <h2 className="text-xl font-black mb-2">Configurando Detalhes...</h2>
             <p className="text-sm text-slate-400 text-center px-6">Estamos otimizando seu perfil para os mecanismos de busca do Confia.</p>
          </div>
        )}
      </main>

      <footer className="p-8 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-white/5 sticky bottom-0">
        <div className="max-w-md mx-auto w-full">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 mb-4">
              <p className="text-red-400 text-xs font-medium">{error}</p>
            </div>
          )}
          <button 
            onClick={nextStep}
            className="w-full py-5 rounded-[2rem] bg-primary hover:bg-primary-dark text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95"
          >
            {step === 5 ? (
              <>
                <span className="material-icons-round text-sm">check</span>
                Finalizar Perfil
              </>
            ) : (
              <>
                Próximo Passo
                <span className="material-icons-round text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingView;
