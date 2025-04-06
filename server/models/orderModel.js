//sessionId
//userId
//showId or moviesId
//payment status
//booking status
//priceDetails


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
    required: true,  // Whether the user chose a premium seat or not
  },
  price: {
    type: Number,
    required: true,  // The price for the selected ticket type (base or premium)
  },
  totalAmount: {
    type: Number,
    required: true,  // The total amount for the booking (seats * price)
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
  