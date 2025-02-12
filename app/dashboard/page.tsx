"use client"; // Mark this component as a Client Component

import { Product } from '@/types/product';
import { products } from '../../data/products'; // Importing products array
import { useRouter } from 'next/navigation'; // Updated import
import React, { useEffect } from 'react';
import { NavbarDashboard } from '@/components/blocks/shadcnblocks-com-navbar-dashboard';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import Image from 'next/image';
import { ProductCard } from './products/productCard';
import { auth } from '@/lib/firebaseClient';



const Dashboard = () => {
  const router = useRouter(); 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/auth/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      <div className="mx-auto p-4 md:p-8">
        <NavbarDashboard/>
      </div>
      <Image src={'/images/Banner.png'} width={'10000'} height={'400'} alt=''></Image>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-100">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    <StackedCircularFooter/>
    </div>
  );
};

export default Dashboard;