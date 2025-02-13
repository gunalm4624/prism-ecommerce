"use client";

import { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavbarDashboard } from "@/components/blocks/shadcnblocks-com-navbar-dashboard";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";
import { Manrope } from "next/font/google";
import { PaymentSuccessModal } from "@/components/ui/payment-success-modal";
import { createClient } from '@/lib/supabase/client';
import { auth } from '@/lib/firebaseClient';

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

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
});

export default function CustomerDetailsPage() {
  const searchParams = useSearchParams();
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

  const [errors, setErrors] = useState<ValidationErrors>({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');

  // Get product details from URL params
  const productImage = searchParams?.get('image') || '';
  const productTitle = searchParams?.get('title') || '';
  const productDescription = searchParams?.get('description') || '';
  const productPrice = searchParams?.get('price') || '';

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

      case 'city':
        if (!value.trim()) return 'City is required';
        return '';

      case 'state':
        if (!value.trim()) return 'State is required';
        return '';

      case 'country':
        if (!value.trim()) return 'Country is required';
        return '';

      default:
        return '';
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBuyNow = async () => {
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

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      return; // Stop if there are validation errors
    }

    // Proceed with payment if validation passes
    const productId = searchParams?.get('product_id') || '';
    
    try {
      const response = await fetch('http://localhost:4000/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(productPrice) * 100,
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
        description: productTitle,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Store order in Supabase
            const supabase = createClient();
            const { error: orderError } = await supabase
              .from('orders')
              .insert({
                order_id: data.orderId,
                user_id: auth.currentUser?.uid,
                product_id: searchParams?.get('product_id'),
                product_name: productTitle,
                product_image: productImage,
                quantity: 1,
                amount: parseFloat(productPrice),
                status: 'packing in progress',
                payment_id: response.razorpay_payment_id,
                customer_name: details.name,
                customer_email: auth.currentUser?.email,
                shipping_address: {
                  street: details.address,
                  city: details.city,
                  state: details.state,
                  postal_code: details.pincode,
                  country: details.country
                },
                created_at: new Date().toISOString()
              });

            if (orderError) throw orderError;

            // Show success modal
            setSuccessOrderId(data.orderId);
            setShowSuccessModal(true);
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
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className={manrope.className}>
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

          {/* Product Summary */}
          <Card className="p-6">
            <div className="sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-6">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={productImage}
                    alt={productTitle}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{productTitle}</h3>
                  <p className="text-gray-600">{productDescription}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold">₹{productPrice}</p>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={handleBuyNow}
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
    </div>
  );
} 