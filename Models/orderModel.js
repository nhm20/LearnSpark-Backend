import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  zoomLink: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    required: true,
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});
orderSchema.index({ userId: 1, tutorId: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;