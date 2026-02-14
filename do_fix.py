#!/usr/bin/env python
import os

path = r"D:\Bella\UTFPR\4.2_periodo\github\Menu\src\components\admin\OrdersManager.tsx"

new_content = '''import { useState } from "react";
import { Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import type { Pedido } from "@/types/api";
import { atualizarStatus } from "@/data/api";
import { toast } from "sonner";

interface OrdersManagerProps {
  orders: Pedido[];
  onUpdate: () => void;
}

const OrdersManager = ({ orders, onUpdate }: OrdersManagerProps) => {
  const [updating, setUpdating] = useState<number | null>(null);

  const handleStatusUpdate = async (pedidoId: number, novoStatus: string) => {
    setUpdating(pedidoId);
    try {
      await atualizarStatus(pedidoId, novoStatus);
      toast.success("Status atualizado com sucesso!");
      onUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-800",
      preparando: "bg-blue-100 text-blue-800",
      pronto: "bg-green-100 text-green-800",
      entregue: "bg-gray-100 text-gray-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.pendente;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gerenciar Pedidos</h2>
        <p className="text-muted-foreground mt-1">
          Visualize e atualize o status dos pedidos (UC008, UC009, UC010)
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Pedido #{order.id}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {order.nome_cliente} • Mesa {order.mesa}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.criado_em || "").toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    R$ {parseFloat(order.total).toFixed(2)}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="mb-4 space-y-2">
                {order.itens && order.itens.length > 0 ? (
                  order.itens.map((item, idx) => {
                    const precoUnitario = typeof item.preco_item === 'string'
                      ? parseFloat(item.preco_item)
                      : item.preco_item || 0;
                    return (
                      <div
                        key={idx}
                        className="flex justify-between text-sm bg-background p-2 rounded"
                      >
                        <span>
                          {item.quantidade}x {item.nome_item}
                        </span>
                        <span className="font-medium">
                          R$ {(item.quantidade * precoUnitario).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground italic">Sem itens registrados</p>
                )}
              </div>

              {/* Ações de Status */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusUpdate(order.id, "preparando")}
                  disabled={updating === order.id || order.status === "preparando"}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 text-sm"
                >
                  <Clock className="w-4 h-4" />
                  Preparando
                </button>
                <button
                  onClick={() => handleStatusUpdate(order.id, "pronto")}
                  disabled={updating === order.id || order.status === "pronto"}
                  className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Pronto
                </button>
                <button
                  onClick={() => handleStatusUpdate(order.id, "entregue")}
                  disabled={updating === order.id || order.status === "entregue"}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Entregue
                </button>
                <button
                  onClick={() => handleStatusUpdate(order.id, "cancelado")}
                  disabled={updating === order.id || order.status === "cancelado"}
                  className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Cancelar
                </button>
              </div>

              {/* Observação do Cliente */}
              {order.itens?.some(item => item.observacao) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Observações:</p>
                      {order.itens.map((item, idx) =>
                        item.observacao ? (
                          <p key={idx} className="text-yellow-700">
                            • {item.observacao}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
'''

try:
    # Create backup
    with open(path, 'r', encoding='utf-8') as f:
        old_content = f.read()
    
    with open(path + '.bak', 'w', encoding='utf-8') as f:
        f.write(old_content)
    
    # Write new content
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("SUCCESS: OrdersManager.tsx foi atualizado com sucesso!")
    print(f"Backup salvo em: {path}.bak")
except Exception as e:
    print(f"ERROR: {str(e)}")
    print(f"Path: {path}")
