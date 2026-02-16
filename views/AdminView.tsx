import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseService';
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

interface ProfessionalRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const AdminView: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ProfessionalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<ProfessionalRequest | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const requestsRef = collection(db, 'professional_requests');
      const snapshot = await getDocs(requestsRef);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProfessionalRequest[];
      
      setRequests(data.sort((a, b) => 
        (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)
      ));
    } catch (error) {
      console.error('Erro ao carregar requisições:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: ProfessionalRequest) => {
    setProcessingId(request.id);
    try {
      // Atualizar status na requisição
      await updateDoc(doc(db, 'professional_requests', request.id), {
        status: 'approved'
      });

      // Atualizar status no perfil profissional
      await updateDoc(doc(db, 'professionals', request.userId), {
        status: 'active',
        trustLevel: 'VERIFIED'
      });

      alert(`✅ ${request.name} foi aprovado!`);
      loadRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('Erro ao aprovar profissional');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: ProfessionalRequest) => {
    const reason = window.prompt('Motivo da rejeição (opcional):');
    if (reason === null) return;

    setProcessingId(request.id);
    try {
      // Atualizar status na requisição
      await updateDoc(doc(db, 'professional_requests', request.id), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: Timestamp.now()
      });

      // Atualizar status no perfil profissional
      await updateDoc(doc(db, 'professionals', request.userId), {
        status: 'rejected',
        rejectionReason: reason
      });

      alert(`❌ ${request.name} foi rejeitado.`);
      loadRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      alert('Erro ao rejeitar profissional');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total de Requisições</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{requests.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Pendentes</p>
            <p className="text-3xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Aprovadas</p>
            <p className="text-3xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Rejeitadas</p>
            <p className="text-3xl font-bold text-red-600">
              {requests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : f === 'approved' ? 'Aprovadas' : 'Rejeitadas'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Carregando...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 text-center border border-slate-200 dark:border-slate-700">
            <span className="material-icons-round text-4xl text-slate-300 dark:text-slate-600 block mb-4">inbox</span>
            <p className="text-slate-600 dark:text-slate-400">Nenhuma requisição neste filtro</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-4 max-h-96 overflow-y-auto">
              {filteredRequests.map(request => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedRequest?.id === request.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{request.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{request.service}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{request.location}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                      request.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {request.status === 'pending' ? 'Pendente' : request.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail */}
            {selectedRequest && (
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedRequest.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enviado em {selectedRequest.createdAt?.toDate?.()?.toLocaleDateString?.('pt-BR')}
                    </p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</p>
                      <p className="text-slate-900 dark:text-white">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Telefone</p>
                      <p className="text-slate-900 dark:text-white">{selectedRequest.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Serviço</p>
                      <p className="text-slate-900 dark:text-white">{selectedRequest.service}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Localização</p>
                      <p className="text-slate-900 dark:text-white">{selectedRequest.location}</p>
                    </div>
                  </div>

                  {/* Document */}
                  {selectedRequest.documentUrl && (
                    <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4">
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Documento</p>
                      {selectedRequest.documentUrl.includes('image') || selectedRequest.documentUrl.endsWith('.png') || selectedRequest.documentUrl.endsWith('.jpg') || selectedRequest.documentUrl.endsWith('.jpeg') ? (
                        <img 
                          src={selectedRequest.documentUrl} 
                          alt="Documento" 
                          className="max-h-64 rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <a 
                          href={selectedRequest.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <span className="material-icons-round text-sm">download</span>
                          Ver Documento
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {selectedRequest.status === 'pending' && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleApprove(selectedRequest)}
                        disabled={processingId === selectedRequest.id}
                        className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span className="material-icons-round">check_circle</span>
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(selectedRequest)}
                        disabled={processingId === selectedRequest.id}
                        className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span className="material-icons-round">cancel</span>
                        Rejeitar
                      </button>
                    </div>
                  )}

                  {selectedRequest.status === 'approved' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✅ Profissional aprovado e ativo na plataforma
                      </p>
                    </div>
                  )}

                  {selectedRequest.status === 'rejected' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        ❌ Profissional rejeitado
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminView;
