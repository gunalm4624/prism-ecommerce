"use client";

import { useState, useCallback, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NavbarDashboard } from "@/components/blocks/shadcnblocks-com-navbar-dashboard";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";
import { PaymentSuccessModal } from "@/components/ui/payment-success-modal";
import { PaymentFailureModal } from "@/components/ui/payment-failure-modal";
import { createClient } from '@/lib/supabase/client';
import { auth } from '@/lib/firebaseClient';
import { useCart } from '@/components/providers/CartProvider';

interface CustomerDetails {
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface ValidationErrors {
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [details, setDetails] = useState<CustomerDetails>({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [paymentError, setPaymentError] = useState<{
    code: string;
    message: string;
    solution?: string;
  } | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user?.uid || null);
    });

    return () => unsubscribe();
  }, []);

  const validateField = useCallback((name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^[6-9]\d{9}$/.test(value)) return 'Enter valid 10-digit mobile number';
        return '';
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.length < 10) return 'Please enter complete address';
        return '';
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (!/^[1-9][0-9]{5}$/.test(value)) return 'Enter valid 6-digit pincode';
        return '';
      default:
        return value.trim() ? '' : `${name} is required`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCheckout = async () => {
    if (!userId) {
      alert('Please login to continue');
      return;
    }

    // Validate all fields
    const newErrors = {
      name: validateField('name', details.name),
      mobile: validateField('mobile', details.mobile),
      address: validateField('address', details.address),
      city: validateField('city', details.city),
      state: validateField('state', details.state),
      country: validateField('country', details.country),
      pincode: validateField('pincode', details.pincode)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: 'rzp_test_JMTGF7doq0e4LC',
        amount: data.amount,
        currency: "INR",
        name: "Beautika Herbals",
        description: `Order for ${cartItems.length} items`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const supabase = createClient();
            
            // Create one order with all items
            const { error: orderError } = await supabase
              .from('orders')
              .insert({
                order_id: data.orderId,
                user_id: userId,
                items: cartItems.map(item => ({
                  product_id: item.id,
                  product_name: item.name,
                  product_image: item.image,
                  quantity: item.quantity,
                  price: item.price
                })),
                total_amount: totalAmount,
                status: 'packing in progress',
                payment_id: response.razorpay_payment_id,
                customer_name: details.name,
                customer_email: auth.currentUser?.email || '',
                shipping_address: {
                  street: details.address,
                  city: details.city,
                  state: details.state,
                  postal_code: details.pincode,
                  country: details.country,
                  mobile: details.mobile,
                },
                created_at: new Date().toISOString()
              });

            if (orderError) {
              console.error('Supabase error:', orderError);
              throw orderError;
            }

            setSuccessOrderId(data.orderId);
            setShowSuccessModal(true);
            clearCart(); // Clear the cart after successful order
          } catch (error) {
            console.error('Error saving order:', error);
            alert('Payment successful but failed to save order. Please contact support.');
          }
        },
        prefill: {
          name: details.name,
          contact: details.mobile,
        },
        theme: {
          color: "#7B891C",
        },
        modal: {
          ondismiss: function() {
            setPaymentError({
              code: "PAYMENT_CANCELLED",
              message: "Payment was cancelled",
              solution: "Please try again or choose a different payment method"
            });
            setShowFailureModal(true);
          }
        },
        notes: {
          address: details.address
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="mx-auto p-4 md:p-8">
        <NavbarDashboard />
      </div>
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  name="name"
                  value={details.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Mobile Number</label>
                <Input
                  name="mobile"
                  value={details.mobile}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  type="tel"
                  className={errors.mobile ? 'border-red-500' : ''}
                />
                {errors.mobile && (
                  <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  name="address"
                  value={details.address}
                  onChange={handleInputChange}
                  placeholder="Delivery Address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    name="city"
                    value={details.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Pin Code</label>
                  <Input
                    name="pincode"
                    value={details.pincode}
                    onChange={handleInputChange}
                    placeholder="Pin Code"
                    className={errors.pincode ? 'border-red-500' : ''}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <Input
                  name="state"
                  value={details.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Country</label>
                <Input
                  name="country"
                  value={details.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <div className="sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-24 w-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">Total:</p>
                    <p className="text-2xl font-bold">₹{totalAmount}</p>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <StackedCircularFooter />
      
      <PaymentSuccessModal 
        isOpen={showSuccessModal}
        orderId={successOrderId}
      />
      
      <PaymentFailureModal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        error={paymentError || {
          code: "UNKNOWN_ERROR",
          message: "An unknown error occurred",
          solution: "Please try again later"
        }}
        onRetry={handleCheckout}
      />
    </div>
  );
} 