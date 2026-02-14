import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, TrendingUp, Clock, DollarSign, Edit, Eye, CheckCircle } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { fetchItens, fetchPedidos } from "@/data/api";
import type { ItemMenu, Pedido } from "@/types/api";
import ItemsManager from "@/components/admin/ItemsManager";
import OrdersManager from "@/components/admin/OrdersManager";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "items" | "orders">("dashboard");
  const [items, setItems] = useState<ItemMenu[]>([]);
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todaySales: 0,
    avgTime: 0,
    monthRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log("Carregando dados da API...");
      const [itemsData, ordersData] = await Promise.all([
        fetchItens(),
        fetchPedidos(),
      ]);
      
      console.log("Itens recebidos:", itemsData);
      console.log("Pedidos recebidos:", ordersData);
      
      setItems(itemsData);
      setOrders(ordersData);
      
      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = ordersData.filter(o => o.criado_em?.startsWith(today));
      const todaySales = todayOrders.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0);
      
      setStats({
        totalOrders: ordersData.length,
        todaySales,
        avgTime: 18,
        monthRevenue: ordersData.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0),
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      // Mostrar dados vazios em caso de erro
      setItems([]);
      setOrders([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Painel Administrativo
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gerencie seu cardápio e pedidos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Ver Cardápio
              </a>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "dashboard"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
              {activeTab === "dashboard" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "items"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Itens do Cardápio
              {activeTab === "items" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "orders"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pedidos
              {activeTab === "orders" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Pedidos</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vendas Hoje</p>
                      <p className="text-2xl font-bold text-foreground">R$ {stats.todaySales.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      <p className="text-2xl font-bold text-foreground">{stats.avgTime} min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Receita Total</p>
                      <p className="text-2xl font-bold text-foreground">R$ {stats.monthRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveTab("items")}
                  className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 group-hover:bg-primary/20 rounded-lg transition-colors">
                      <Edit className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Gerenciar Itens</h3>
                      <p className="text-sm text-muted-foreground">Adicionar ou editar produtos</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 group-hover:bg-accent/20 rounded-lg transition-colors">
                      <Eye className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Ver Pedidos</h3>
                      <p className="text-sm text-muted-foreground">Acompanhar pedidos ativos</p>
                    </div>
                  </div>
                </button>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Sistema Ativo</h3>
                      <p className="text-sm text-muted-foreground">Tudo funcionando</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "items" && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ItemsManager items={items} onUpdate={loadData} />
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OrdersManager orders={orders} onUpdate={loadData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
