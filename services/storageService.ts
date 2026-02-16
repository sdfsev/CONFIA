import { storage } from '../firebaseService';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload de arquivo para Firebase Storage
 * @param file - Arquivo a ser enviado
 * @param path - Caminho no storage (ex: "avatars/user123")
 * @returns URL pública do arquivo
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Criar referência do arquivo
    const fileRef = ref(storage, path);
    
    // Upload
    await uploadBytes(fileRef, file);
    
    // Obter URL pública
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
};

/**
 * Upload de avatar de usuário
 */
export const uploadAvatar = async (uid: string, file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `avatars/${uid}/${Date.now()}.${ext}`;
  return uploadFile(file, path);
};

/**
 * Upload de documentos (RG, CNH, etc)
 */
export const uploadDocument = async (uid: string, docType: string, file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `documents/${uid}/${docType}/${Date.now()}.${ext}`;
  return uploadFile(file, path);
};

/**
 * Upload de fotos do portfólio
 */
export const uploadPortfolioPhoto = async (uid: string, file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `portfolio/${uid}/${Date.now()}.${ext}`;
  return uploadFile(file, path);
};

/**
 * Deletar arquivo do Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw error;
  }
};

/**
 * Validar tamanho do arquivo (máx 5MB)
 */
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};

/**
 * Validar tipo de arquivo
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};
