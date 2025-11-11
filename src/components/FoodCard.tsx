import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { toast } from 'sonner';

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  restaurant?: string;
}

const FoodCard = ({ id, name, description, price, image, rating, restaurant }: FoodCardProps) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name, price, image, restaurant, quantity: 1 }));
    toast.success(`${name} added to cart!`);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-48 w-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          {rating}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        {restaurant && (
          <p className="text-xs text-muted-foreground mb-2">{restaurant}</p>
        )}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{price}</span>
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
