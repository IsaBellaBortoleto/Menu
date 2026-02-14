import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Minus, Plus, Trash2, MessageSquare } from "lucide-react";
import type { CartItemUI } from "@/types/ui";
import { useState } from "react";

interface CartProps {
  items: CartItemUI[];
  isOpen: boolean;
  onToggle: () => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
  onFinalize: (mesa: number, nome: string) => void;
}

const Cart = ({
  items,
  isOpen,
  onToggle,
  onUpdateQuantity,
  onRemove,
  onUpdateNote,
  onFinalize,
}: CartProps) => {
  const [mesa, setMesa] = useState("");
  const [nome, setNome] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleFinalize = () => {
    const mesaNum = parseInt(mesa);
    if (!mesaNum || mesaNum < 1 || mesaNum > 20 || !nome.trim()) return;
    onFinalize(mesaNum, nome.trim());
    setMesa("");
    setNome("");
  };

  const startEditNote = (item: CartItemUI) => {
    setEditingNoteId(item.id);
    setNoteText(item.note || "");
  };

  const saveNote = (id: string) => {
    onUpdateNote(id, noteText);
    setEditingNoteId(null);
    setNoteText("");
  };

  return (
    <>
      {/* Floating cart button */}
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 font-semibold text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95 md:hidden"
        whileTap={{ scale: 0.9 }}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            {itemCount}
          </span>
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Cart panel */}
      <motion.aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-2xl transition-transform md:sticky md:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Seu Carrinho</h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={onToggle} className="rounded-lg p-1.5 hover:bg-muted md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart className="mb-3 h-12 w-12 opacity-30" />
              <p className="text-sm">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-sm">{item.name}</p>
                        <p className="text-sm text-primary font-bold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="rounded-md border border-border p-1 hover:bg-muted"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="rounded-md border border-border p-1 hover:bg-muted"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="ml-1 rounded-md p-1 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {item.note && editingNoteId !== item.id && (
                      <p className="mt-2 rounded-lg bg-muted px-2 py-1 text-xs italic text-muted-foreground">
                        📝 {item.note}
                      </p>
                    )}
                    {editingNoteId === item.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Ex: sem cebola, ponto da carne..."
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveNote(item.id)}
                            className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="rounded-lg border border-border px-3 py-1 text-xs"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditNote(item)}
                        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <MessageSquare className="h-3 w-3" />
                        {item.note ? "Editar nota" : "Adicionar nota"}
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
            <input
              type="number"
              min={1}
              max={20}
              placeholder="Nº da mesa (1-20)"
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder="Seu nome"
              maxLength={50}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleFinalize}
              disabled={!mesa || !nome.trim() || parseInt(mesa) < 1 || parseInt(mesa) > 20}
              className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Cart;
