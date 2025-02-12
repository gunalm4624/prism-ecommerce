import { NavbarDashboard } from '@/components/blocks/shadcnblocks-com-navbar-dashboard';
import { Button } from '@/components/ui/button';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';
import { doc, collection, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseClient';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order on backend
      const response = await fetch('http://localhost:4000/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price * quantity * 100, // Convert to paise
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'K2 Designers',
        description: `Purchase of ${product.name}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Handle successful payment
            await fetch('http://localhost:4000/success', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderCreationId: data.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            // Save order to Firestore
            const orderRef = doc(collection(db, 'orders'));
            await setDoc(orderRef, {
              userId: user.uid,
              productId: product.id,
              productName: product.name,
              quantity: quantity,
              amount: product.price * quantity,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              status: 'completed',
              timestamp: new Date(),
              shippingStatus: 'pending',
              customerEmail: user.email,
              customerName: user.displayName
            });

            toast({
              title: "Payment successful",
              description: "Your order has been placed successfully",
            });
          } catch (error) {
            console.error('Error processing payment:', error);
            toast({
              title: "Error",
              description: "Failed to process payment",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="mx-auto p-4 md:p-8">
        <NavbarDashboard />
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
              <Button 
                onClick={handlePayment} 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>

            {/* Product Information */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  Free standard shipping on orders over ₹500. Returns accepted within 30 days of delivery.
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
