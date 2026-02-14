import { useEffect, useState } from 'react';
import { fetchCategorias, criarPedido } from '@/data/api';

interface Categoria {
  id: number;
  nome: string;
  emoji: string;
  slug: string;
  itens: any[];
}

export function MenuExample() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Buscar categorias ao montar o componente
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        setLoading(true);
        const dados = await fetchCategorias();
        setCategorias(dados);
        setErro(null);
      } catch (error: any) {
        setErro(error.message || 'Erro ao carregar categorias');
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarCategorias();
  }, []);

  // Exemplo: Criar pedido
  const handleCriarPedido = async () => {
    try {
      const novoPedido = await criarPedido({
        nome_cliente: 'João',
        mesa: 1,
        total: 50.00,
        itens: [
          {
            item_menu: 1,
            quantidade: 2,
            observacao: 'Sem tomate',
          },
        ],
      });
      console.log('Pedido criado:', novoPedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (erro) return <div className="erro">{erro}</div>;

  return (
    <div className="menu-container">
      <h1>Cardápio Digital</h1>

      {categorias.map((categoria) => (
        <div key={categoria.id} className="categoria">
          <h2>
            {categoria.emoji} {categoria.nome}
          </h2>

          <div className="itens">
            {categoria.itens.map((item) => (
              <div key={item.id} className="item">
                <img src={item.imagem_url} alt={item.nome} />
                <h3>{item.nome}</h3>
                <p>{item.descricao}</p>
                <span className="preco">R$ {parseFloat(item.preco).toFixed(2)}</span>
                <button onClick={handleCriarPedido}>Adicionar ao Carrinho</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuExample;
