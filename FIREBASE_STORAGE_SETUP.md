# Firebase Storage - Guia de Configuração Gratuita

## 📋 Pré-requisitos
- Projeto Firebase já criado
- Firebase Console acesso

---

## 🚀 PASSO 1: Habilitar Storage no Firebase Console

1. Abra [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto (`sixfix-3bbfd`)
3. No menu esquerdo, vá em **"Storage"**
4. Clique em **"Começar"** ou **"Criar bucket"**

### Configurações Recomendadas:
- **Localização**: `us-central1` (gratuito em qualquer lugar)
- **Classe de armazenamento**: `Standard` (padrão, gratuito)

---

## 🔒 PASSO 2: Configurar Regras de Segurança (GRATUITO)

### ⚠️ IMPORTANTE: Usar regras de desenvolvimento APENAS para testes!

No Firebase Console, vá para **Storage → Regras** e cole este código:

```firestore rules
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura pública de avatares
    match /avatars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.uid == request.resource.metadata.uid;
    }
    
    // Permitir upload de documentos apenas pelo próprio usuário
    match /documents/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId || request.auth.uid == 'admin_uid';
      allow write: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }
    
    // Permitir upload de portfolio apenas pelo próprio usuário
    match /portfolio/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }
    
    // Arquivos temporários (público)
    match /temp/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### ✅ Clique em "Publicar"

---

## 💰 Limites Gratuitos do Firebase Storage

| Item | Limite Gratuito |
|------|---|
| Armazenamento | 5 GB |
| Downloads | 1 GB/dia |
| Uploads | Ilimitado |
| Requisições | 20k/dia (gratuitas) |

**Total gratuito por mês:**
- ≈ 150-200 GB de downloads
- ≈ 5 GB armazenados
- **100% suficiente para MVP!**

---

## 🔧 PASSO 3: No seu código (já configurado!)

### Usar o serviço `storageService.ts`:

```typescript
import { uploadAvatar, uploadDocument, uploadPortfolioPhoto } from './services/storageService';

// Upload de avatar
const avatarUrl = await uploadAvatar(userId, file);

// Upload de documento
const docUrl = await uploadDocument(userId, 'rg', file);

// Upload de portfólio
const photoUrl = await uploadPortfolioPhoto(userId, file);
```

---

## 📱 PASSO 4: Usar o componente FileUpload

```tsx
import FileUpload from './components/FileUpload';

<FileUpload
  onUploadSuccess={(url) => {
    console.log('Upload bem-sucedido:', url);
    setImageUrl(url);
  }}
  onUploadError={(error) => {
    console.error('Erro:', error);
  }}
  accept="image/*"
  maxSizeMB={5}
  label="Selecione sua foto"
  icon="photo_camera"
/>
```

---

## ✨ Funcionalidades Já Implementadas

### `storageService.ts`:
- ✅ `uploadFile()` - Upload genérico
- ✅ `uploadAvatar()` - Fotos de perfil
- ✅ `uploadDocument()` - RG, CNH, etc
- ✅ `uploadPortfolioPhoto()` - Fotos de trabalho
- ✅ `deleteFile()` - Deletar arquivo
- ✅ `validateFileSize()` - Validar 5MB
- ✅ `validateFileType()` - Validar tipos

### `FileUpload.tsx`:
- ✅ Componente reutilizável
- ✅ Feedback de upload
- ✅ Validação de arquivo
- ✅ Tratamento de erros
- ✅ Loading animation

---

## 🎯 Implementação no OnboardingView

Para adicionar upload de foto no onboarding:

```tsx
import FileUpload from '../components/FileUpload';
import { uploadAvatar } from '../services/storageService';

// No seu componente:
const handleAvatarUpload = async (url: string) => {
  setUserProfile(prev => ({
    ...prev,
    avatar: url
  }));
};

// No JSX:
<FileUpload
  onUploadSuccess={handleAvatarUpload}
  accept="image/*"
  icon="photo_camera"
  label="Sua Foto"
/>
```

---

## 🔍 Monitorar uso no Firebase Console

1. Vá em **Storage**
2. Na aba **"Detalhes do firebase"** veja:
   - Armazenamento usado
   - Downloads do mês
   - Requisições

---

## ⚡ Dicas de Otimização (Gratuito)

### 1. Comprimir imagens antes do upload
```bash
npm install sharp
```

### 2. Usar WebP (menor tamanho)
```typescript
// Converter para WebP antes de upload
const canvas = document.createElement('canvas');
// ... converter imagem ...
canvas.toBlob(blob => uploadFile(blob, path), 'image/webp');
```

### 3. Limpar arquivos temporários
```typescript
// Deletar após usar
await deleteFile('temp/old_file');
```

---

## ❌ O que NÃO fazer (para não sair do gratuito)

- ❌ Não faça videos em HD (ocupa muito espaço)
- ❌ Não deixe uploads em `/temp` permanentemente
- ❌ Não faça download em massa (backup)
- ❌ Não deixe regras muito abertas (segurança)

---

## ✅ Checklist Final

- [ ] Storage habilitado no Firebase Console
- [ ] Regras de segurança configuradas
- [ ] `storageService.ts` importado
- [ ] `FileUpload.tsx` integrado no componente
- [ ] Testado upload de imagem
- [ ] Verificado URL pública
- [ ] Regra de segurança publicada

---

## 📞 Troubleshooting

### Erro: "Permission denied"
**Solução**: Verifique as regras de segurança e se o usuário está autenticado

### Erro: "File too large"
**Solução**: Máximo 5MB por arquivo. Comprimir antes de enviar

### Erro: "Unsupported file type"
**Solução**: Use apenas `image/*`, `application/pdf`, etc

### Arquivo envia mas não aparece
**Solução**: Verifique se está usando `getDownloadURL()` para gerar URL pública

---

## 🚀 Próximos Passos

1. Integrar upload de avatar no **OnboardingView**
2. Integrar upload de documentos (RG/CNH)
3. Integrar fotos do portfólio
4. Comprimir imagens automaticamente
5. Implementar cropping de fotos

---

**Documento criado**: Fevereiro 2026
**Última atualização**: Inclui Firebase Storage v9+
