"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { getTrackingInfo } from '@/lib/trackingClient';
import { Order } from './types';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          return;
        }
        
        console.log('Fetched orders:', data);
        setOrders(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      }
    }

    fetchOrders();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error loading orders: {error}</div>;
  }

  const getStatusVariant = (status: Order['tracking_status']): BadgeProps['variant'] => {
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
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="relative h-16 w-16 rounded overflow-hidden">
              <Image
                src={order.product_image}
                alt={order.product_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
              <p className="text-sm text-muted-foreground">
                {order.product_name} x {order.quantity}
              </p>
            </div>
            <Badge variant={getStatusVariant(order.tracking_status)}>
              {order.tracking_status}
            </Badge>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Order Date: {new Date(order.created_at).toLocaleDateString()}
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
                Total: ${order.amount.toFixed(2)}
              </p>
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Tracking Number:</span> {order.tracking_number}
              </p>
              <p className="text-sm">
                <span className="font-medium">Carrier:</span> {order.carrier}
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => handleTrackPackage(order.tracking_number, order.carrier)}
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