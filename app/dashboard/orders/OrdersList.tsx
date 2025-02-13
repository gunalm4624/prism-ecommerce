"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { TrackingModal } from "@/components/ui/tracking-modal";
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });

    return () => unsubscribe();
  }, []);

  // Fetch orders when userId changes
  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
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
  };

  const handleTrackPackage = (trackingNumber: string) => {
    setSelectedTrackingNumber(trackingNumber);
    setIsTrackingModalOpen(true);
  };

  if (!userId) {
    return <div className="p-4">Please sign in to view your orders</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading orders: {error}</div>;
  }

  if (orders.length === 0) {
    return <div className="p-4">No orders found</div>;
  }

  return (
    <>
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
              <Badge variant={order.status === 'shipped' ? 'default' : 'secondary'}>
                {order.status}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-lg font-semibold">
                  Total: ₹{order.amount.toFixed(2)}
                </p>
              </div>
              
              {order.tracking_number && (
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
                    onClick={() => handleTrackPackage(order.tracking_number)}
                  >
                    Track Package
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        trackingNumber={selectedTrackingNumber}
      />
    </>
  );
} 