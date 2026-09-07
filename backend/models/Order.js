import mongoose from 'mongoose';

/**
 * PHASE 4 NOTE (FUTURE EXPANSION):
 * Live GPS Delivery Tracking (e.g. delivery agent real-time coordinates, moving map marker)
 * can be added in a future phase by adding `currentDeliveryAgentLocation: { lat, lng, updatedAt }`
 * to this Order model and using a WebSockets/SSE route. It is intentionally not part of this build.
 */

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  unit: { type: String, default: '1 kg' },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const deliveryAddressSchema = new mongoose.Schema({
  fullAddress: { type: String, default: '' },
  village: { type: String, default: '' },
  taluka: { type: String, default: 'Chikkodi' },
  district: { type: String, default: 'Belagavi' },
  state: { type: String, default: 'Karnataka' },
  pincode: { type: String, default: '' },
  latitude: { type: Number, default: 16.5682 }, // Default Ingali, Chikkodi Taluka
  longitude: { type: Number, default: 74.6534 }
}, { _id: false });

const deliveryHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, default: '' },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  mobile: { type: String },
  address: { type: String, required: true },
  deliveryAddress: { type: deliveryAddressSchema, default: () => ({}) },
  orderType: { type: String, enum: ['Retail', 'Wholesale'], default: 'Retail' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { type: String, enum: ['Pending', 'Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Placed' },
  deliveryStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  deliveryHistory: [deliveryHistorySchema]
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      ret.mobile = ret.mobile || ret.phone;
      ret.deliveryStatus = ret.deliveryStatus || ret.status || 'Placed';
      return ret;
    }
  }
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
