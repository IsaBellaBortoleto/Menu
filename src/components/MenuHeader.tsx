import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MenuHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1" />
          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tight text-primary md:text-5xl">
                Menu
              </h1>
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                for Fastfood Burguer
              </p>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors shadow-lg shadow-primary/20"
              title="Login Administrativo"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default MenuHeader;
