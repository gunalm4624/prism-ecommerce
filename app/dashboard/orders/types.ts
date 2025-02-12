export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  tracking_status: 'In Transit' | 'Delivered' | string;
  tracking_number: string;
  carrier: string;
  quantity: number;
  amount: number;
  created_at: string;
  items: OrderItem[];
  customer_email: string;
  customer_name: string;
  payment_id: string;
  payment_status: 'pending' | 'completed' | 'failed';
  shipping_address: Address;
  billing_address: Address;
  status: 'packing in progress' | 'shipped' | 'delivered';
  user_id: string;
} 