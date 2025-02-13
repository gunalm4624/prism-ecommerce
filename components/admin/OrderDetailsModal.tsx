"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details #{order.order_id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="relative h-24 w-24">
              <Image
                src={order.product_image}
                alt={order.product_name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-semibold">{order.product_name}</h3>
              <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
              <p className="text-sm font-medium">₹{order.amount.toFixed(2)}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h4 className="font-semibold mb-2">Customer Information</h4>
            <div className="grid gap-2 text-sm">
              <p><span className="font-medium">Name:</span> {order.customer_name}</p>
              <p><span className="font-medium">Email:</span> {order.customer_email}</p>
              <p><span className="font-medium">Mobile:</span> {order.shipping_address?.mobile || order.mobile}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="font-semibold mb-2">Shipping Address</h4>
            <div className="grid gap-1 text-sm">
              <p>{order.shipping_address?.street}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
              <p>{order.shipping_address?.postal_code}</p>
              <p>{order.shipping_address?.country}</p>
            </div>
          </div>

          {/* Order Status */}
          <div>
            <h4 className="font-semibold mb-2">Order Status</h4>
            <div className="grid gap-2 text-sm">
              <p><span className="font-medium">Status:</span> {order.status}</p>
              {order.tracking_number && (
                <>
                  <p><span className="font-medium">Tracking Number:</span> {order.tracking_number}</p>
                  <p><span className="font-medium">Carrier:</span> {order.carrier}</p>
                </>
              )}
              <p><span className="font-medium">Order Date:</span> {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 