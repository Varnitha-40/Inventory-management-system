import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <motion.div 
      className={`${color} rounded-xl shadow-lg p-6`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center mb-3">
        <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="text-3xl font-semibold">{value}</div>
    </motion.div>
  );
};

export default StatCard;