'use client'

import Image from 'next/image'
import React from 'react'
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer'
import { products } from '@/data/products'
import { Product } from '@/types/product'
import { ProductCard } from '@/app/dashboard/products/productCard'
import { MarqueeDemo } from '@/components/ui/marquee'
import { FaqSection } from '@/components/blocks/faq'
const DEMO_FAQS = [
  {
    question: "Are your herbal products 100% natural?",
    answer: "Yes, all our products are made from 100% natural, plant-based ingredients, free from harmful chemicals and additives.",
  },
  {
    question: "How should I store your herbal products?",
    answer: "Store them in a cool, dry place away from direct sunlight to maintain their potency and freshness.",
  },
  {
    question: "Are there any side effects of using your herbal products?",
    answer: "Our products are generally safe for use, but we recommend consulting a healthcare professional if you have specific allergies or medical conditions.",
  },
  {
    question: "How long does shipping take?",
    answer: "Orders are typically processed within 1-2 business days, and delivery takes 3-7 business days, depending on your location. Expedited shipping is also available.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes, we accept returns or exchanges within 7 days of delivery if the product is unopened and in its original packaging.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship worldwide! Shipping costs and delivery times vary depending on your location.",
  },
];
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
        <div className='container mx-auto py-8 mt-8'>
          <h1 className='font-medium text-3xl text-center mb-2'>See What Our Customers Are Saying</h1>
          <p className='w-[600] text-center mx-auto mb-16 text-gray-400'>Discover how our herbal products have made a difference in the lives of our happy customers—naturally!</p>
          <MarqueeDemo/>
        </div>
        <div className='py-8 mt-8'>
          <h1 className='font-medium text-3xl text-center mb-2'>Got Questions? Weve Got Answers!</h1>
          <p className='w-[600] text-center mx-auto mb-16 text-gray-400'>Find quick solutions to common queries about our herbal products, usage, and more—all in one place!</p>
          <FaqSection  items={DEMO_FAQS} title={''}/>
        </div>
      <StackedCircularFooter/>
    </div>
  )
}

export default HomePage