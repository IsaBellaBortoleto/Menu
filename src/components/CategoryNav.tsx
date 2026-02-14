import { motion } from "framer-motion";
import type { CategoryUI } from "@/types/ui";

interface CategoryNavProps {
  categories: CategoryUI[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const CategoryNav = ({ categories, activeCategory, onCategoryChange }: CategoryNavProps) => {
  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
