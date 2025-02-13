"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UpdateTrackingModal } from "@/components/admin/UpdateTrackingModal";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
  };

  const handleUpdateTracking = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders Dashboard</h1>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12">
                      <Image
                        src={order.product_image}
                        alt={order.product_name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{order.product_name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {order.quantity}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p>{order.customer_name}</p>
                  <p className="text-sm text-gray-500">
                    {order.shipping_address?.street}, 
                    {order.shipping_address?.city}, 
                    {order.shipping_address?.state} - 
                    {order.shipping_address?.postal_code}
                  </p>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'packing in progress' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  {!order.tracking_number && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateTracking(order)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tracking
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <UpdateTrackingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdate={fetchOrders}
      />
    </div>
  );
} 