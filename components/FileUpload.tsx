import React, { useRef, useState } from 'react';
import { uploadFile, validateFileSize, validateFileType } from '../services/storageService';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  icon?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Selecione um arquivo',
  icon = 'upload_file',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsLoading(true);

    try {
      // Validar tamanho
      if (!validateFileSize(file, maxSizeMB)) {
        throw new Error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      }

      // Validar tipo
      const allowedTypes = accept.includes('*') 
        ? ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        : accept.split(',').map(t => t.trim());
      
      if (!validateFileType(file, allowedTypes)) {
        throw new Error(`Tipo de arquivo não suportado`);
      }

      // Fazer upload
      const path = `temp/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      
      onUploadSuccess(url);
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao fazer upload';
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="w-full h-40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark flex flex-col items-center justify-center gap-3 text-slate-400 cursor-pointer hover:border-primary group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="material-icons-round animate-spin text-2xl">sync</span>
            <span className="text-sm font-bold">Enviando...</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-icons-round text-2xl">{icon}</span>
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
