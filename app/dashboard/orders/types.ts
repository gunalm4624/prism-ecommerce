export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'In Transit' | 'Delivered';
  trackingNumber: string;
  carrier: string;
} 