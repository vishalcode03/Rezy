import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FoodCard from '@/components/FoodCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import plantBowl from '@/assets/plant-protein-bowl.jpg';
import springVeg from '@/assets/spring-veg-platter.jpg';
import pizza from '@/assets/pizza.jpg';
import biryani from '@/assets/biryani.jpg';
import burger from '@/assets/burger.jpg';
import dessert from '@/assets/dessert.jpg';

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const menuItems = [
    {
      id: '1',
      name: 'Plant Protein Bowl',
      description: 'Quinoa, roasted vegetables, chickpeas, avocado with tahini dressing',
      price: 279,
      image: plantBowl,
      rating: 4.5,
      category: 'healthy',
      restaurant: 'Healthy Bites',
    },
    {
      id: '2',
      name: 'Spring Veg Platter',
      description: 'Grilled seasonal vegetables with herbs and olive oil',
      price: 249,
      image: springVeg,
      rating: 4.3,
      category: 'healthy',
      restaurant: 'Green Garden',
    },
    {
      id: '3',
      name: 'Margherita Pizza',
      description: 'Fresh tomatoes, mozzarella, basil on wood-fired crust',
      price: 399,
      image: pizza,
      rating: 4.7,
      category: 'pizza',
      restaurant: 'Pizza Palace',
    },
    {
      id: '4',
      name: 'Hyderabadi Biryani',
      description: 'Aromatic basmati rice with tender meat and spices',
      price: 349,
      image: biryani,
      rating: 4.8,
      category: 'biryani',
      restaurant: 'Biryani House',
    },
    {
      id: '5',
      name: 'Classic Burger',
      description: 'Juicy beef patty with fresh vegetables and special sauce',
      price: 229,
      image: burger,
      rating: 4.4,
      category: 'burgers',
      restaurant: 'Burger Barn',
    },
    {
      id: '6',
      name: 'Chocolate Delight',
      description: 'Rich chocolate cake with berries and cream',
      price: 189,
      image: dessert,
      rating: 4.6,
      category: 'desserts',
      restaurant: 'Sweet Treats',
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6">Explore Restaurants</h1>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for dishes or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-muted">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="healthy">Healthy</TabsTrigger>
                <TabsTrigger value="pizza">Pizza</TabsTrigger>
                <TabsTrigger value="biryani">Biryani</TabsTrigger>
                <TabsTrigger value="burgers">Burgers</TabsTrigger>
                <TabsTrigger value="desserts">Desserts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} {...item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No items found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
