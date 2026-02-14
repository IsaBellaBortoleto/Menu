export interface CategoryUI {
  id: string;
  label: string;
  emoji: string;
}

export interface MenuItemUI {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItemUI extends MenuItemUI {
  quantity: number;
  note?: string;
}
