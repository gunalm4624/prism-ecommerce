import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { badgeVariants } from "@/components/ui/badge"

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'In Transit' | 'Delivered';
  trackingNumber: string;
  carrier: string;
}

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
    const getStatusVariant = (status: Order['status']): BadgeProps['variant'] => {
        switch (status) {
          case 'In Transit':
            return 'default';
          case 'Delivered':
            return 'secondary';
          default:
            return 'secondary';
        }
      };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {sampleOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <Badge variant={getStatusVariant(order.status)}>
                <Package className="w-4 h-4 mr-2" />
                {order.status}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Order Date: {new Date(order.date).toLocaleDateString()}
              </p>
              
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-lg font-semibold">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Carrier:</span> {order.carrier}
                </p>
                <Button
                  variant="outline"
                  asChild
                  className="mt-2"
                >
                  <a
                    href={`https://track.aftership.com/${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Track Package
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 