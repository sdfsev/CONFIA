# 🚀 Firebase Storage - Quick Start

## ⚡ 3 Passos Rápidos para Começar

### PASSO 1: Habilitar Storage

```
1. Firebase Console → storage
2. Clique em "Começar" 
3. Localização: us-central1
4. Clique em "Criar"
```

### PASSO 2: Copiar Regras de Segurança

Cole no Firebase Console (Storage → Rules):

```firestore
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /documents/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    match /portfolio/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /temp/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### PASSO 3: Usar no Código

```typescript
import { uploadAvatar } from './services/storageService';
import FileUpload from './components/FileUpload';

// Componente
<FileUpload
  onUploadSuccess={(url) => console.log(url)}
  maxSizeMB={5}
/>
```

---

## ✅ Está tudo pronto!

**Arquivos já criados:**
- ✅ `storageService.ts` - Serviço de upload
- ✅ `FileUpload.tsx` - Componente reutilizável
- ✅ `OnboardingView.tsx` - Integrado

**Próximo:** Apenas habilitar Storage no Firebase Console

---

## 📊 Limites Gratuitos

- **5 GB** de armazenamento
- **1 GB/dia** de downloads
- **Ilimitado** de uploads
- **20k requisições/dia** gratuitas

**= Suficiente para MVP + 1000+ usuários**

---

## 🎯 Teste Agora

```bash
npm run dev
# Vá para onboarding
# Teste upload de foto
```

🎉 **Pronto!**
