import mongoose from 'mongoose';

// Define the schema for Booking
const bookingSchema = new mongoose.Schema({
  /*movieId:{
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie', required: true 
  },*/
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show', // Reference to the Show model
    required: true,
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater', // Reference to the Theater model
    required: true,
  },
  bookedSeatsCount: {
    type: Number,
    required: true,
  },
  selectedSeats: [
    {
      seatId: { type: String, required: true },
      seatLabel: { type: String, required: true },
      seatType: { type: String, required: true }, // Standard, VIP, etc.
    },
  ],
  totalAmount: {
    type: Number,
    required: true, // Store the total amount of the booking
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled','confirmed'],
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (if you have a user system)
    required: true,
  },
}, {
  timestamps: true,
});

export const Booking = mongoose.model('Booking', bookingSchema);
