import { Laptop } from './laptop.model';

export interface CartItem {
  laptop: Laptop;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}
