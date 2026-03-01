import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { fetchInventory } from '../services/api';

interface Product {
  _id?: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  movement: 'Fast Moving' | 'Slow Moving' | 'Needs Reorder Soon' | '';
}

const ViewInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data);
        setFilteredInventory(data);
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  useEffect(() => {
    let result = inventory;
    
    if (searchTerm) {
      result = result.filter(
        product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (category) {
      result = result.filter(product => product.category === category);
    }
    
    if (status) {
      result = result.filter(product => product.status === status);
    }
    
    setFilteredInventory(result);
  }, [searchTerm, category, status, inventory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-success text-white';
      case 'Low Stock':
        return 'bg-warning text-white';
      case 'Out of Stock':
        return 'bg-error text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle size={16} />;
      case 'Low Stock':
        return <Clock size={16} />;
      case 'Out of Stock':
        return <AlertTriangle size={16} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-xl">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold">Inventory Management</h1>
        <p className="text-gray-400">View and manage your product inventory</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-primary-dark rounded-xl shadow-lg p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name or supplier"
              className="w-full pl-10 p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Food & Beverages">Food & Beverages</option>
              </select>
            </div>
            
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary-dark rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-primary-light">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price (₹)
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Movement
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((product) => (
                  <motion.tr 
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{product.productName}</div>
                      <div className="text-xs text-gray-400">{product.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        <span className="mr-1">{getStatusIcon(product.status)}</span>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.movement && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.movement === 'Fast Moving' 
                            ? 'bg-success bg-opacity-20 text-success' 
                            : product.movement === 'Slow Moving'
                            ? 'bg-warning bg-opacity-20 text-warning'
                            : 'bg-error bg-opacity-20 text-error'
                        }`}>
                          {product.movement}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-300">
                    No products found matching the criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewInventoryPage;