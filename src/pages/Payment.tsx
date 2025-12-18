import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!bookingData) {
      toast.error('No booking data found. Please make a reservation first.');
      navigate('/table-booking');
    }
  }, [bookingData, navigate]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateBookingId = () => {
    return 'BK' + Date.now().toString().slice(-8);
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...');
      return;
    }

    setIsProcessing(true);

    try {
      const isDineIn = bookingData.type === 'dine-in';
      const total = isDineIn ? 100 : bookingData.total;

      // Create order on backend
      const response = await fetch(`${API_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();

      // Razorpay options
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        toast.error('Razorpay key not configured. Please contact support.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Rezynow Restaurant',
        description: `Payment for ${isDineIn ? 'Table Reservation' : 'Food Order'}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Save booking data
              const newBookingId = generateBookingId();
              setBookingId(newBookingId);
              
              // Save booking to localStorage (you can also save to Supabase here)
              const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
              const newBooking = {
                ...bookingData,
                id: newBookingId,
                paymentMethod: 'razorpay',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
              };
              localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

              // Navigate to success page
              navigate('/payment-success', {
                state: {
                  bookingId: newBookingId,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  bookingData,
                },
              });
            } else {
              toast.error('Payment verification failed');
              setIsProcessing(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: bookingData.name,
          email: bookingData.email,
          contact: bookingData.phone,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/my-bookings');
  };

  if (!bookingData) {
    return null;
  }

  const isDineIn = bookingData.type === 'dine-in';
  const total = isDineIn ? 100 : bookingData.total; // ₹100 booking fee for dine-in

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Payment</h1>
            <p className="text-muted-foreground mb-8">
              Complete your {isDineIn ? 'reservation' : 'order'}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Secure Payment</CardTitle>
                    <CardDescription>
                      Complete your payment using Razorpay secure gateway
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">Razorpay Payment Gateway</p>
                          <p className="text-sm text-muted-foreground">
                            Secure payment with multiple options: Cards, UPI, Net Banking, Wallets
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• All major credit/debit cards accepted</p>
                        <p>• UPI payments (Google Pay, PhonePe, Paytm, etc.)</p>
                        <p>• Net Banking from all major banks</p>
                        <p>• Digital Wallets supported</p>
                      </div>

                      <Button 
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-primary to-secondary"
                        disabled={isProcessing || !razorpayLoaded}
                        size="lg"
                      >
                        {isProcessing ? 'Processing...' : !razorpayLoaded ? 'Loading...' : `Pay Now ₹${total}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        {isDineIn ? 'Table Reservation' : 'Food Pickup'}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{bookingData.name}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{bookingData.date}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{bookingData.time}</span>
                        </p>
                        {isDineIn && (
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Guests:</span>
                            <span className="font-medium">{bookingData.guests}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {!isDineIn && bookingData.selectedFoods?.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2">Items</h3>
                          <div className="space-y-1 text-sm">
                            {bookingData.selectedFoods.map((foodId: string) => {
                              const foodItems = [
                                { id: '1', name: 'Plant Protein Bowl', price: 279 },
                                { id: '2', name: 'Spring Veg Platter', price: 249 },
                                { id: '3', name: 'Margherita Pizza', price: 399 },
                                { id: '4', name: 'Hyderabadi Biryani', price: 349 },
                                { id: '5', name: 'Classic Burger', price: 229 },
                                { id: '6', name: 'Chocolate Delight', price: 189 },
                              ];
                              const food = foodItems.find(f => f.id === foodId);
                              return (
                                <p key={foodId} className="flex justify-between">
                                  <span>{food?.name}</span>
                                  <span>₹{food?.price}</span>
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    
                    <div className="space-y-2">
                      {isDineIn ? (
                        <p className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Booking Fee:</span>
                          <span>₹100</span>
                        </p>
                      ) : (
                        <p className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span>₹{total}</span>
                        </p>
                      )}
                      <p className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">₹{total}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your {isDineIn ? 'table has been reserved' : 'order has been confirmed'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
              <p className="text-2xl font-bold text-primary">{bookingId}</p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>A confirmation email has been sent to</p>
              <p className="font-medium text-foreground">{bookingData.email}</p>
            </div>
            <Button 
              onClick={handleSuccessClose}
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              View My Bookings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Payment;
