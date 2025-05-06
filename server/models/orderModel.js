
import mongoose from 'mongoose';

// Define the schema for Booking
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
 
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  seatsBooked: {
    type: Number,
    required: true,
  },
  ticketType: {
    type: [String],
    enum: ['standard', 'VIP', '3D', 'IMAX'],
    required: true,
  },
  isPremium: {
    type: Boolean,
    required: true, 
  },
  price: {
    type: Number,
    required: true,  
  },
  totalAmount: {
    type: Number,
    required: true,  
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});
export const Order = mongoose.model('Order', orderSchema);
  