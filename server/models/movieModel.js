import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],  
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,  
    required: true,
  },
  poster: {
    type: String, 
    required: true,
    default: 'https://example.com/default-movie-poster.jpg'
  },
  rating: {
    type: Number,  
    min: 1,
    max: 5,
  },
  showtimes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime', // Reference to the Showtime model
    }
  ],
  bookings: [   // Array of booking references (if applicable)
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Reference to the Booking model
    }
  ],
  admin: {    // Reference to Admin who added the movie
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
