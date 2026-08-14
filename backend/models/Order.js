import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  unit: { type: String, default: '1 kg' },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, default: '' },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  mobile: { type: String },
  address: { type: String, required: true },
  orderType: { type: String, enum: ['Retail', 'Wholesale'], default: 'Retail' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], default: 'Pending' }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      ret.mobile = ret.mobile || ret.phone;
      return ret;
    }
  }
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
