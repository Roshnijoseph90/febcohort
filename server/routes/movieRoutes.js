import e from 'express'; // Use express to create a router
import { authUser } from '../middlewares/authUser.js'; // Import the authUser middleware
import { createMovie, getAllMovies, moviesDetails ,updateMovie,search,deactivateMovie, deleteMovie} from '../controllers/movieControllers.js'; // Import controller functions
import { authOwner } from '../middlewares/authOwner.js';
import { upload } from '../middlewares/multer.js';
//import { cloudinaryInstance } from './cloudinary'; 

const router = e.Router(); // Create a new router instance

// Route for getting all movies
router.get('/getAllMovies', getAllMovies);

// Route for getting movie details
router.get('/moviesDetails/:movieId', moviesDetails);

// Route for creating a new movie (protected route)
router.post('/create-movie',authOwner,upload.single("poster") ,createMovie); 
//update
router.put('/update-movie/:movieId', authOwner, upload.single('poster'), updateMovie)

//search movies based on...tile,genre
router.get('/search',authUser,search)
//deactivate
router.put('/deactivate-movie/:movieId',authOwner,deactivateMovie)

//delete
router.delete('/delete-movie/:movieId',authOwner,deleteMovie)
export { router as movieRouter }; // Export the router as movieRouter
