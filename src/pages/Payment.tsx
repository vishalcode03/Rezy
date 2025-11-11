import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Building2, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (!bookingData) {
      toast.error('No booking data found. Please make a reservation first.');
      navigate('/table-booking');
    }
  }, [bookingData, navigate]);

  const generateBookingId = () => {
    return 'BK' + Date.now().toString().slice(-8);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate payment details
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error('Please fill in all card details');
        setIsProcessing(false);
        return;
      }
      if (cardNumber.length !== 19) {
        toast.error('Invalid card number');
        setIsProcessing(false);
        return;
      }
    } else if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      setIsProcessing(false);
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      const newBookingId = generateBookingId();
      setBookingId(newBookingId);
      setIsProcessing(false);
      setShowSuccessDialog(true);
      
      // Save booking to localStorage (simulating database)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        ...bookingData,
        id: newBookingId,
        paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));
    }, 2000);
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
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePayment} className="space-y-6">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Credit/Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex-1 cursor-pointer flex items-center gap-2">
                            <Wallet className="h-5 w-5" />
                            UPI
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                          <RadioGroupItem value="netbanking" id="netbanking" />
                          <Label htmlFor="netbanking" className="flex-1 cursor-pointer flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Net Banking
                          </Label>
                        </div>
                      </RadioGroup>

                      {/* Card Payment Form */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\s/g, '');
                                const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
                                setCardNumber(formattedValue.slice(0, 19));
                              }}
                              maxLength={19}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                              id="cardName"
                              placeholder="JOHN DOE"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value.toUpperCase())}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  const formattedValue = value.slice(0, 2) + (value.length > 2 ? '/' + value.slice(2, 4) : '');
                                  setExpiryDate(formattedValue);
                                }}
                                maxLength={5}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                type="password"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                maxLength={3}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* UPI Payment Form */}
                      {paymentMethod === 'upi' && (
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="upiId">UPI ID</Label>
                            <Input
                              id="upiId"
                              placeholder="yourname@upi"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Net Banking */}
                      {paymentMethod === 'netbanking' && (
                        <div className="space-y-4 pt-4">
                          <p className="text-sm text-muted-foreground">
                            You will be redirected to your bank's website to complete the payment.
                          </p>
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-secondary"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : `Pay ₹${total}`}
                      </Button>
                    </form>
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
