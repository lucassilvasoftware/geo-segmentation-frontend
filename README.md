# GeoSegment AI

Sistema de segmentação semântica de imagens aéreas usando Deep Learning.

## 🚀 Visão Geral

GeoSegment AI é uma aplicação web para segmentação semântica de imagens aéreas e de satélite. O sistema permite fazer upload de imagens e visualizar a segmentação automática gerada por modelos de Deep Learning.

## 🛠️ Tecnologias

### Frontend
- **React** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Lovable Cloud** (Supabase) para backend

### Backend de Segmentação
- **FastAPI** (Python)
- Modelo de Deep Learning para segmentação semântica

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn
- Backend FastAPI rodando (veja seção de configuração)

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
# URL do backend de segmentação
# Em desenvolvimento local:
VITE_API_BASE_URL=http://localhost:8000

# Em produção, substitua pela URL do seu backend deployado:
# VITE_API_BASE_URL=https://seu-backend.com
```

### 2. Backend FastAPI

O frontend espera que o backend FastAPI exponha as seguintes rotas:

#### `GET /health`
Verifica se o serviço está disponível.

**Resposta:**
```json
{
  "status": "ok"
}
```

#### `GET /info`
Retorna informações sobre o modelo de segmentação.

**Resposta:**
```json
{
  "model_name": "Nome do Modelo",
  "version": "1.0.0"
}
```

#### `POST /segment`
Recebe uma imagem e retorna a máscara segmentada.

**Request:**
- Content-Type: `multipart/form-data`
- Campo: `file` (imagem)

**Response:**
- Content-Type: `image/png`
- Body: Imagem PNG binária com a segmentação colorida

**Importante:** O backend deve retornar a imagem segmentada diretamente como resposta binária, sem salvar em disco.

### 3. Instalação e Execução

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🎯 Como Usar

1. **Certifique-se que o backend está rodando**
   - O frontend faz um health check automático ao carregar
   - Se o backend estiver offline, você verá um alerta

2. **Faça upload de uma imagem**
   - Clique na área de upload ou arraste uma imagem
   - Formatos aceitos: JPG, PNG, TIFF, etc.

3. **Processe a segmentação**
   - Clique em "Processar Segmentação"
   - Aguarde o processamento (pode levar alguns segundos)

4. **Visualize os resultados**
   - Compare a imagem original com a segmentação
   - Visualize as métricas e classes detectadas
   - Exporte os resultados se necessário

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── ImageUpload.tsx # Upload de imagens
│   ├── ResultsViewer.tsx # Visualização de resultados
│   ├── ClassLegend.tsx # Legenda das classes
│   └── AccuracyDisplay.tsx # Métricas de precisão
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Página principal de segmentação
│   └── About.tsx       # Página sobre o projeto
├── services/           # Serviços e integrações
│   └── segmentService.ts # API de segmentação
├── index.css           # Estilos globais e design tokens
└── App.tsx             # Componente raiz
```

## 🎨 Design System

O projeto usa um design system baseado em tokens CSS customizáveis em `src/index.css`:

- **Cores temáticas**: geo-blue, geo-green, geo-orange
- **Modo escuro/claro**: Suporte completo
- **Componentes responsivos**: Mobile-first

## 🚀 Deploy

### Frontend

O frontend pode ser deployado em qualquer serviço de hospedagem estática:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Deploy da pasta `dist/`** em:
   - Vercel
   - Netlify
   - GitHub Pages
   - Lovable Cloud (deploy automático)

### Backend

Certifique-se de atualizar `VITE_API_BASE_URL` com a URL do seu backend em produção.

## 🔐 CORS

O backend FastAPI deve estar configurado para aceitar requisições do domínio do frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://seu-frontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Classes de Segmentação

O projeto está pré-configurado com as seguintes classes:

1. Vegetação Densa
2. Vegetação Esparsa
3. Solo Exposto
4. Área Urbana
5. Corpo d'água
6. Estrada
7. Agricultura
8. Sombra/Nuvem

(As classes podem ser customizadas de acordo com o modelo de segmentação usado)

## 🐛 Troubleshooting

### Backend não conecta
- Verifique se `VITE_API_BASE_URL` está configurado corretamente
- Confirme que o backend está rodando: `curl http://localhost:8000/health`
- Verifique as configurações de CORS no backend

### Erro ao fazer upload
- Verifique o tamanho máximo permitido pelo backend
- Confirme que o formato da imagem é suportado
- Veja os logs do console do navegador para detalhes

### Imagem segmentada não aparece
- Verifique se o backend está retornando `Content-Type: image/png`
- Confirme que a resposta é um blob binário válido
- Veja os logs de rede no DevTools do navegador

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## Project info (Lovable)

**URL**: https://lovable.dev/projects/b1f2d2e8-2229-43d0-a3bb-5e2d6027f97a

### How to edit via Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/b1f2d2e8-2229-43d0-a3bb-5e2d6027f97a) and start prompting.

### Deploy via Lovable

Open [Lovable](https://lovable.dev/projects/b1f2d2e8-2229-43d0-a3bb-5e2d6027f97a) and click on Share -> Publish.
