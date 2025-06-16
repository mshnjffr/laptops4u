export interface Laptop {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  description: string;
  specifications: {
    processor: string;
    memory: string;
    storage: string;
    display: string;
    graphics: string;
    os: string;
  };
  images: string[];
  inStock: boolean;
  category: string;
}
