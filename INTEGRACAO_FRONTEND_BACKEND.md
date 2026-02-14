# Integração Frontend Lovable ↔ Backend Django

## Arquitetura

```
┌─────────────────────────────────────┐
│   Frontend Lovable (React + Vite)   │
│   (Porta 3000 ou 8080)              │
│   src/data/api.ts                   │
└────────────────┬────────────────────┘
                 │
                 │ Requisições HTTP/FETCH
                 │ (JSON)
                 ↓
┌─────────────────────────────────────┐
│   Backend Django                    │
│   (Porta 8000)                      │
│   REST API com DRF                  │
│   - /api/categorias/                │
│   - /api/itens/                     │
│   - /api/pedidos/                   │
└─────────────────────────────────────┘
```

## Instalação e Configuração

### Backend Django

1. **Instale as dependências:**
```bash
pip install django djangorestframework django-cors-headers
```

2. **Verifique o settings.py:**
   - ✅ `rest_framework` está em `INSTALLED_APPS`
   - ✅ `corsheaders` está em `INSTALLED_APPS`
   - ✅ `corsheaders.middleware.CorsMiddleware` está no topo de `MIDDLEWARE`
   - ✅ `CORS_ALLOWED_ORIGINS` contém seu frontend (localhost:3000 ou seu domínio Lovable)

3. **Crie as migrações e o banco de dados:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Inicie o servidor Django:**
```bash
python manage.py runserver 0.0.0.0:8000
```

O servidor estará disponível em: `http://localhost:8000/api`

### Frontend Lovable

1. **Configure o arquivo .env:**
```
REACT_APP_API_URL=http://localhost:8000/api
```

2. **Use as funções do api.ts nos seus componentes:**

```typescript
import { fetchCategorias, criarPedido } from '@/data/api';

// Buscar categorias
const categorias = await fetchCategorias();

// Criar pedido
const novoPedido = await criarPedido({
  nome_cliente: "João",
  mesa: 1,
  total: 50.00,
  itens: [
    { item_menu: 1, quantidade: 2, observacao: "Sem tomate" }
  ]
});
```

## Endpoints da API

### GET /api/categorias/
Lista todas as categorias com seus itens
```json
[
  {
    "id": 1,
    "nome": "Sanduíches",
    "emoji": "🥪",
    "slug": "sanduiches",
    "itens": [
      {
        "id": 1,
        "nome": "Hot Dog Tradicional",
        "descricao": "Hot dog clássico",
        "preco": "15.00",
        "categoria": 1,
        "imagem_url": "https://..."
      }
    ]
  }
]
```

### GET /api/itens/
Lista todos os itens (com filtro opcional por categoria)
```
GET /api/itens/?categoria=sanduiches
```

### POST /api/pedidos/
Criar novo pedido
```json
{
  "nome_cliente": "João",
  "mesa": 1,
  "total": 50.00,
  "itens": [
    {
      "item_menu": 1,
      "quantidade": 2,
      "observacao": "Sem tomate"
    }
  ]
}
```

### GET /api/pedidos/
Lista todos os pedidos

### GET /api/pedidos/{id}/
Detalha um pedido específico

### PATCH /api/pedidos/{id}/status/
Atualiza o status do pedido
```json
{
  "status": "preparando"
}
```
Status válidos: `pendente`, `preparando`, `pronto`, `entregue`

## Troubleshooting

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Verifique se `corsheaders.middleware.CorsMiddleware` está **primeiro** em `MIDDLEWARE`
- Verifique se `CORS_ALLOWED_ORIGINS` contém a URL do seu frontend
- Reinicie o servidor Django

### Erro: "Erro de conexão com o servidor"
- Verifique se o Django está rodando em `http://localhost:8000`
- Verifique a URL em `.env`: `REACT_APP_API_URL=http://localhost:8000/api`
- Verifique o console do navegador para mais detalhes

### Erro: "404 Not Found"
- Verifique se as URLs estão corretas em `menu_app/urls.py`
- Verifique se `'menu_app'` está em `INSTALLED_APPS` no settings.py
- Execute `python manage.py migrate` se não tiver feito ainda

## Desenvolvimento

### Terminal 1 - Backend Django
```bash
cd /caminho/para/Menu
python manage.py runserver
```

### Terminal 2 - Frontend Lovable
```bash
cd /caminho/para/Menu
npm run dev
```

Acesse `http://localhost:3000` (ou a porta configurada no Vite)

## Produção

1. **Backend Django:**
   - Deploy em Railway, Heroku, ou seu servidor
   - Atualize `ALLOWED_HOSTS` com o domínio
   - Atualize `CORS_ALLOWED_ORIGINS` com o domínio do Lovable
   - Configure `DEBUG = False`

2. **Frontend Lovable:**
   - Atualize `.env` com a URL do backend em produção
   - Deploy no Lovable Cloud (padrão) ou vercel/netlify
