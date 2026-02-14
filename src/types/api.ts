// Tipos da API Django
export interface Categoria {
  id: number;
  nome: string;
  emoji?: string;
  slug: string;
}

export interface ItemMenu {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  categoria: number;
  categoria_slug?: string;
  imagem_url?: string;
}

export interface ItemPedido {
  id?: number;
  item_menu: number;
  item_nome?: string;
  quantidade: number;
  preco_unitario: string;
  observacao?: string;
}

export interface Pedido {
  id: number;
  nome_cliente: string;
  mesa: string;
  total: string;
  status: string;
  criado_em?: string;
  itens?: ItemPedido[];
  problema?: string;  // UC005: Campo para relatar problema
}

export interface PedidoCreate {
  nome_cliente: string;
  mesa: string;
  itens: {
    item_menu: number;
    quantidade: number;
    observacao?: string;
  }[];
}
