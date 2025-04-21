import express from 'express';
import {createBooking,getBookingById, getAllBookings,getBookingsByUser,updateBooking,cancelBooking}  from '../controllers/bookingController.js';
import { authAdmin } from '../middlewares/authAdmin.js';
import { authOwner } from '../middlewares/authOwner.js';
import { authUser } from '../middlewares/authUser.js';
const router = express.Router();

// Route to create a booking
router.post('/create-booking', authUser,createBooking);

// Route to get all bookings (for admin or user)
router.get('/get-all-booking', authAdmin,getAllBookings);

// Route to get bookings by a specific user
router.get('/get-booking-byId/:userId', authUser,getBookingsByUser);
// Route to get booking by id
router.get('/get-booking-by-bookingId/:bookingId', authUser, getBookingById);
// Route to update booking status (e.g., from pending to confirmed or cancelled)
router.put('/update-booking/:bookingId',authUser, updateBooking);

// Route to cancel a booking
router.delete('/cancel-booking/:bookingId',authUser, cancelBooking);


export {router as bookingRouter}