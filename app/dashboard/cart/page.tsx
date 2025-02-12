"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Minus, Plus, X } from 'lucide-react'
import {
  doc, 
  setDoc, 
  deleteDoc, // Added deleteDoc
  collection, 
  query, 
  where, 
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebaseClient'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface CartItem {
  id: string
  userId: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  timestamp: Date
}

const CartItemComponent = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>
  onRemove: (itemId: string) => Promise<void>
}) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <Image 
        src={item.image} 
        alt={item.name} 
        width={80}
        height={80}
        className="h-20 w-20 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500">₹{item.price}</p>
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
  )
}

export function ShoppingCartSheet() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return

    const cartQuery = query(
      collection(db, 'carts'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(
      cartQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items: CartItem[] = []
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<CartItem, 'id'>
          items.push({ id: doc.id, ...data })
        })
        setCartItems(items)
      },
      (error) => {
        console.error("Error fetching cart items:", error)
        toast({
          title: "Error",
          description: "Failed to fetch cart items",
          variant: "destructive",
        })
      }
    )

    return () => unsubscribe()
  }, [user, toast])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    try {
      const itemRef = doc(db, 'carts', itemId)
      await setDoc(itemRef, { quantity: newQuantity }, { merge: true })
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const itemRef = doc(db, 'carts', itemId)
      await deleteDoc(itemRef) // Use deleteDoc to remove the document from Firestore

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative ms-1">
          <ShoppingCart className="h-4 w-4" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemComponent
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
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">
                ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <SheetClose asChild>
                <Button className="w-full">
                  Checkout (₹{totalAmount.toFixed(2)})
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default function CartPage() {
  // ... component code
}