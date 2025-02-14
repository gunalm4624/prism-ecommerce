import Image from 'next/image'
import React from 'react'
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer'
import { products } from '@/data/products'
import { Product } from '@/types/product'
import { ProductCard } from '@/app/dashboard/products/productCard'

const HomePage = () => {
  return (
    <div>
        <div className="relative w-full h-[800px]">
          <Image 
            src={'/images/Banner.png'} 
            alt="Banner"
            fill
            className="object-fit rounded-lg"
          />   
        </div>
        
        <div className='p-4 mt-16'>
          <h1 className='text-2xl font-bold'>Popular Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-100 mt-6">
          
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </div>
        
      <StackedCircularFooter/>
    </div>
  )
}

export default HomePage