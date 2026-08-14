import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, default: 'Shri Datta Admin' },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret.password;
      return ret;
    }
  }
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;
