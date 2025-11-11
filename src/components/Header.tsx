import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import UserProfileDropdown from './UserProfileDropdown';

const Header = () => {
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary to-secondary shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-full bg-accent p-2">
            <Leaf className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary-foreground">REZY</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary-foreground ${
              isActive('/') ? 'text-primary-foreground' : 'text-primary-foreground/80'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className={`text-sm font-medium transition-colors hover:text-primary-foreground ${
              isActive('/menu') ? 'text-primary-foreground' : 'text-primary-foreground/80'
            }`}
          >
            Menu
          </Link>
          <Link 
            to="/table-booking" 
            className={`text-sm font-medium transition-colors hover:text-primary-foreground ${
              isActive('/table-booking') ? 'text-primary-foreground' : 'text-primary-foreground/80'
            }`}
          >
            Book Table
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors hover:text-primary-foreground ${
              isActive('/about') ? 'text-primary-foreground' : 'text-primary-foreground/80'
            }`}
          >
            About us
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium transition-colors hover:text-primary-foreground ${
              isActive('/contact') ? 'text-primary-foreground' : 'text-primary-foreground/80'
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-white/20">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-accent p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          {user ? (
            <UserProfileDropdown />
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
