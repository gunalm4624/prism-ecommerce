"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
}

export function TrackingModal({ isOpen, onClose, trackingNumber }: TrackingModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrack = () => {
    window.open('https://stcourier.com', '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Track Your Order</DialogTitle>
          <DialogDescription>
            Copy your tracking number and paste it on ST Courier's website
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <div className="bg-muted p-2 rounded-md flex items-center justify-between">
              <span className="text-sm font-medium">{trackingNumber}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleTrack}>
            Go to ST Courier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 