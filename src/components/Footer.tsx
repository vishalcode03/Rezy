import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[hsl(0,0%,10%)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-full bg-accent p-2">
                <Leaf className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold">REZY</span>
            </div>
            <p className="text-gray-400 text-sm">
              Smart food ordering & restaurant reservations
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Food Ordering</li>
              <li className="text-gray-400">Table Reservation</li>
              <li className="text-gray-400">Restaurant Partners</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: hello@rezy.com</li>
              <li>Phone: +91 9045523588</li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} REZY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
