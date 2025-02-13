"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  // ... your existing product fetching code

  const handleBuyNow = () => {
    if (!product) return;

    const params = new URLSearchParams({
      image: product.image,
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      product_id: product.id
    });
    
    router.push(`/customer-details?${params.toString()}`);
  };

  return (
    <div>
      {/* ... your existing product display JSX ... */}
      <Button 
        onClick={handleBuyNow}
        className="w-full md:w-auto"
      >
        Buy Now
      </Button>
    </div>
  );
} 