import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseClient';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, X } from 'lucide-react';

// TypeScript interfaces
interface CartItem {
  id: string;
  userId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  timestamp: Date;
}

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img 
        src={item.image} 
        alt={item.name} 
        className="h-20 w-20 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500">${item.price}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span>{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onRemove(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ShoppingCart: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const cartQuery = query(
      collection(db, 'carts'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      cartQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items: CartItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<CartItem, 'id'>;
          items.push({ id: doc.id, ...data });
        });
        console.log("Fetched cart items:", items); // Debugging line
        setCartItems(items);
      },
      (error) => {
        console.error("Error fetching cart items:", error);
        toast({
          title: "Error",
          description: "Failed to fetch cart items",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [user, toast]);

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
      const cartItem: Omit<CartItem, 'id'> = {
        userId: user.uid,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        timestamp: new Date()
      };

      await setDoc(cartRef, cartItem);

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
      setIsOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const itemRef = doc(db, 'carts', itemId);
      await setDoc(itemRef, { quantity: newQuantity }, { merge: true });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const itemRef = doc(db, 'carts', itemId);
      await setDoc(itemRef, { deleted: true }, { merge: true });
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-200px)] mt-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          {cartItems.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-medium">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <Button className="w-full">
                Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShoppingCart;