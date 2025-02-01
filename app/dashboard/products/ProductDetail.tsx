import { NavbarDashboard } from '@/components/blocks/shadcnblocks-com-navbar-dashboard';
import { Button } from '@/components/ui/button';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';
import { doc, collection, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseClient';
import { useToast } from '@/hooks/use-toast';


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  material: string;
  description: string;
}

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const user = auth.currentUser;

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const colors = [
    { name: 'Purple', class: 'bg-purple-400' },
    { name: 'Gray', class: 'bg-gray-500' },
    { name: 'Black', class: 'bg-black' },
    { name: 'Pink', class: 'bg-pink-300' },
  ];

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = async (product: Product, quantity: number) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const cartRef = doc(collection(db, 'carts'));
      await setDoc(cartRef, {
        userId: user.uid,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        timestamp: new Date()
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="mx-auto p-4 md:p-8">
        <NavbarDashboard />
          {/* <ShoppingCart /> */}
      </div>
      <div className="mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="relative aspect-square bg-gray-100 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold">₹{product.price.toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <h1 className="text-lg font-bold mb-2">Description</h1>
              <p>{product.description}</p>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={decreaseQuantity}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span>{quantity}</span>
                <Button variant="outline" size="icon" onClick={increaseQuantity}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => addToCart(product, quantity)}
              >
                Add to cart
              </Button>
              <Button>Buy Now</Button>
            </div>

            {/* Product Information */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  Free standard shipping on orders over $50. Returns accepted within 30 days of delivery.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger>Details</AccordionTrigger>
                <AccordionContent>
                  Material: {product.material}
                  <br />
                  Style: Hoodie
                  <br />
                  Fit: Regular fit
                  <br />
                  Care: Machine washable
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <StackedCircularFooter />
    </div>
  );
};

export default ProductPage;