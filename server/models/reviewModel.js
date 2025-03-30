import mongoose from "mongoose";

// Define the schema for Review
const reviewSchema= new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Reference to the Movie model
    required: true,
  },
  
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Rating is a number between 1 and 5
  },
  reviewText: {
    type: String,
   required: true, // Review content
    trim: true,
    maxlength:500,
  },
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export const Review = mongoose.model('Review',reviewSchema);

