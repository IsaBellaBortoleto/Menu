export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  note?: string;
}

export const categories = [
  { id: "sanduiches", label: "Sanduíches", emoji: "🍔" },
  { id: "hotdogs", label: "Hot Dogs", emoji: "🌭" },
  { id: "pizzas", label: "Pizzas", emoji: "🍕" },
  { id: "milkshakes", label: "Milkshakes", emoji: "🥤" },
  { id: "bebidas", label: "Bebidas", emoji: "🧃" },
] as const;

export const useQuery: MenuItem[] = [
  // Sanduíches
  {
    id: "sanduiche-chicken",
    name: "Sanduíche Chicken",
    description: "Pão brioche, frango grelhado, alface, tomate e maionese especial.",
    price: 22.90,
    category: "sanduiches",
    image: "/imagens/SanduicheChicken.jpg",
  },
  {
    id: "sanduiche-fish",
    name: "Sanduíche Fish",
    description: "Pão ciabatta, filé de peixe empanado, molho tártaro e rúcula.",
    price: 25.90,
    category: "sanduiches",
    image: "/imagens/SanduicheFish.jpg",
  },
  {
    id: "sanduiche-tradicional",
    name: "Sanduíche Tradicional",
    description: "Pão francês, hambúrguer artesanal, queijo, alface e tomate.",
    price: 19.90,
    category: "sanduiches",
    image: "/imagens/SanduicheTradicional.jpg",
  },
  // Hot Dogs
  {
    id: "hotdog-tradicional",
    name: "Hot Dog Tradicional",
    description: "Pão normal, 2 salsichas, batata palha, mostarda, ketchup e vinagrete.",
    price: 14.90,
    category: "hotdogs",
    image: "https://images.unsplash.com/photo-1612392062126-21cc36e68787?w=400&h=300&fit=crop",
  },
  {
    id: "hotdog-frango",
    name: "Hot Dog de Frango",
    description: "Pão especial, salsicha de frango, milho, ervilha e molho rosé.",
    price: 16.90,
    category: "hotdogs",
    image: "https://images.unsplash.com/photo-1619740455993-9d701c35e5a1?w=400&h=300&fit=crop",
  },
  {
    id: "hotdog-nao-tradicional",
    name: "Hot Dog Não Tradicional",
    description: "Pão artesanal, salsicha gourmet, cheddar, bacon e cebola caramelizada.",
    price: 19.90,
    category: "hotdogs",
    image: "https://images.unsplash.com/photo-1496502249454-3fcf53a68a0c?w=400&h=300&fit=crop",
  },
  // Pizzas
  {
    id: "pizza-calabresa",
    name: "Pizza Calabresa",
    description: "Molho de tomate, mussarela, calabresa fatiada e cebola.",
    price: 39.90,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
  },
  {
    id: "pizza-frango",
    name: "Pizza de Frango",
    description: "Molho de tomate, mussarela, frango desfiado e catupiry.",
    price: 42.90,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  },
  {
    id: "pizza-ricota",
    name: "Pizza de Ricota",
    description: "Molho de tomate, mussarela, ricota fresca e manjericão.",
    price: 44.90,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
  },
  // Milkshakes
  {
    id: "milkshake-chocolatudo",
    name: "Milkshake Chocolatudo",
    description: "Leite, sorvete de chocolate, calda de chocolate e chantilly.",
    price: 18.90,
    category: "milkshakes",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
  },
  {
    id: "milkshake-kitkat",
    name: "Milkshake KitKat",
    description: "Leite, sorvete de baunilha, KitKat triturado e calda de chocolate.",
    price: 22.90,
    category: "milkshakes",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=300&fit=crop",
  },
  {
    id: "milkshake-moranguete",
    name: "Milkshake Moranguete",
    description: "Leite, sorvete de morango, morangos frescos e chantilly.",
    price: 19.90,
    category: "milkshakes",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=300&fit=crop",
  },
  // Bebidas
  {
    id: "guarana",
    name: "Guaraná",
    description: "Guaraná Antarctica gelado 350ml.",
    price: 6.90,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop",
  },
  {
    id: "coca-cola",
    name: "Coca-Cola",
    description: "Coca-Cola original gelada 350ml.",
    price: 6.90,
    category: "bebidas",
    image: "/imagens/CocaCola.jpg",
  },
  {
    id: "suco-vale",
    name: "Suco Del Valle",
    description: "Suco Del Valle sabores variados 300ml.",
    price: 7.90,
    category: "bebidas",
    image: "/imagens/SucoVale.webp",
  },
];
