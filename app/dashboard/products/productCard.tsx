'use client'

import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import React from 'react'
interface ProductCardProps {
    product: Product;
  }
  
  export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter(); // Updated hook
    return (
      <div
        className="relative bg-white p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => router.push(`/dashboard/products/${product.id}`)}
      >
        {product.badge && (
          <div className="absolute top-4 right-4 bg-gray-700 text-white text-sm px-2 py-1 rounded-full">
            {product.badge}
          </div>
        )}
        <div className="aspect-square mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.material}</p>
          <p className="text-gray-900 font-semibold">₹{product.price.toFixed(2)}</p>
        </div>
      </div>
    );
  }