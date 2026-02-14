import typing
path = r"D:\Bella\UTFPR\4.2_periodo\github\Menu\src\data\api.ts"

content = '''// Importar tipos
import type { Categoria, ItemMenu, Pedido } from "@/types/api";

// API client para integração com backend Django
// URL base pode ser ajustada para ambiente de produção
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Interface de erro
interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Função auxiliar para requisições
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: `Erro ${response.status}: ${response.statusText}`,
        status: response.status,
        data: errorData,
      } as ApiError;
    }

    // Handle empty responses (e.g., 204 No Content or successful DELETE)
    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || (response.status === 200 && (!contentLength || contentLength === '0'))) {
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw {
        message: "Erro de conexão com o servidor. Verifique se o backend está rodando.",
        status: 0,
        data: error,
      } as ApiError;
    }
    throw error;
  }
}

// Buscar categorias com itens
export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    return await apiFetch<Categoria[]>("/categorias/");
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
}

// Buscar itens por categoria (opcional)
export async function fetchItens(categoria?: string): Promise<ItemMenu[]> {
  try {
    const url = categoria ? `/itens/?categoria=${categoria}` : "/itens/";
    return await apiFetch<ItemMenu[]>(url);
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    throw error;
  }
}

// Criar pedido
export async function criarPedido(pedido: {
  nome_cliente: string;
  mesa: number;
  total: number;
  itens: { item_menu: number; quantidade: number; observacao?: string }[];
}) {
  try {
    const payload = {
      nome_cliente: pedido.nome_cliente,
      mesa: pedido.mesa,
      total: pedido.total,
      itens: pedido.itens.map((item) => ({
        item_menu: item.item_menu,
        quantidade: item.quantidade,
        observacao: item.observacao || "",
      })),
    };

    return await apiFetch("/pedidos/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
}

// Listar pedidos
export async function fetchPedidos(): Promise<Pedido[]> {
  try {
    return await apiFetch<Pedido[]>("/pedidos/");
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    throw error;
  }
}

// Buscar pedido específico
export async function fetchPedidoById(id: number): Promise<Pedido> {
  try {
    return await apiFetch<Pedido>(`/pedidos/${id}/`);
  } catch (error) {
    console.error(`Erro ao buscar pedido ${id}:`, error);
    throw error;
  }
}

// Atualizar status do pedido
export async function atualizarStatus(id: number, status: string): Promise<Pedido> {
  try {
    const validStatuses = ["pendente", "preparando", "pronto", "entregue", "cancelado"];
    
    if (!validStatuses.includes(status)) {
      throw {
        message: `Status inválido. Deve ser um de: ${validStatuses.join(", ")}`,
        status: 400,
      } as ApiError;
    }

    return await apiFetch(`/pedidos/${id}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    console.error(`Erro ao atualizar status do pedido ${id}:`, error);
    throw error;
  }
}

// Atualizar pedido completo (método alternativo)
export async function atualizarPedido(id: number, data: any) {
  try {
    return await apiFetch(`/pedidos/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(`Erro ao atualizar pedido ${id}:`, error);
    throw error;
  }
}

// Deletar pedido
export async function deletarPedido(id: number) {
  try {
    return await apiFetch(`/pedidos/${id}/`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Erro ao deletar pedido ${id}:`, error);
    throw error;
  }
}
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ api.ts atualizado com sucesso!")
