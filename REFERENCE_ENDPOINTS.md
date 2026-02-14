# 🌐 ENDPOINTS API - REFERÊNCIA RÁPIDA

## 📍 Base URL
```
http://localhost:8000/api
```

---

## 📚 Categorias

### GET /api/categorias/
**Retorna todas as categorias com seus itens**

```bash
curl http://localhost:8000/api/categorias/
```

**Response:**
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
        "imagem_url": "https://via.placeholder.com/300x200?text=Hot+Dog"
      },
      ...
    ]
  },
  ...
]
```

---

## 🍽️ Itens

### GET /api/itens/
**Retorna todos os itens do cardápio**

```bash
curl http://localhost:8000/api/itens/
```

### GET /api/itens/?categoria=sanduiches
**Retorna itens de uma categoria específica**

```bash
curl "http://localhost:8000/api/itens/?categoria=sanduiches"
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Hot Dog Tradicional",
    "descricao": "Pão quente, salsicha, milho e batata palha",
    "preco": "15.00",
    "categoria": 1,
    "imagem_url": "https://..."
  },
  ...
]
```

---

## 🛒 Pedidos

### GET /api/pedidos/
**Retorna todos os pedidos**

```bash
curl http://localhost:8000/api/pedidos/
```

**Response:**
```json
[
  {
    "id": 1,
    "nome_cliente": "João Silva",
    "mesa": 5,
    "total": "50.00",
    "status": "pendente",
    "criado_em": "2026-02-13T13:30:00Z",
    "itens": [...]
  },
  ...
]
```

---

### GET /api/pedidos/{id}/
**Retorna um pedido específico**

```bash
curl http://localhost:8000/api/pedidos/1/
```

**Response:**
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

### POST /api/pedidos/
**Cria um novo pedido**

```bash
curl -X POST http://localhost:8000/api/pedidos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome_cliente": "Maria Santos",
    "mesa": 3,
    "total": 75.00,
    "itens": [
      {
        "item_menu": 2,
        "quantidade": 1,
        "observacao": "Extra cebola"
      },
      {
        "item_menu": 5,
        "quantidade": 2,
        "observacao": ""
      }
    ]
  }'
```

**Request Body:**
```json
{
  "nome_cliente": "Maria Santos",      // string, requerido
  "mesa": 3,                            // integer, requerido
  "total": 75.00,                       // decimal, requerido
  "itens": [                            // array, requerido
    {
      "item_menu": 2,                   // integer, requerido (ID do item)
      "quantidade": 1,                  // integer, requerido
      "observacao": "Extra cebola"      // string, opcional
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nome_cliente": "Maria Santos",
  "mesa": 3,
  "total": "75.00",
  "status": "pendente",
  "criado_em": "2026-02-13T13:35:00Z",
  "itens": [
    {
      "id": 1,
      "item_menu": 2,
      "nome_item": "Pizza Calabresa",
      "preco_item": "35.00",
      "quantidade": 1,
      "observacao": "Extra cebola"
    },
    {
      "id": 2,
      "item_menu": 5,
      "nome_item": "Coca-Cola",
      "preco_item": "5.00",
      "quantidade": 2,
      "observacao": ""
    }
  ]
}
```

---

### PATCH /api/pedidos/{id}/status/
**Atualiza o status de um pedido**

```bash
curl -X PATCH http://localhost:8000/api/pedidos/1/status/ \
  -H "Content-Type: application/json" \
  -d '{"status": "preparando"}'
```

**Request Body:**
```json
{
  "status": "preparando"  // string, requerido
}
```

**Status Válidos:**
- `pendente` - Pedido recebido
- `preparando` - Em preparação
- `pronto` - Pronto para entrega
- `entregue` - Entregue ao cliente

**Response (200 OK):**
```json
{
  "id": 1,
  "nome_cliente": "Maria Santos",
  "mesa": 3,
  "total": "75.00",
  "status": "preparando",  // ✅ Atualizado
  "criado_em": "2026-02-13T13:35:00Z",
  "itens": [...]
}
```

---

### PUT /api/pedidos/{id}/
**Atualiza completamente um pedido**

```bash
curl -X PUT http://localhost:8000/api/pedidos/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome_cliente": "Maria Santos",
    "mesa": 4,
    "total": 80.00,
    "status": "preparando",
    "itens": [...]
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nome_cliente": "Maria Santos",
  "mesa": 4,  // ✅ Atualizado
  "total": "80.00",
  "status": "preparando",
  "criado_em": "2026-02-13T13:35:00Z",
  "itens": [...]
}
```

---

### DELETE /api/pedidos/{id}/
**Deleta um pedido**

```bash
curl -X DELETE http://localhost:8000/api/pedidos/1/
```

**Response (204 No Content):**
```
(vazio)
```

---

## 🧠 TypeScript / JavaScript

### Exemplo Completo

```typescript
import {
  fetchCategorias,
  fetchItens,
  criarPedido,
  fetchPedidos,
  fetchPedidoById,
  atualizarStatus,
  atualizarPedido,
  deletarPedido
} from '@/data/api';

// 1. Carregar categorias
const categorias = await fetchCategorias();
console.log(categorias);

// 2. Carregar itens
const itens = await fetchItens();
console.log(itens);

// 3. Carregar itens de uma categoria
const sanduiches = await fetchItens('sanduiches');
console.log(sanduiches);

// 4. Criar pedido
const novoPedido = await criarPedido({
  nome_cliente: 'João Silva',
  mesa: 1,
  total: 50.00,
  itens: [
    { item_menu: 1, quantidade: 2, observacao: 'Sem tomate' }
  ]
});
console.log('Pedido criado:', novoPedido.id);

// 5. Listar todos os pedidos
const pedidos = await fetchPedidos();
console.log(pedidos);

// 6. Buscar pedido específico
const pedido = await fetchPedidoById(1);
console.log(pedido);

// 7. Atualizar status
const pedidoAtualizado = await atualizarStatus(1, 'preparando');
console.log('Status:', pedidoAtualizado.status);

// 8. Atualizar pedido completo
const pedidoCompleto = await atualizarPedido(1, {
  nome_cliente: 'João Silva',
  mesa: 2,
  total: 55.00,
  status: 'pronto'
});
console.log(pedidoCompleto);

// 9. Deletar pedido
await deletarPedido(1);
console.log('Pedido deletado');
```

---

## ⚠️ Códigos HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Sucesso |
| 201 | Created - Criado com sucesso |
| 204 | No Content - Deletado com sucesso |
| 400 | Bad Request - Erro na requisição |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 🔒 Tratamento de Erro

```typescript
try {
  const categorias = await fetchCategorias();
} catch (error) {
  console.error('Erro:', error);
  // error.message: string
  // error.status: number (0 = conexão, 4xx = client, 5xx = server)
  // error.data: any (resposta do servidor)
}
```

---

## 📋 Exemplo Prático no React

```typescript
import { useState, useEffect } from 'react';
import { fetchCategorias, criarPedido } from '@/data/api';

export function PedidosApp() {
  const [categorias, setCategorias] = useState([]);
  const [pedido, setPedido] = useState({
    nome_cliente: '',
    mesa: 1,
    total: 0,
    itens: []
  });

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const dados = await fetchCategorias();
        setCategorias(dados);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    carregarCategorias();
  }, []);

  const handleCriarPedido = async () => {
    try {
      const novoPedido = await criarPedido(pedido);
      alert(`Pedido #${novoPedido.id} criado!`);
      setPedido({
        nome_cliente: '',
        mesa: 1,
        total: 0,
        itens: []
      });
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div>
      {/* seu componente aqui */}
    </div>
  );
}
```

---

## 🔗 Links Úteis

- Local: `http://localhost:8000/api`
- Admin: `http://localhost:8000/admin`
- Frontend: `http://localhost:3000`

---

## 📞 Suporte

Se encontrar erros, consulte:
1. `GUIA_TESTE.md` - Como testar
2. `ANTES_E_DEPOIS.md` - Erros comuns
3. `teste_api.py` - Script de diagnóstico
