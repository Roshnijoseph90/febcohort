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
  ticketTypes: [
    {
      type: {
        type: [String], // Change from [String] to String since we're storing a single type
        enum: ['standard', 'VIP', '3D', 'IMAX'], // Define the types of seats
        required: true,
      },
      basePrice: {
        type: Number, // Base price for the ticket type (standard seat)
        required: true,
      },
      premiumPrice: {
        type: Number, // Additional price for premium tickets (VIP, 3D, IMAX)
        required: true,
      },
    },
  ], // A list of ticket types with base and premium prices
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export const Show = mongoose.model('Show', ShowSchema);
