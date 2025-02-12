"use client";

import { OrdersList } from './OrdersList';
import { NavbarDashboard } from '@/components/blocks/shadcnblocks-com-navbar-dashboard';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { Order } from './types';

// Move sample orders to a separate data file or fetch from API
const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    date: '2024-03-15',
    items: [
      { name: 'Product 1', quantity: 2, price: 29.99 },
      { name: 'Product 2', quantity: 1, price: 49.99 }
    ],
    total: 109.97,
    status: 'In Transit',
    trackingNumber: '1Z999AA1234567890',
    carrier: 'UPS'
  },
  {
    id: 'ORD002',
    date: '2024-03-10',
    items: [
      { name: 'Product 3', quantity: 1, price: 79.99 }
    ],
    total: 79.99,
    status: 'Delivered',
    trackingNumber: '9405511298370123456781',
    carrier: 'USPS'
  }
];

export default function OrdersPage() {
  return (
    <div>
      <div className="mx-auto p-4 md:p-8">
        <NavbarDashboard />
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <OrdersList orders={sampleOrders} />
      </div>
      <StackedCircularFooter />
    </div>
  );
} 