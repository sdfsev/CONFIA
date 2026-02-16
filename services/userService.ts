import { db } from '../firebaseService';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  collection, 
  query, 
  where,
  Query,
  DocumentData
} from 'firebase/firestore';
import { Professional } from '../types';

// Obter dados do usuário
export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

// Atualizar perfil do usuário
export const updateUserProfile = async (uid: string, data: any) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

// Procurar profissionais por categoria
export const searchProfessionals = async (category: string): Promise<Professional[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('profile.category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Professional));
  } catch (error) {
    console.error('Erro ao procurar profissionais:', error);
    return [];
  }
};

// Procurar profissionais por localização
export const searchByLocation = async (location: string): Promise<Professional[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('profile.location', '==', location)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Professional));
  } catch (error) {
    console.error('Erro ao procurar por localização:', error);
    return [];
  }
};

// Obter todos os profissionais
export const getAllProfessionals = async (): Promise<Professional[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Professional));
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    return [];
  }
};

// Salvar resenha/avaliação
export const saveReview = async (userId: string, professionalId: string, review: any) => {
  try {
    const reviewRef = collection(db, 'reviews');
    await setDoc(doc(reviewRef), {
      userId,
      professionalId,
      ...review,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao salvar resenha:', error);
    throw error;
  }
};

// Obter resenhas de um profissional
export const getProfessionalReviews = async (professionalId: string) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('professionalId', '==', professionalId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Erro ao buscar resenhas:', error);
    return [];
  }
};
