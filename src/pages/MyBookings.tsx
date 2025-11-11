import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, Users, MapPin, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  type: 'dine-in' | 'pickup';
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  specialRequests: string;
  selectedFoods?: string[];
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings.sort((a: Booking, b: Booking) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  const dineInBookings = bookings.filter(b => b.type === 'dine-in');
  const pickupBookings = bookings.filter(b => b.type === 'pickup');

  const foodItems = [
    { id: '1', name: 'Plant Protein Bowl', price: 279 },
    { id: '2', name: 'Spring Veg Platter', price: 249 },
    { id: '3', name: 'Margherita Pizza', price: 399 },
    { id: '4', name: 'Hyderabadi Biryani', price: 349 },
    { id: '5', name: 'Classic Burger', price: 229 },
    { id: '6', name: 'Chocolate Delight', price: 189 },
  ];

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {booking.type === 'dine-in' ? (
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              ) : (
                <ShoppingBag className="h-5 w-5 text-primary" />
              )}
              {booking.type === 'dine-in' ? 'Table Reservation' : 'Food Pickup'}
            </CardTitle>
            <CardDescription className="mt-1">
              Booking ID: {booking.id}
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{booking.time}</span>
          </div>
          {booking.type === 'dine-in' && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{booking.guests} Guests</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.name}</span>
          </div>
        </div>

        {booking.type === 'pickup' && booking.selectedFoods && booking.selectedFoods.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <p className="text-sm font-semibold mb-2">Items:</p>
            <div className="space-y-1">
              {booking.selectedFoods.map(foodId => {
                const food = foodItems.find(f => f.id === foodId);
                return (
                  <div key={foodId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{food?.name}</span>
                    <span className="font-medium">₹{food?.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t pt-3 mt-3 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Paid:</span>
          <span className="text-lg font-bold text-primary">
            ₹{booking.type === 'dine-in' ? 100 : booking.total}
          </span>
        </div>

        {booking.specialRequests && (
          <div className="text-sm">
            <span className="text-muted-foreground">Note: </span>
            <span>{booking.specialRequests}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
                <p className="text-muted-foreground">
                  View and manage your reservations
                </p>
              </div>
              <Link to="/table-booking">
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  New Booking
                </Button>
              </Link>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Make your first reservation to see it here
                  </p>
                  <Link to="/table-booking">
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      Make a Reservation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">
                    All ({bookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="dine-in">
                    Dine In ({dineInBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="pickup">
                    Pickup ({pickupBookings.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {bookings.map(renderBookingCard)}
                </TabsContent>

                <TabsContent value="dine-in" className="space-y-4">
                  {dineInBookings.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No dine-in reservations</p>
                      </CardContent>
                    </Card>
                  ) : (
                    dineInBookings.map(renderBookingCard)
                  )}
                </TabsContent>

                <TabsContent value="pickup" className="space-y-4">
                  {pickupBookings.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No pickup orders</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pickupBookings.map(renderBookingCard)
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;
