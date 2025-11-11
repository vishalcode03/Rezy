import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Star, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import FoodCard from '@/components/FoodCard';
import { useAuth } from '@/hooks/useAuth';
import heroImage from '@/assets/hero-food.jpg';
import plantBowl from '@/assets/plant-protein-bowl.jpg';
import springVeg from '@/assets/spring-veg-platter.jpg';
import pizza from '@/assets/pizza.jpg';
import biryani from '@/assets/biryani.jpg';
import burger from '@/assets/burger.jpg';
import dessert from '@/assets/dessert.jpg';

const Home = () => {
  const { user } = useAuth();
  
  const categories = [
    { name: 'Healthy', image: plantBowl },
    { name: 'Pizza', image: pizza },
    { name: 'Biryani', image: biryani },
    { name: 'Burgers', image: burger },
    { name: 'Desserts', image: dessert },
  ];

  const featuredItems = [
    {
      id: '1',
      name: 'Plant Protein Bowl',
      description: 'Quinoa, roasted vegetables, chickpeas, avocado with tahini dressing',
      price: 279,
      image: plantBowl,
      rating: 4.5,
      restaurant: 'Healthy Bites',
    },
    {
      id: '2',
      name: 'Spring Veg Platter',
      description: 'Grilled seasonal vegetables with herbs and olive oil',
      price: 249,
      image: springVeg,
      rating: 4.3,
      restaurant: 'Green Garden',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <img
            src={heroImage}
            alt="Delicious healthy food"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              {user && (
                <p className="text-lg mb-2 animate-in fade-in">
                  Welcome back, {user.user_metadata?.full_name || 'Guest'}! 👋
                </p>
              )}
              <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-left">
                Delicious Food
              </h1>
              <p className="text-3xl md:text-4xl mb-2">Skip the wait.</p>
              <p className="text-2xl md:text-3xl mb-6">Pick up or dine hassle-free!</p>
              
              <div className="flex gap-4 mb-8">
                <Link to="/menu">
                  <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                    Explore Food
                  </Button>
                </Link>
                <Link to="/table-booking">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    Reserve Table
                  </Button>
                </Link>
              </div>

              <div className="flex gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>24x7 available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span>4.8 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Safe & hygienic</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.name}
                  name={category.name}
                  image={category.image}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <FoodCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Special Offer!</h2>
            <p className="text-xl mb-2">50% OFF up to ₹75</p>
            <p className="mb-6">Use code REZY on orders with items worth ₹150 or more</p>
            <Link to="/menu">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Order Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
