import mongoose from "mongoose";


// Define the schema for Theater
const theaterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  shows: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
      },
      showTimes: [
        {
          time: {
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
        },
      ],
    },
  ],
  totalSeats: {
    type: Number,
    required: true,
  },
  facilities: [String], // Array of facilities (e.g., "3D", "VIP", "Parking")
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});


export const Theater = mongoose.model('Theater', theaterSchema);