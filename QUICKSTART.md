# 🚀 QUICKSTART - Comece Agora em 5 Minutos

## ⏱️ Tempo Total: 5 minutos

---

## ✅ Pré-requisitos

- Python 3.8+
- Node.js/npm
- Terminal/Prompt de comando

---

## 🎯 Passo 1: Iniciar Backend (1 min)

### Terminal 1
```bash
cd Menu
python manage.py runserver
```

**Esperado:**
```
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.
```

✅ **Backend rodando em**: `http://localhost:8000/api`

---

## 🎯 Passo 2: Iniciar Frontend (2 min)

### Terminal 2
```bash
cd Menu
npm run dev
```

**Esperado:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

✅ **Frontend rodando em**: `http://localhost:5173` (ou a porta indicada)

---

## 🎯 Passo 3: Testar (1 min)

### Terminal 3
```bash
cd Menu
python teste_api.py
```

**Esperado:**
```
[✓ PASSOU] Conexão com servidor
[✓ PASSOU] GET /api/categorias/
[✓ PASSOU] GET /api/itens/
[✓ PASSOU] POST /api/pedidos/
```

✅ **Todos os testes passando!**

---

## 🎯 Passo 4: Usar no React (1 min)

### No seu componente
```typescript
import { fetchCategorias } from '@/data/api';

export function App() {
  useEffect(() => {
    fetchCategorias().then(console.log);
  }, []);

  // ...seu código
}
```

✅ **Funcionando!**

---

## 📊 Arquitetura em 10 segundos

```
Frontend (React)           Backend (Django)
  localhost:3000      →      localhost:8000
   
  api.ts              →      /api/categorias/
  (fetch)             →      /api/itens/
                      →      /api/pedidos/
                      →      SQLite DB
```

---

## 🔗 Links Úteis

- Frontend: `http://localhost:3000` (ou 5173)
- Backend API: `http://localhost:8000/api`
- Admin Django: `http://localhost:8000/admin`
- Dados: `db.sqlite3`

---

## 📚 Documentação Rápida

| Você quer... | Comando | Arquivo |
|-------------|---------|---------|
| Ver tudo | `python teste_api.py` | - |
| Docs completo | Leia | [INDICE.md](INDICE.md) |
| API reference | Leia | [REFERENCE_ENDPOINTS.md](REFERENCE_ENDPOINTS.md) |
| Troubleshooting | Leia | [ANTES_E_DEPOIS.md](ANTES_E_DEPOIS.md) |

---

## ✨ 8 Funções Disponíveis

```typescript
import { 
  fetchCategorias,        // GET /api/categorias/
  fetchItens,             // GET /api/itens/
  criarPedido,            // POST /api/pedidos/
  fetchPedidos,           // GET /api/pedidos/
  fetchPedidoById,        // GET /api/pedidos/{id}/
  atualizarStatus,        // PATCH /api/pedidos/{id}/status/
  atualizarPedido,        // PUT /api/pedidos/{id}/
  deletarPedido           // DELETE /api/pedidos/{id}/
} from '@/data/api';
```

---

## 💡 Exemplo Rápido

```typescript
// 1. Carregar cardápio
const categorias = await fetchCategorias();

// 2. Criar pedido
const pedido = await criarPedido({
  nome_cliente: 'João',
  mesa: 1,
  total: 50.00,
  itens: [{ item_menu: 1, quantidade: 2 }]
});

// 3. Atualizar status
await atualizarStatus(pedido.id, 'preparando');

console.log('Pedido #' + pedido.id + ' criado!');
```

---

## 🧪 Teste Rápido com cURL

```bash
# Listar categorias
curl http://localhost:8000/api/categorias/

# Listar itens
curl http://localhost:8000/api/itens/

# Criar pedido
curl -X POST http://localhost:8000/api/pedidos/ \
  -H "Content-Type: application/json" \
  -d '{"nome_cliente":"Teste","mesa":1,"total":50,"itens":[{"item_menu":1,"quantidade":1}]}'
```

---

## ❓ Precisa de Ajuda?

### Erro: "CORS policy error"
✅ Verifique se Django está rodando

### Erro: "Cannot GET /api/..."
✅ Verifique URL completa (ex: `http://localhost:8000/api/categorias/`)

### Banco vazio?
✅ `python populate_db.py`

### Mais ajuda?
👉 [ANTES_E_DEPOIS.md](ANTES_E_DEPOIS.md)

---

## ✅ Checklist Rápido

- [ ] Terminal 1: Django rodando
- [ ] Terminal 2: Frontend rodando
- [ ] Terminal 3: `python teste_api.py` passou
- [ ] Pode usar `fetchCategorias()` no React

---

## 🎉 Pronto!

A integração está funcionando! Agora você pode:

✅ Usar `fetchCategorias()` para carregar o menu  
✅ Usar `criarPedido()` para criar pedidos  
✅ Usar `atualizarStatus()` para atualizar status  
✅ Usar as outras 5 funções conforme necessário  

---

## 📖 Próximos Passos

1. 📖 Leia [README_INTEGRACAO.md](README_INTEGRACAO.md)
2. 🔍 Consulte [REFERENCE_ENDPOINTS.md](REFERENCE_ENDPOINTS.md)
3. 💻 Integre nos seus componentes
4. 🚀 Deploy em produção

---

## 🎯 Status

```
🟢 Backend: OK
🟢 Frontend: OK  
🟢 Database: OK
🟢 CORS: OK
🟢 Tests: OK

✅ PRONTO PARA USAR!
```

---

**Data**: 13 de Fevereiro, 2026  
**Versão**: 1.0 - Ready to Go  
**Status**: 🟢 Production Ready

Divirta-se desenvolvendo! 🚀
