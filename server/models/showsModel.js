
import mongoose from "mongoose";

// Define the schema for Show
const ShowSchema = new mongoose.Schema({
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  showTime: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  bookedSeats: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },

  // ✅ NESTED seat layout
  seatTypes: [
    {
      seatType: {
        type: String,
        enum: ['Standard', 'VIP', '3D'],
        required: true,
      },
      rows: [
        {
          rowLabel: { type: String, required: true },
          seats: [
            {
              seatId: { type: String, required: true },
              seatLabel: { type: String, required: true },
              price: { type: Number, required: true },
              isBooked: { type: Boolean, default: false },
            },
          ],
        },
      ],
    },
  ],

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export const Show = mongoose.model('Show', ShowSchema);
