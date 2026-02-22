import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Plus, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const cards = [
    {
      title: 'Dashboard',
      description: 'View inventory metrics and analytics',
      icon: <BarChart2 size={28} />,
      path: '/dashboard',
      color: 'bg-secondary',
    },
    {
      title: 'Add Product',
      description: 'Add new products to inventory',
      icon: <Plus size={28} />,
      path: '/add-product',
      color: 'bg-accent',
    },
    {
      title: 'View Inventory',
      description: 'Manage and track your inventory',
      icon: <Package size={28} />,
      path: '/inventory',
      color: 'bg-success',
    },
    {
      title: 'Predict Demand',
      description: 'AI-powered inventory forecasting',
      icon: <TrendingUp size={28} />,
      path: '/predict',
      color: 'bg-warning',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to InventAI</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          AI-powered inventory management system to optimize your stock and predict future demand
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`${card.color} rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300`}
            onClick={() => navigate(card.path)}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                  {card.icon}
                </div>
                <h2 className="text-xl font-semibold">{card.title}</h2>
              </div>
              <p className="text-gray-200">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Powered by Advanced AI</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Our system uses machine learning algorithms to analyze historical data and predict
          future product demand, helping you minimize stockouts and overstocking.
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;