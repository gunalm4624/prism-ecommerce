import { products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/types/product';

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

async function getProduct(id: string): Promise<Product | null> {
  const product = products.find(
    (p) => p.id.toString() === id
  );
  return product || null;
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">
          Product not found
        </h1>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
