import e from 'express';
import {createShow,getAllShows,getShowsByTheater,getShowsByMovie,updateShow, deleteShow } from '../controllers/showsControllers.js'
import { authAdmin } from '../middlewares/authAdmin.js';
import { authOwner } from '../middlewares/authOwner.js';
import { authUser } from '../middlewares/authUser.js';
const router = e.Router();

// POST: Create a new show
router.post('/create-show', authOwner,createShow);

// GET: Fetch all shows
router.get('/get-all-shows', getAllShows);

// GET: Fetch shows by theaterId
router.get('/get-shows-id/:theaterId',authUser, getShowsByTheater);

// GET: Fetch shows by movieId
router.get('/get-shows-bymovie/:movieId',authUser, getShowsByMovie);

// PUT: Update a show by ID
router.put('/update-show/:showId',authOwner, updateShow);

// DELETE: Delete a show by ID
router.delete('/delete-show/:showId', authOwner,deleteShow);

export {router as showRouter}
