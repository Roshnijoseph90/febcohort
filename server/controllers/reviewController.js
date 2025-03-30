import  {Review}  from "../models/reviewModel.js";
import Movie from '../models/movieModel.js'

export const addReview = async (req, res, next) => {
  try {
      // Ensure the user is authenticated by checking req.user
      if (!req.user || !req.user.id) {
          return res.status(400).json({ message: 'User is not authenticated' });
      }

      const { movieId, rating, reviewText } = req.body;

      if (!movieId) {
          return res.status(400).json({ message: 'movieId is required' });
      }

      // Fetch the movie from the database
      const movie = await Movie.findById(movieId);
      if (!movie) {
          return res.status(404).json({ message: 'Movie not found' });
      }

      // Validate the rating
      if (rating > 5 || rating < 1) {
          return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
      }

      const userId = req.user.id;

     const newReview = await Review.findOneAndUpdate(
          { userId, movieId },  // Use the authenticated user's ID and the movieId
          { rating, reviewText },
          { new: true, upsert: true }
      );

      res.status(201).json({ data: newReview, message: 'Review added successfully' });
  } catch (error) {
      // Handle errors and send a response
      res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
  }
};
export const getMoviesReviews = async (req, res) => {
    try {
        const { movieId } = req.params;
        const reviews = await Review.find({ movieId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this movie' });
        }

        return res.status(200).json({ data: reviews, message: "Movie reviews fetched" });

    } catch (error) {
        // Handle errors and send a response
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    }
}

export const deleteReviews = async(req,res)=>{
    try{
        const{reviewId}= req.params;
        const userId = req.user.id;
        const review = await Review.findOneAndDelete({id:reviewId,userId})
        if(!review){
            return res.status(401).json({message:"review not found or not authorized"})
        }
        res.status(200).json({data:review,message:"Review deleted sucessfully"})
       
    } catch (error) {
        // Handle errors and send a response
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    }
}
export const getAverageRating = async (req, res) => {
    try {
        const { movieId } = req.params;
        const reviews = await Review.find({ movieId });

        // Check if there are no reviews
        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this movie' });
        }

        // Calculate the average rating using reduce
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        // Return the average rating
        res.status(200).json({ averageRating });
    } catch (error) {
        // Handle errors and send a response
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    }
};



