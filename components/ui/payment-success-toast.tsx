"use client";

import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

export function showPaymentSuccessToast(orderDetails: {
  orderId: string;
  amount: number;
  productName: string;
}) {
  toast({
    title: "Payment Successful!",
    description: (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>Order #{orderDetails.orderId}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {orderDetails.productName} - ₹{orderDetails.amount}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Track your order in My Orders
        </p>
      </div>
    ),
    duration: 5000,
  });
} 