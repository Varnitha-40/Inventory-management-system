export interface Product {
  _id?: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  movement: 'Fast Moving' | 'Slow Moving' | 'Needs Reorder Soon' | '';
}