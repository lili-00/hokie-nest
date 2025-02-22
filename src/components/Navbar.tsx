import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold">StudentHousing</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/properties" className="flex items-center space-x-1 text-white/90 hover:text-secondary transition-colors">
              <Search className="h-5 w-5" />
              <span>Browse Properties</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white/90">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-white/90 hover:text-secondary transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center space-x-1 text-white/90 hover:text-secondary transition-colors">
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-hover transition-colors"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}