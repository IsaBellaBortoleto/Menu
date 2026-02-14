import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPedidos, relatarProblema } from '@/data/api';
import type { Pedido } from '@/types/api';
import { toast } from 'sonner';
import { AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * UC005: Relatar problema com o pedido
 * Página onde o cliente pode visualizar seus pedidos e relatar problemas
 */
export default function CustomerOrders() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null);
  const [relatandoProblema, setRelatandoProblema] = useState<number | null>(null);
  const [textoProblema, setTextoProblema] = useState('');
  const [enviandoProblema, setEnviandoProblema] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await fetchPedidos();
      // Ordenar por data de criação (mais recentes primeiro)
      const ordenados = data.sort((a, b) => 
        new Date(b.criado_em || '').getTime() - new Date(a.criado_em || '').getTime()
      );
      setPedidos(ordenados);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRelatarProblema = async (pedidoId: number) => {
    // RN001: Campo obrigatório
    if (!textoProblema.trim()) {
      toast.error('Preencha o campo');
      return;
    }

    try {
      setEnviandoProblema(true);
      await relatarProblema(pedidoId, textoProblema);
      toast.success('Problema relatado com sucesso!');
      setRelatandoProblema(null);
      setTextoProblema('');
      await carregarPedidos(); // Recarregar para mostrar o problema registrado
    } catch (error: any) {
      toast.error(error?.data?.erro || 'Erro ao relatar problema');
      console.error(error);
    } finally {
      setEnviandoProblema(false);
    }
  };

  const getStatusColor = (status: string) => {
    const cores: Record<string, string> = {
      pendente: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      preparando: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      pronto: 'bg-green-500/10 text-green-500 border-green-500/20',
      entregue: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return cores[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      preparando: 'Em Preparo',
      pronto: 'Pronto',
      entregue: 'Entregue',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meus Pedidos</h1>
            <p className="text-muted-foreground mt-1">Acompanhe o status dos seus pedidos</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar ao Cardápio
          </button>
        </div>

        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum pedido encontrado</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Fazer Pedido
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {/* Cabeçalho do Pedido */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Pedido #{pedido.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pedido.status)}`}>
                        {getStatusLabel(pedido.status)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Cliente: {pedido.nome_cliente}</p>
                      <p>Mesa: {pedido.mesa}</p>
                      <p>Total: R$ {parseFloat(pedido.total).toFixed(2)}</p>
                      {pedido.criado_em && (
                        <p>Data: {new Date(pedido.criado_em).toLocaleString('pt-BR')}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    {expandedPedido === pedido.id ? (
                      <ChevronUp className="w-5 h-5 text-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-foreground" />
                    )}
                  </button>
                </div>

                {/* Detalhes do Pedido (Expandível) */}
                {expandedPedido === pedido.id && (
                  <div className="border-t border-border p-4 bg-background/50">
                    {pedido.itens && pedido.itens.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2">Itens do Pedido:</h4>
                        <div className="space-y-2">
                          {pedido.itens.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.quantidade}x {item.nome_item || `Item #${item.item_menu}`}
                                {item.observacao && (
                                  <span className="text-xs italic"> ({item.observacao})</span>
                                )}
                              </span>
                              <span className="text-foreground font-medium">
                                R$ {parseFloat(item.preco_item).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mostrar problema se já foi relatado */}
                    {pedido.problema && (
                      <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">Problema Relatado:</p>
                            <p className="text-sm text-muted-foreground mt-1">{pedido.problema}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botão para relatar problema (se ainda não foi relatado) */}
                    {!pedido.problema && relatandoProblema !== pedido.id && (
                      <button
                        onClick={() => setRelatandoProblema(pedido.id)}
                        className="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 border border-yellow-500/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Relatar Problema
                      </button>
                    )}

                    {/* Formulário para relatar problema */}
                    {relatandoProblema === pedido.id && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Descreva o problema:
                          </label>
                          <textarea
                            value={textoProblema}
                            onChange={(e) => setTextoProblema(e.target.value)}
                            placeholder="Digite aqui o problema com seu pedido..."
                            rows={4}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setRelatandoProblema(null);
                              setTextoProblema('');
                            }}
                            disabled={enviandoProblema}
                            className="flex-1 px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-background/80 transition-colors disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleRelatarProblema(pedido.id)}
                            disabled={enviandoProblema}
                            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                          >
                            {enviandoProblema ? 'Enviando...' : 'Enviar Problema'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
