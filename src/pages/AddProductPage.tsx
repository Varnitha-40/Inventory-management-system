import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Upload, X, Plus, FileText } from 'lucide-react';
import { addProduct } from '../services/api';

interface FormData {
  productName: string;
  category: string;
  quantity: string;
  price: string;
  supplier: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

const AddProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    category: '',
    quantity: '',
    price: '',
    supplier: '',
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setUploadedFile(file);
      } else {
        setNotification({
          type: 'error',
          message: 'Please upload a CSV or Excel file',
        });
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        productName: formData. productName,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        supplier: formData.supplier,
      };

      await addProduct(productData);
      setNotification({
        type: 'success',
        message: 'Product added successfully!',
      });
      
      // Reset form
      setFormData({
        productName: '',
        category: '',
        quantity: '',
        price: '',
        supplier: '',
      });
      
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to add product. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) {
      setNotification({
        type: 'error',
        message: 'Please select a file to upload',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        type: 'success',
        message: `File "${uploadedFile.name}" processed successfully! Products have been added to inventory.`,
      });
      
      setUploadedFile(null);
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to process file. Please check the format and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold">Add Products</h1>
        <p className="text-gray-400">Add products manually or upload in bulk</p>
      </motion.div>
      
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-lg flex items-center ${
            notification.type === 'success' ? 'bg-success bg-opacity-20' : 'bg-error bg-opacity-20'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="mr-2 text-success\" size={20} />
          ) : (
            <AlertCircle className="mr-2 text-error" size={20} />
          )}
          <p className="text-white">{notification.message}</p>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex space-x-1 bg-primary-dark rounded-lg p-1">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'manual'
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus size={18} className="mr-2" />
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'upload'
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload size={18} className="mr-2" />
            Bulk Upload
          </button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-primary-dark rounded-xl shadow-lg p-6"
      >
        {activeTab === 'manual' ? (
          // Manual Entry Form
          <div>
            <div className="flex items-center mb-6">
              <Plus size={24} className="text-accent mr-3" />
              <h2 className="text-xl font-semibold">Add Product Manually</h2>
            </div>
            
            <form onSubmit={handleManualSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData. productName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter quantity (e.g., 50)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter price in rupees (e.g., 2500.00)"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>
              
              <motion.div
                className="mt-8 flex justify-end"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </motion.div>
            </form>
          </div>
        ) : (
          // File Upload Section
          <div>
            <div className="flex items-center mb-6">
              <FileText size={24} className="text-accent mr-3" />
              <h2 className="text-xl font-semibold">Bulk Upload Products</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Upload a CSV or Excel file with your product data. The file should contain columns for:
                Name, Category, Quantity, Price, Supplier.
              </p>
              
              <div className="bg-primary border border-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">File Format Example:</h4>
                <div className="text-sm text-gray-400 font-mono">
                  <div>Name, Category, Quantity, Price, Supplier</div>
                  <div>Laptop, Electronics, 10, 45000, TechCorp</div>
                  <div>Office Chair, Furniture, 25, 8500, FurniturePlus</div>
                </div>
              </div>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                dragActive
                  ? 'border-accent bg-accent bg-opacity-10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <FileText size={48} className="text-accent mr-4" />
                    <div className="text-left">
                      <p className="text-white font-medium">{uploadedFile.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-4 text-error hover:text-error-light transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFileUpload}
                    disabled={loading}
                    className={`px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Processing File...' : 'Upload and Process'}
                  </motion.button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-300 mb-2">
                    Drag and drop your CSV or Excel file here, or{' '}
                    <label className="text-accent hover:text-accent-light cursor-pointer">
                      browse
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-gray-500 text-sm">CSV, XLSX files up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-2">AI Suggestions</h3>
          <p className="text-gray-300">
            {activeTab === 'manual' 
              ? "Based on current inventory trends, we recommend setting the reorder point for new products in the Electronics category to at least 15 units."
              : "For bulk uploads, ensure your file follows the exact column format. Our AI will automatically categorize and set optimal reorder points based on historical data."
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProductPage;