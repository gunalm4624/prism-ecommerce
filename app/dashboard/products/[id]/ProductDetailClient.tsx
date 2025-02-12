"use client";

import React from 'react';
import ProductPage from '../ProductDetail';
import { Product } from '@/types/product';

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductPage product={product} />;
};

export default ProductDetailClient; 