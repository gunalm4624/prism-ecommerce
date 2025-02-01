import React from 'react'
import { ProductCard } from './productCard'
import { products } from '@/data/products'
import { Product } from '@/types/product'
import { NavbarDashboard } from '@/components/blocks/shadcnblocks-com-navbar-dashboard'

const Products = () => {
  return (
    <div>
        <div className="mx-auto p-4 md:p-8">
                <NavbarDashboard/>
              </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-100">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </div>
  )
}

export default Products