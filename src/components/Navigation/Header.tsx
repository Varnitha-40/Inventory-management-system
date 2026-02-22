import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, LogOut, Settings, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/add-product', label: 'Add Product' },
    { path: '/inventory', label: 'View Inventory' },
    { path: '/predict', label: 'Predict Demand' },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.header 
      className="bg-primary-dark shadow-md z-10 relative"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded-md hover:bg-primary-light transition-colors lg:hidden mr-4"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 flex items-center space-x-12">
            <h1 className="text-xl font-semibold text-white">InventAI</h1>
            
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-accent border-b-2 border-accent pb-1'
                      : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-accent/50 pb-1'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <motion.button
                onClick={toggleProfile}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-primary-light"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className="text-white text-sm hidden md:block">{user?.name}</span>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-primary-dark border border-gray-700 rounded-lg shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-primary-light transition-colors flex items-center"
                    >
                      <UserCircle size={16} className="mr-2" />
                      View Profile
                    </button>
                    
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-primary-light transition-colors flex items-center"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                    
                    <div className="border-t border-gray-700 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-error hover:text-error-light hover:bg-primary-light transition-colors flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;