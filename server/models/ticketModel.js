import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Reference to the Booking model
      required: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show', // Reference to the Show model
      required: true,
    },
    seatNumber: {
      type: String, // The seat number, e.g., "A1", "B2"
      required: true,
    },
    ticketType: {
      type: String,
      enum: ['standard', 'VIP', '3D', 'IMAX'],
      required: true,
    },
    price: {
      type: Number,
      required: true, // Price of this particular ticket
    },
    isUsed: {
      type: Boolean,
      default: false, // Indicates if the ticket has been used
    },
    ticketStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'used'],
      default: 'confirmed', // Tracks the ticket status
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export const Ticket = mongoose.model('Ticket', TicketSchema);
