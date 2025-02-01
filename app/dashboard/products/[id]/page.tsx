"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { products } from '@/data/products';
import ProductPage from '../ProductDetail';


const ProductDetailPage = () => {
  const params = useParams();
  const { id } = params as { id: string }; // Ensure correct type

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductPage product={product} />;
};

export default ProductDetailPage;
