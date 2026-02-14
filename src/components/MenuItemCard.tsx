import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { MenuItemUI } from "@/types/ui";

interface MenuItemCardProps {
  item: MenuItemUI;
  onAddToCart: (item: MenuItemUI) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image || "/imagens/SanduicheTradicional.png"}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
          R$ {item.price.toFixed(2)}
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-card-foreground">
            {item.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
        <button
          onClick={() => onAddToCart(item)}
          className="shrink-0 rounded-full bg-primary p-2.5 text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
          aria-label={`Adicionar ${item.name} ao carrinho`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
