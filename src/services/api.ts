import { Product } from '../types/product';

// Mock data for development - replace with actual API calls when backend is ready
const mockProducts: Product[] = [
  {
    _id: '1',
    productName: 'Wireless Headphones',
    category: 'Electronics',
    quantity: 45,
    price: 99.99,
    supplier: 'TechCorp',
    status: 'In Stock',
    movement: 'Fast Moving'
  },
  {
    _id: '2',
    productName: 'Office Chair',
    category: 'Furniture',
    quantity: 8,
    price: 249.99,
    supplier: 'FurniturePlus',
    status: 'Low Stock',
    movement: 'Slow Moving'
  },
  {
    _id: '3',
    productName: 'Coffee Beans',
    category: 'Food & Beverages',
    quantity: 0,
    price: 12.99,
    supplier: 'CoffeeCo',
    status: 'Out of Stock',
    movement: 'Needs Reorder Soon'
  },
  {
    _id: '4',
    productName: 'Laptop Stand',
    category: 'Office Supplies',
    quantity: 23,
    price: 39.99,
    supplier: 'OfficeMax',
    status: 'In Stock',
    movement: 'Fast Moving'
  },
  {
    _id: '5',
    productName: 'Bluetooth Speaker',
    category: 'Electronics',
    quantity: 15,
    price: 79.99,
    supplier: 'AudioTech',
    status: 'In Stock',
    movement: ''
  }
];

const API_URL = 'http://localhost:5000/api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch dashboard data
export const fetchDashboardData = async () => {
  await delay(500); // Simulate network delay
  
  try {
    // Try to fetch from API first, fallback to mock data
    const response = await fetch(`${API_URL}/dashboard`).catch(() => null);
    
    if (response && response.ok) {
      return await response.json();
    }
    
    // Fallback to mock data calculation
    const products = mockProducts;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.status === 'Low Stock').length;
    const newProductsThisMonth = 2; // Mock value
    
    const inventoryValue = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    
    // Create category data
    const categories: { [key: string]: number } = {};
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
    
    return {
      totalProducts,
      lowStockProducts,
      newProductsThisMonth,
      inventoryValue,
      categoryData,
      stockStatusData,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Fetch inventory
export const fetchInventory = async (): Promise<Product[]> => {
  await delay(300); // Simulate network delay
  
  try {
    // Try to fetch from API first, fallback to mock data
   const response = await fetch(`${API_URL}/items`)
    
    if (response && response.ok) {
      return await response.json();
    }
    
    // Fallback to mock data
    return mockProducts;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return mockProducts; // Return mock data on error
  }
};

// Add product
export const addProduct = async (productData: any): Promise<any> => {
  await delay(800); // Simulate network delay
  
  try {
    // Try to add via API first
    const response = await fetch(`${API_URL}/items`,  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    }).catch(() => null);
    
    if (response && response.ok) {
      return await response.json();
    }
    
    // Fallback: simulate successful addition
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      status: productData.quantity > 10 ? 'In Stock' : productData.quantity > 0 ? 'Low Stock' : 'Out of Stock',
      movement: ''
    };
    
    // Add to mock data for this session
    mockProducts.push(newProduct);
    
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};