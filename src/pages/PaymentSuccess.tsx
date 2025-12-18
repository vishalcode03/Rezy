import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar, Clock, Users, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, paymentId, orderId, bookingData } = location.state || {};

  useEffect(() => {
    if (!bookingId || !paymentId) {
      toast.error('Invalid payment details');
      setTimeout(() => {
        navigate('/table-booking', { replace: true });
      }, 2000);
    } else {
      // Show success message on mount
      toast.success('Payment confirmed successfully!');
    }
  }, [bookingId, paymentId, navigate]);

  if (!bookingId || !paymentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isDineIn = bookingData?.type === 'dine-in';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 animate-pulse">
                <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2 text-green-600 dark:text-green-400">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground text-lg">
                Your {isDineIn ? 'table has been reserved' : 'order has been confirmed'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Thank you for your payment. Your booking is confirmed.
              </p>
            </div>

            {/* Booking Details Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Your booking confirmation and payment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                  <p className="text-2xl font-bold text-primary">{bookingId}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{bookingData?.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{bookingData?.time}</p>
                    </div>
                  </div>

                  {isDineIn && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Guests</p>
                        <p className="font-medium">{bookingData?.guests}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{bookingData?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{bookingData?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                    <span className="text-sm font-bold text-primary">
                      ₹{isDineIn ? 100 : bookingData?.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment ID</span>
                    <span className="text-sm font-mono text-xs">{paymentId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <span className="text-sm font-mono text-xs">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="text-sm font-medium">Razorpay</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                <Link to="/my-bookings">View My Bookings</Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="flex-1"
              >
                <Link to="/">Back to Home</Link>
              </Button>
            </div>

            {/* Info Message */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">
                    Payment Confirmed
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    A confirmation email has been sent to{' '}
                    <strong className="font-semibold">{bookingData?.email}</strong> with all the booking details.
                    Please check your inbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;

