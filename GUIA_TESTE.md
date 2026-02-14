# 🧪 Guia de Teste da Integração

## Backend Django - Testando a API

### Método 1: Python + requests (recomendado)

```python
import requests

API_BASE = "http://localhost:8000/api"

# 1. Buscar categorias
print("=== Categorias ===")
response = requests.get(f"{API_BASE}/categorias/")
print(response.json())

# 2. Buscar itens
print("\n=== Itens ===")
response = requests.get(f"{API_BASE}/itens/")
print(response.json())

# 3. Criar pedido
print("\n=== Criar Pedido ===")
pedido_data = {
    "nome_cliente": "João Silva",
    "mesa": 5,
    "total": 50.00,
    "itens": [
        {
            "item_menu": 1,
            "quantidade": 2,
            "observacao": "Sem tomate"
        }
    ]
}
response = requests.post(f"{API_BASE}/pedidos/", json=pedido_data)
print(response.json())

# 4. Listar pedidos
print("\n=== Listar Pedidos ===")
response = requests.get(f"{API_BASE}/pedidos/")
print(response.json())

# 5. Atualizar status
print("\n=== Atualizar Status ===")
response = requests.patch(
    f"{API_BASE}/pedidos/1/status/",
    json={"status": "preparando"}
)
print(response.json())
```

**Para rodar:**
```bash
pip install requests
python teste_api.py
```

---

### Método 2: cURL (linha de comando)

```bash
# 1. Buscar categorias
curl http://localhost:8000/api/categorias/

# 2. Buscar itens
curl http://localhost:8000/api/itens/

# 3. Buscar itens de uma categoria específica
curl "http://localhost:8000/api/itens/?categoria=sanduiches"

# 4. Criar pedido
curl -X POST http://localhost:8000/api/pedidos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome_cliente": "Maria",
    "mesa": 3,
    "total": 75.00,
    "itens": [
      {"item_menu": 2, "quantidade": 1, "observacao": "Extra cebola"}
    ]
  }'

# 5. Listar pedidos
curl http://localhost:8000/api/pedidos/

# 6. Buscar pedido específico
curl http://localhost:8000/api/pedidos/1/

# 7. Atualizar status
curl -X PATCH http://localhost:8000/api/pedidos/1/status/ \
  -H "Content-Type: application/json" \
  -d '{"status": "pronto"}'
```

---

### Método 3: Frontend React (TypeScript)

No seu componente React, use o arquivo `src/data/api.ts`:

```typescript
import { fetchCategorias, criarPedido, atualizarStatus } from '@/data/api';

async function testar() {
  try {
    // 1. Buscar categorias
    const categorias = await fetchCategorias();
    console.log('Categorias:', categorias);

    // 2. Criar pedido
    const novoPedido = await criarPedido({
      nome_cliente: 'Pedro',
      mesa: 2,
      total: 60.00,
      itens: [
        { item_menu: 1, quantidade: 1, observacao: 'Normal' }
      ]
    });
    console.log('Pedido criado:', novoPedido);

    // 3. Atualizar status
    const pedidoAtualizado = await atualizarStatus(novoPedido.id, 'preparando');
    console.log('Status atualizado:', pedidoAtualizado);

  } catch (error) {
    console.error('Erro:', error);
  }
}

testar();
```

---

## Respostas Esperadas

### GET /api/categorias/
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
        "descricao": "Pão quente, salsicha, milho e batata palha",
        "preco": "15.00",
        "categoria": 1,
        "imagem_url": "https://via.placeholder.com/..."
      },
      ...
    ]
  },
  ...
]
```

### POST /api/pedidos/
```json
{
  "id": 1,
  "nome_cliente": "João Silva",
  "mesa": 5,
  "total": "50.00",
  "status": "pendente",
  "criado_em": "2026-02-13T13:30:00Z",
  "itens": [
    {
      "id": 1,
      "item_menu": 1,
      "nome_item": "Hot Dog Tradicional",
      "preco_item": "15.00",
      "quantidade": 2,
      "observacao": "Sem tomate"
    }
  ]
}
```

---

## Status Válidos do Pedido

```
pendente    → Estado inicial
preparando  → Pedido em preparação
pronto      → Pronto para entrega
entregue    → Entregue ao cliente
```

---

## Erros Comuns

### ❌ "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solução:**
1. Verifique se Django está rodando
2. Verifique se `corsheaders` está em `INSTALLED_APPS`
3. Verifique se `corsheaders.middleware.CorsMiddleware` está **primeiro** em `MIDDLEWARE`
4. Restart o Django

### ❌ "404 Not Found"
**Solução:**
1. Verifique a URL: deve ser `/api/...`
2. Verifique se `menu_app` está em `INSTALLED_APPS`
3. Verifique se `path('', include('menu_app.urls'))` está em `urls.py`

### ❌ "Erro de conexão com o servidor"
**Solução:**
1. Verifique se Django está rodando: `python manage.py runserver`
2. Verifique a porta: deve estar em 8000
3. Verifique a URL em `.env`: `REACT_APP_API_URL=http://localhost:8000/api`

### ❌ "Status inválido"
**Solução:**
Use apenas: `pendente`, `preparando`, `pronto`, `entregue`

---

## Ambiente de Desenvolvimento

### Terminal 1: Backend Django
```bash
cd Menu
python manage.py runserver
```

### Terminal 2: Frontend React (Vite)
```bash
cd Menu
npm run dev
```

### Terminal 3: Testes
```bash
cd Menu
python teste_api.py
```

---

## Checklist de Teste

- [ ] Django está rodando em http://localhost:8000
- [ ] GET /api/categorias/ retorna dados
- [ ] GET /api/itens/ retorna dados
- [ ] POST /api/pedidos/ cria pedido com sucesso
- [ ] GET /api/pedidos/ lista todos os pedidos
- [ ] PATCH /api/pedidos/{id}/status/ atualiza status
- [ ] Frontend carrega dados da API
- [ ] CORS não gera erros

**Status**: 🟢 **TUDO PRONTO PARA TESTAR**
