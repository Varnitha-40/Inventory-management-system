import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Navigation/Sidebar';
import Header from '../components/Navigation/Header';
import { motion } from 'framer-motion';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-primary-light overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <motion.main 
          className="flex-1 overflow-y-auto bg-primary p-4 md:p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout;