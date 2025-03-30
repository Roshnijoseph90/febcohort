import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        //trim: true, // Trims any extra spaces
      },
      description: {
        type: String,
        required: true,
      },
      genre: {
        type: [String],  // Array of genres (e.g., ['Action', 'Comedy'])
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
        type: Number,  // Duration in minutes
        required: true,
      },
      poster: {
        type: String,  // URL of the movie poster image
        required: true,
        default: 'https://example.com/default-movie-poster.jpg'
      },
      rating: {
        type: Number,  // Movie rating (e.g., 7.8 out of 10)
        min: 1,
        max: 5,
      },
      showtimes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Showtime', // Reference to the Showtime model
        },
      ],
      isActive:{
        type:Boolean,
        default:true
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
    
    // Create the Movie model
    const Movie = mongoose.model('Movie', movieSchema);
    export default Movie;