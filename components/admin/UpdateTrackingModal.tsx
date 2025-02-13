"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface UpdateTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdate: () => void;
}

export function UpdateTrackingModal({
  isOpen,
  onClose,
  order,
  onUpdate,
}: UpdateTrackingModalProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!trackingNumber || !order) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          tracking_number: trackingNumber,
          status: 'shipped',
          tracking_status: 'In Transit',
          carrier: 'STCourier'
        })
        .eq('id', order.id);

      if (error) throw error;

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating tracking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tracking Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Tracking Number
            </label>
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !trackingNumber}
            className="w-full"
          >
            {isLoading ? "Updating..." : "Update Tracking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 