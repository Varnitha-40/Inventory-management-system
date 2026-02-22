import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  supplier: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'Out of Stock',
  },
  movement: {
    type: String,
    enum: ['Fast Moving', 'Slow Moving', 'Needs Reorder Soon', ''],
    default: '',
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;