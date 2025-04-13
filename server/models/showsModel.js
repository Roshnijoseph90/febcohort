import mongoose from "mongoose";

// Define the schema for Show
const ShowSchema = new mongoose.Schema({
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater', // Reference to the Theater model
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Reference to the Movie model
    required: true,
  },
  showTime: {
    type: Date, // The showtime (e.g., "2025-03-14T15:00:00Z")
    required: true,
  },
  availableSeats: {
    type: Number, // Total number of available seats for this specific showtime
    required: true,
  },
  bookedSeats: {
    type: Number,
    default: 0, // Initially, no seats are booked
  },
  price: {
    type: Number, // Base price of the ticket for this show (standard ticket price)
    required: true,
  },
  seats: [  // Array of seats
    {
      seatId: { type: String, required: true }, // Seat identifier (A1, B1, etc.)
      seatLabel: { type: String, required: true }, // Seat label (same as seatId)
      seatType: { type: String, enum: ['Standard', 'VIP', '3D'], required: true }, // Seat type
      basePrice: { type: Number, required: true }, // Base price (for standard seats)
      premiumPrice: { type: Number, required: true }, // Premium price (for VIP, 3D, etc.)
      isBooked: { type: Boolean, default: false }, // Whether the seat is booked or not
    }
  ],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export const Show = mongoose.model('Show', ShowSchema);
