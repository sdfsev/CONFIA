
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SupportView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display pb-24">
            <header className="p-6">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                    <span className="material-icons-round mr-1">arrow_back</span>
                    Voltar
                </button>
            </header>

            {/* Transparency Panel */}
            <section className="px-6 pt-4 pb-8 max-w-md mx-auto">
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary font-bold text-xs uppercase tracking-widest rounded-full mb-4">
                        Pacto de Boa Fé
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Transparência Total</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Conectamos você diretamente, sem intermediários ou custos ocultos.</p>
                </div>

                {/* Triple Benefits */}
                <div className="grid grid-cols-1 gap-4 mb-12">
                    <div className="flex items-center p-5 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4">
                            <span className="material-icons text-primary">payments</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Sem taxas</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">O valor do orçamento é 100% seu.</p>
                        </div>
                    </div>
                    <div className="flex items-center p-5 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4">
                            <span className="material-icons text-primary">percent</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Sem comissões</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Nada de porcentagem sobre o serviço.</p>
                        </div>
                    </div>
                    <div className="flex items-center p-5 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4">
                            <span className="material-icons text-primary">verified_user</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Sem burocracia</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Contato direto via WhatsApp ou Chat.</p>
                        </div>
                    </div>
                </div>

                {/* Persona Blocks */}
                <div className="space-y-4 mb-16">
                    <div className="p-6 bg-slate-900 text-white rounded-xl">
                        <div className="flex items-center mb-3">
                            <span className="material-icons text-primary mr-2">home</span>
                            <h4 class="font-bold">Para Clientes</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Ache profissionais qualificados perto de você e negocie diretamente. Você paga apenas o valor do serviço combinado, sem taxas de uso da plataforma.
                        </p>
                    </div>
                    <div className="p-6 bg-primary/5 dark:bg-primary/10 border-2 border-dashed border-primary/30 rounded-xl">
                        <div className="flex items-center mb-3">
                            <span className="material-icons text-primary mr-2">construction</span>
                            <h4 className="font-bold dark:text-white">Para Profissionais</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Mantenha 100% do seu lucro. Não cobramos mensalidade nem créditos para visualizar leads. O SIXFIX é e sempre será grátis para trabalhar.
                        </p>
                    </div>
                </div>

                {/* Botão do Café Section */}
                <div className="relative overflow-hidden p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-center">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full"></div>
                    <span className="material-icons text-4xl text-primary mb-4">coffee</span>
                    <h3 className="text-xl font-extrabold mb-2">Gostou da ideia?</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 px-4">
                        O SIXFIX é gratuito para todos. Se você economizou ou fechou um bom negócio, considere pagar um café para nossa equipe.
                    </p>
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all active:scale-95">
                        <span className="material-icons text-xl mr-2">qr_code_2</span>
                        Botão do Café (R$ 2,00)
                    </button>
                    <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Contribuição voluntária via PIX</p>
                </div>
            </section>
        </div>
    );
};

export default SupportView;
