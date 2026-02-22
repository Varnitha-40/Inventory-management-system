import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, AlertTriangle, ShoppingCart, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/Dashboard/StatCard';
import { fetchDashboardData } from '../services/api';

// Mock data - would be replaced with API calls
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    newProductsThisMonth: 0,
    inventoryValue: 0,
    categoryData: [],
    stockStatusData: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: dashboardData.totalProducts,
      icon: <Package size={24} />,
      color: 'bg-secondary',
    },
    {
      title: 'Low Stock',
      value: dashboardData.lowStockProducts,
      icon: <AlertTriangle size={24} />,
      color: 'bg-warning',
    },
    {
      title: 'New This Month',
      value: dashboardData.newProductsThisMonth,
      icon: <ShoppingCart size={24} />,
      color: 'bg-success',
    },
    {
      title: 'Inventory Value',
      value: `₹${dashboardData.inventoryValue.toLocaleString('en-IN')}`,
      icon: <DollarSign size={24} />,
      color: 'bg-accent',
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-6"
      >
        Dashboard Overview
      </motion.h1>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statCards.map((card, index) => (
          <motion.div key={index} variants={item}>
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-primary-dark rounded-xl shadow-lg p-4 h-80"
        >
          <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dashboardData.categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A202C', border: 'none' }} 
                labelStyle={{ color: 'white' }} 
              />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="Products" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-primary-dark rounded-xl shadow-lg p-4 h-80"
        >
          <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={dashboardData.stockStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dashboardData.stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-primary-dark rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
        <div className="p-4 border border-secondary rounded-lg">
          <p className="text-gray-300">
            <span className="text-accent font-medium">Anomaly detected: </span>
            The 'Office Supplies\' category has seen a 35% increase in demand over the past week, 
            which is outside the normal pattern. Consider adjusting your stock levels to meet this trend.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;