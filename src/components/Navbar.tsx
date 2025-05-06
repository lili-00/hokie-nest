import { Link } from 'react-router-dom';
import { Home, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6" />
              <span className="font-bold text-xl">Hokie Nest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/properties" className="hover:text-secondary transition-colors">
                Properties
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="hover:text-secondary transition-colors">
                    Profile
                  </Link>
                  {/* Add more authenticated user links here */}
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center space-x-1 hover:text-secondary transition-colors">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-1 bg-secondary hover:bg-secondary-hover px-4 py-2 rounded-md transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-secondary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden",
        isMenuOpen ? "block" : "hidden"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/properties"
            className="block px-3 py-2 rounded-md hover:bg-primary-hover"
            onClick={toggleMenu}
          >
            Properties
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md hover:bg-primary-hover"
              onClick={toggleMenu}
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md hover:bg-primary-hover"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md hover:bg-primary-hover"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}