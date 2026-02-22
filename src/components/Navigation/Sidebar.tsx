import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          className={`fixed inset-y-0 left-0 w-64 bg-primary-dark shadow-lg z-30 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}
          variants={sidebarVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">InventAI</h2>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="p-4 bg-secondary-dark rounded-lg">
              <h4 className="text-white font-medium mb-2">Need Help?</h4>
              <p className="text-sm text-gray-300">Click the chat widget to get assistance</p>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default Sidebar;