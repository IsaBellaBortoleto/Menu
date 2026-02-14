import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import MenuHeader from "@/components/MenuHeader";
import CategoryNav from "@/components/CategoryNav";
import MenuItemCard from "@/components/MenuItemCard";
import Cart from "@/components/Cart";
import { fetchCategorias, fetchItens, criarPedido } from "@/data/api";
import { imageMap } from "@/data/imageMap";
import type { CategoryUI, MenuItemUI, CartItemUI } from "@/types/ui";

const Index = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryUI[]>([]);
  const [items, setItems] = useState<MenuItemUI[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItemUI[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriasApi, itensApi] = await Promise.all([
          fetchCategorias(),
          fetchItens(),
        ]);

        const categoryList: CategoryUI[] = categoriasApi.map((c) => ({
          id: c.slug,
          label: c.nome,
          emoji: c.emoji || "",
        }));
        setCategories(categoryList);

        if (categoryList.length > 0) {
          setActiveCategory((prev) => prev || categoryList[0].id);
        }

        const itemsUi: MenuItemUI[] = itensApi.map((i) => ({
          id: i.id,
          name: i.nome,
          description: i.descricao,
          price: parseFloat(i.preco),
          category: i.categoria_slug || "outros",
          image: imageMap[i.nome] || i.imagem_url || "",
        }));
        setItems(itemsUi);
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
        toast.error("Erro ao carregar cardápio. Verifique o servidor.");
      }
    };

    loadData();
  }, []);

  const filteredItems = activeCategory
    ? items.filter((i) => i.category === activeCategory)
    : items;

  const handleCategoryChange = useCallback((id: string) => {
    setActiveCategory(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const addToCart = useCallback((item: MenuItemUI) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} adicionado!`, { duration: 1500 });
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateNote = useCallback((id: number, note: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, note } : i))
    );
  }, []);

  const finalize = useCallback(async (mesa: number, nome: string) => {
    try {
      const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
      await criarPedido({
        nome_cliente: nome,
        mesa,
        total,
        itens: cartItems.map((i) => ({
          item_menu: i.id,
          quantidade: i.quantity,
          observacao: i.note || "",
        })),
      });

      toast.success(
        `Pedido enviado! Mesa ${mesa}, ${nome}. Total: R$ ${total.toFixed(2)}`,
        { duration: 3000 }
      );
      setCartItems([]);
      setCartOpen(false);
      
      // Redireciona para página de pedidos após 1 segundo
      setTimeout(() => {
        navigate('/pedidos');
      }, 1000);
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      toast.error("Erro ao enviar pedido. Tente novamente.");
    }
  }, [cartItems, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <MenuHeader />

      <div className="flex flex-1">
        <div className="flex-1">
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <main className="container mx-auto px-4 py-8">
            <div
              ref={(el) => { sectionRefs.current[activeCategory] = el; }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Desktop cart sidebar */}
        <div className="hidden w-[360px] shrink-0 md:block">
          <Cart
            items={cartItems}
            isOpen={cartOpen}
            onToggle={() => setCartOpen(!cartOpen)}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
            onUpdateNote={updateNote}
            onFinalize={finalize}
          />
        </div>
      </div>

      {/* Mobile cart */}
      <div className="md:hidden">
        <Cart
          items={cartItems}
          isOpen={cartOpen}
          onToggle={() => setCartOpen(!cartOpen)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onUpdateNote={updateNote}
          onFinalize={finalize}
        />
      </div>
    </div>
  );
};

export default Index;
