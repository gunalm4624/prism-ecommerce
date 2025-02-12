"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { getTrackingInfo } from '@/lib/trackingClient';
import { Order } from './types';

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
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

  const handleTrackPackage = (trackingNumber: string, carrier: string) => {
    const { trackingUrl } = getTrackingInfo(trackingNumber, carrier);
    window.open(trackingUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
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
                className="mt-2"
                onClick={() => handleTrackPackage(order.trackingNumber, order.carrier)}
              >
                Track Package
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 