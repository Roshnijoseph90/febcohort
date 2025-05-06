import mongoose from "mongoose";

// Define the schema for Review
const reviewSchema= new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', 
  },
  
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, 
  },
  reviewText: {
    type: String,
   required: true, // Review content
    trim: true,
    maxlength:500,
  },
  
}, {
  timestamps: true, 
});

export const Review = mongoose.model('Review',reviewSchema);

