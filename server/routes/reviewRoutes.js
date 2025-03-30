import e from 'express'
import { addReview ,deleteReviews,getAverageRating,getMoviesReviews} from '../controllers/reviewController.js';
import { authUser } from '../middlewares/authUser.js';

const router = e.Router()

// add review(rating only booked movies)
router.post("/add-review",authUser,addReview)
//averge reviws
router.get("/avg-rating/:movieId",getAverageRating)

//delete review
router.delete("/delete-reviews",authUser,deleteReviews)
//get movie review and rating
router.get("/get-movie-review/:movieId",getMoviesReviews)
//get movie review by specific user










export {router as reviewRouter}