import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import type { ItemMenu } from "@/types/api";
import { toast } from "sonner";

interface ItemsManagerProps {
  items: ItemMenu[];
  onUpdate: () => void;
}

const ItemsManager = ({ items, onUpdate }: ItemsManagerProps) => {
  const [editingItem, setEditingItem] = useState<ItemMenu | null>(null);
  const [formData, setFormData] = useState<Partial<ItemMenu>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (item: ItemMenu) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      descricao: item.descricao,
      preco: item.preco,
      categoria: item.categoria,
      imagem_url: item.imagem_url,
    });
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsLoading(true);
    try {
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco,
        categoria: formData.categoria,
        imagem_url: formData.imagem_url,
      };

      const response = await fetch(`http://localhost:8000/api/itens/${editingItem.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Erro detalhado:", error);
        
        // Extract error message from Django response
        let errorMsg = "Erro ao atualizar item";
        if (error.detail) {
          errorMsg = error.detail;
        } else if (typeof error === 'object') {
          // Django validation errors come as {field: [errors]}
          const messages = Object.entries(error).map(([field, msgs]) => {
            const msgArray = Array.isArray(msgs) ? msgs : [msgs];
            return `${field}: ${msgArray.join(', ')}`;
          });
          errorMsg = messages.join('; ') || JSON.stringify(error);
        }
        
        throw new Error(errorMsg);
      }

      toast.success("Item atualizado com sucesso!");
      setEditingItem(null);
      onUpdate();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/itens/${itemId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar item");
      }

      toast.success("Item deletado com sucesso!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Itens do Cardápio</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie os produtos do seu cardápio (UC007)
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhum item cadastrado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors"
            >
              {item.imagem_url && (
                <img
                  src={item.imagem_url}
                  alt={item.nome}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{item.nome}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.descricao}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    R$ {parseFloat(item.preco).toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      disabled={isLoading}
                      className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Editar Item</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.nome || ""}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao || ""}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco || ""}
                  onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={formData.imagem_url || ""}
                  onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-background/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsManager;
