import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  unit: { type: String, default: '1 kg' },
  image: { type: String, default: '/images/placeholder.jpg' },
  imageUrl: { type: String },
  description: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  isPlaceholderPrice: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      ret.image = ret.imageUrl || ret.image;
      return ret;
    }
  }
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
