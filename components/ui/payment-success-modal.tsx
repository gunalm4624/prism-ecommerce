"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Urbanist } from "next/font/google";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  orderId: string;
}

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

export function PaymentSuccessModal({ isOpen, orderId }: PaymentSuccessModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen}>
      <DialogContent className={`sm:max-w-md ${urbanist.className}`}>
        <div className="flex flex-col items-center space-y-4 py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-4">Order ID: {orderId}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={() => router.push('/dashboard/orders')}
              className="w-full"
            >
              Go to My Orders
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 