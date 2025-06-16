export interface OrderItem {
  laptopId: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
}
