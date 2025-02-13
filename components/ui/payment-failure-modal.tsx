"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Urbanist } from "next/font/google";

interface PaymentFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: {
    code: string;
    message: string;
    solution?: string;
  };
  onRetry: () => void;
}

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

export function PaymentFailureModal({ 
  isOpen, 
  onClose, 
  error,
  onRetry 
}: PaymentFailureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${urbanist.className}`}>
        <DialogHeader>
          <DialogTitle className="text-red-600">Payment Failed</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <XCircle className="w-16 h-16 text-red-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-2"
          >
            <p className="text-gray-600">Error Code: {error.code}</p>
            <p className="text-gray-800 font-medium">{error.message}</p>
            {error.solution && (
              <p className="text-sm text-gray-600">{error.solution}</p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 w-full"
          >
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={onRetry}
              className="flex-1"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 