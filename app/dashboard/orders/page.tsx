"use client";

import { OrdersList } from './OrdersList';
import { NavbarDashboard } from '@/components/blocks/shadcnblocks-com-navbar-dashboard';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { Order } from './types';

// Move sample orders to a separate data file or fetch from API
const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    order_id: 'ORD001',
    product_id: 'PROD1',
    product_name: 'Product 1',
    product_image: '/product1.jpg',
    created_at: '2024-03-15',
    items: [
      { name: 'Product 1', quantity: 2, price: 29.99 },
      { name: 'Product 2', quantity: 1, price: 49.99 }
    ],
    status: 'shipped',
    tracking_status: 'In Transit',
    tracking_number: '1Z999AA1234567890',
    carrier: 'UPS',
    quantity: 3,
    amount: 109.97,
    customer_email: 'user@example.com',
    customer_name: 'John Doe',
    payment_id: 'PAY001',
    payment_status: 'completed',
    shipping_address: { street: '123 Main St', city: 'City', state: 'State', postal_code: '12345', country: 'Country' },
    billing_address: { street: '123 Main St', city: 'City', state: 'State', postal_code: '12345', country: 'Country' },
    user_id: 'USER1'
  },
  {
    id: 'ORD002',
    order_id: 'ORD002',
    product_id: 'PROD3',
    product_name: 'Product 3',
    product_image: '/product3.jpg',
    created_at: '2024-03-10',
    items: [
      { name: 'Product 3', quantity: 1, price: 79.99 }
    ],
    status: 'delivered',
    tracking_status: 'Delivered',
    tracking_number: '9405511298370123456781',
    carrier: 'USPS',
    quantity: 1,
    amount: 79.99,
    customer_email: 'user@example.com',
    customer_name: 'John Doe',
    payment_id: 'PAY002',
    payment_status: 'completed',
    shipping_address: { street: '123 Main St', city: 'City', state: 'State', postal_code: '12345', country: 'Country' },
    billing_address: { street: '123 Main St', city: 'City', state: 'State', postal_code: '12345', country: 'Country' },
    user_id: 'USER1'
  }
];

export default function OrdersPage() {
  return (
    <div>
      <div className="mx-auto p-4 md:p-8">
        <NavbarDashboard />
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <OrdersList />
      </div>
      <StackedCircularFooter />
    </div>
  );
} 