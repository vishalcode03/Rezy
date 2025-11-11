import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CartItem } from '@/store/cartSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Clock, Users, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import plantBowl from '@/assets/plant-protein-bowl.jpg';
import springVeg from '@/assets/spring-veg-platter.jpg';
import pizza from '@/assets/pizza.jpg';
import biryani from '@/assets/biryani.jpg';
import burger from '@/assets/burger.jpg';
import dessert from '@/assets/dessert.jpg';

const TableBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // If URL contains ?mode=pickup we default to pickup flow
  const params = new URLSearchParams(location.search);
  const defaultMode = params.get('mode') === 'pickup' ? 'pickup' : 'dine-in';
  const [bookingType, setBookingType] = useState<'dine-in' | 'pickup'>(defaultMode as 'dine-in' | 'pickup');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Pickup specific states
  // Prefill selected foods from cart when arriving from checkout
  // Using Redux cart so selections persist across pages
  // (import RootState via selector below)
  // We load initial selected foods from the cart if their ids exist in foodItems
  // to ensure the pickup flow reflects what the user added to the cart.
  
  // We'll import cart items via selector below (after foodItems declared)
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState('');

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const pickupTimeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
  ];

  const foodItems = useMemo(() => [
    { id: '1', name: 'Plant Protein Bowl', price: 279, image: plantBowl },
    { id: '2', name: 'Spring Veg Platter', price: 249, image: springVeg },
    { id: '3', name: 'Margherita Pizza', price: 399, image: pizza },
    { id: '4', name: 'Hyderabadi Biryani', price: 349, image: biryani },
    { id: '5', name: 'Classic Burger', price: 229, image: burger },
    { id: '6', name: 'Chocolate Delight', price: 189, image: dessert },
  ], [] as const);

  // read cart items from redux and prefill pickup selections when appropriate
  const cartItems = useSelector((state: RootState) => state.cart.items) as CartItem[];

  useEffect(() => {
    if (bookingType === 'pickup' && cartItems && cartItems.length > 0) {
      const prefills = cartItems.map(ci => ci.id).filter(id => foodItems.some(f => f.id === id));
      setSelectedFoods(prefills);
    }
  }, [cartItems, bookingType, foodItems]);

  const handleFoodSelection = (foodId: string) => {
    setSelectedFoods(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  const calculateTotal = () => {
    return selectedFoods.reduce((total, foodId) => {
      const food = foodItems.find(f => f.id === foodId);
      const cartItem = cartItems.find(ci => ci.id === foodId);
      const qty = cartItem?.quantity ?? 1;
      return total + ((food?.price || 0) * qty);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !phone || !email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (bookingType === 'dine-in') {
      if (!date || !time) {
        toast.error('Please select date and time');
        return;
      }
    } else {
      if (!date || !pickupTime || selectedFoods.length === 0) {
        toast.error('Please select date, time, and at least one food item');
        return;
      }
    }

    // Prepare booking data
    const bookingData = {
      type: bookingType,
      name,
      phone,
      email,
      date: date?.toLocaleDateString(),
      time: bookingType === 'dine-in' ? time : pickupTime,
      guests: bookingType === 'dine-in' ? guests : '1',
      specialRequests,
      selectedFoods: bookingType === 'pickup' ? selectedFoods : [],
      total: bookingType === 'pickup' ? calculateTotal() : 0,
    };

    // Navigate to payment page with booking data
    navigate('/payment', { state: { bookingData } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Reserve Your Experience</h1>
            <p className="text-muted-foreground mb-8">
              Book a table or order for pickup
            </p>

            <Tabs value={bookingType} onValueChange={(v) => setBookingType(v as 'dine-in' | 'pickup')}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="dine-in" className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  Dine In
                </TabsTrigger>
                <TabsTrigger value="pickup" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Food Pickup
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                {/* Dine In Tab */}
                <TabsContent value="dine-in" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reservation Details</CardTitle>
                      <CardDescription>
                        Reserve your table for a perfect dining experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Date and Time Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Select Date
                          </Label>
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="time" className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Select Time
                            </Label>
                            <Select value={time} onValueChange={setTime} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="guests" className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Number of Guests
                            </Label>
                            <Select value={guests} onValueChange={setGuests} required>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+91 1234567890"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="requests">Special Requests (Optional)</Label>
                          <Input
                            id="requests"
                            placeholder="Allergies, dietary restrictions, etc."
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pickup Tab */}
                <TabsContent value="pickup" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Your Food</CardTitle>
                      <CardDescription>
                        Choose items for pickup and select your preferred time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Food Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {foodItems.map((food) => (
                          <div key={food.id} className="relative">
                            <Card className={`cursor-pointer transition-all ${
                              selectedFoods.includes(food.id) ? 'ring-2 ring-primary' : ''
                            }`}>
                              <CardContent className="p-0">
                                <div className="relative">
                                  <img
                                    src={food.image}
                                    alt={food.name}
                                    className="w-full h-32 object-cover rounded-t-lg"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <Checkbox
                                      checked={selectedFoods.includes(food.id)}
                                      onCheckedChange={() => handleFoodSelection(food.id)}
                                      className="bg-white"
                                    />
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="font-semibold text-sm mb-1">{food.name}</h4>
                                  <p className="text-primary font-bold">₹{food.price}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>

                      {/* Pickup Date and Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Pickup Date
                          </Label>
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pickupTime" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Pickup Time
                          </Label>
                          <Select value={pickupTime} onValueChange={setPickupTime} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose pickup time" />
                            </SelectTrigger>
                            <SelectContent>
                              {pickupTimeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="pickup-name">Full Name *</Label>
                            <Input
                              id="pickup-name"
                              placeholder="John Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pickup-phone">Phone Number *</Label>
                            <Input
                              id="pickup-phone"
                              type="tel"
                              placeholder="+91 1234567890"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pickup-email">Email *</Label>
                          <Input
                            id="pickup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pickup-requests">Special Instructions (Optional)</Label>
                          <Input
                            id="pickup-requests"
                            placeholder="Extra sauce, no onions, etc."
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Order Summary */}
                      {selectedFoods.length > 0 && (
                        <Card className="bg-muted/30">
                          <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedFoods.map(foodId => {
                                const food = foodItems.find(f => f.id === foodId);
                                const cartItem = cartItems.find(ci => ci.id === foodId);
                                const qty = cartItem?.quantity ?? 1;
                                const lineTotal = (food?.price || 0) * qty;
                                return (
                                  <div key={foodId} className="flex justify-between">
                                    <span>{food?.name} x{qty}</span>
                                    <span className="font-semibold">₹{lineTotal}</span>
                                  </div>
                                );
                              })}
                              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">₹{calculateTotal()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary text-white px-8"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </form>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TableBooking;
