"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate whitespace-nowrap overflow-hidden">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold">₹{product.price}</p>
          <Button onClick={() => router.push(`/dashboard/products/${product.id}`)}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
} 