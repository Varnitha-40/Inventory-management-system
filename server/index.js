import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, quantity, price, supplier } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Product name and category are required' });
    }
    
    const product = await Product.create({
      name,
      category,
      quantity: Number(quantity),
      price: Number(price),
      supplier,
      status: quantity > 10 ? 'In Stock' : quantity > 0 ? 'Low Stock' : 'Out of Stock',
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const products = await Product.find();
    
    // Calculate dashboard metrics
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.status === 'Low Stock').length;
    const now = new Date();
    const newProductsThisMonth = products.filter(p => {
      const productDate = new Date(p.createdAt);
      return (
        productDate.getMonth() === now.getMonth() &&
        productDate.getFullYear() === now.getFullYear()
      );
    }).length;
    
    const inventoryValue = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    
    // Create category data
    const categories = {};
    products.forEach(product => {
      if (categories[product.category]) {
        categories[product.category]++;
      } else {
        categories[product.category] = 1;
      }
    });
    
    const categoryData = Object.keys(categories).map(name => ({
      name,
      value: categories[name],
    }));
    
    // Create stock status data
    const stockStatusData = [
      { 
        name: 'In Stock', 
        value: products.filter(p => p.status === 'In Stock').length
      },
      { 
        name: 'Low Stock', 
        value: products.filter(p => p.status === 'Low Stock').length
      },
      { 
        name: 'Out of Stock', 
        value: products.filter(p => p.status === 'Out of Stock').length
      },
    ];
    
    res.json({
      totalProducts,
      lowStockProducts,
      newProductsThisMonth,
      inventoryValue,
      categoryData,
      stockStatusData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});