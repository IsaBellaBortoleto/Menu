import { useState } from "react";
import { Clock, CheckCircle, XCircle, MessageSquare, AlertCircle } from "lucide-react";
import type { Pedido } from "@/types/api";
import { atualizarStatus, deletarPedido } from "@/data/api";
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

  const handleCancelOrder = async (pedidoId: number) => {
    setUpdating(pedidoId);
    try {
      await deletarPedido(pedidoId);
      toast.success("Pedido cancelado e removido!");
      onUpdate();
    } catch (error) {
      toast.error("Erro ao cancelar pedido");
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
                {order.itens?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm bg-background p-2 rounded"
                  >
                    <span>
                      {item.quantidade}x {item.nome_item}
                    </span>
                    <span className="font-medium">
                      R$ {(item.quantidade * parseFloat(item.preco_item)).toFixed(2)}
                    </span>
                  </div>
                ))}
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
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={updating === order.id}
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

              {/* UC005: Problema Relatado pelo Cliente */}
              {order.problema && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 mb-1">⚠️ Problema Relatado:</p>
                      <p className="text-red-700">{order.problema}</p>
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
