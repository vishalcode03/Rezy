import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateQuantity, removeFromCart } from '@/store/cartSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'REZY' && total >= 150) {
      const discountAmount = Math.min(total * 0.5, 75);
      setDiscount(discountAmount);
      toast.success('Promo code applied!');
    } else {
      toast.error('Invalid promo code or minimum order not met');
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Navigate to the Table Booking page and open Pickup flow
    navigate('/table-booking?mode=pickup');
  };

  const deliveryFee = total > 0 ? 30 : 0;
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + deliveryFee + taxes - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
            <Link to="/menu">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                Browse Menu
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.restaurant && (
                          <p className="text-sm text-muted-foreground">{item.restaurant}</p>
                        )}
                        <p className="text-primary font-semibold mt-2">₹{item.price}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Apply Promo Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleApplyPromo} variant="outline">
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use REZY for 50% off (max ₹75) on orders ₹150+
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes (5%)</span>
                      <span>₹{taxes}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-accent">
                        <span>Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>

                  <Button onClick={handleProceedToCheckout} className="w-full bg-gradient-to-r from-primary to-secondary text-white" type="button">
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>

              {/* <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Label>Delivery Instructions (optional)</Label>
                    <Input placeholder="E.g., Ring the bell twice" />
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
