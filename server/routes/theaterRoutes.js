import e from 'express';
import { authOwner } from '../middlewares/authOwner.js';
import { authAdmin } from '../middlewares/authAdmin.js';
import { authUser } from '../middlewares/authUser.js';
import {createTheater,getAllTheaters,getTheaterById,updateTheater, deleteTheater, addShowToTheater, updateShowSeats} from '../controllers/theaterController.js';  // Import the controller

const router = e.Router();

// Create a new theater
router.post('/create-theater', authAdmin,createTheater);

// Get all theaters
router.get('/get-all-theaters',authUser,getAllTheaters);

// Get a specific theater by ID
router.get('/get-theaters-byId/:theaterId', getTheaterById);

// Update a theater by ID
router.put('/update-theater/:theaterId',authOwner, updateTheater);

// Delete a theater by ID
router.delete('/delete-theater/:theaterId', deleteTheater);
// add show to theater
router.post('/add-shows/:theaterId',authOwner,addShowToTheater)
// update shows sets
router.put('/update-showseats/:theaterId/:showId',authOwner,updateShowSeats)

export {router as theaterRouter}