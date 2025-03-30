import express from 'express';
import { createTicket, getTicketsByBooking, markTicketAsUsed, cancelTicket } from '../controllers/ticketController.js';
import { authAdmin } from '../middlewares/authAdmin.js';
import { authUser } from '../middlewares/authUser.js';

const router = express.Router();

// Route to create a ticket (only admins or when a booking is made)
router.post('/create-ticket', authAdmin, createTicket);

// Route to get all tickets for a booking
router.get('/get-tickets/:bookingId', authUser, getTicketsByBooking);

// Route to mark a ticket as used (e.g., when scanned at the theater)
router.put('/mark-ticket-used/:ticketId', authUser, markTicketAsUsed);

// Route to cancel a ticket (admin or user who booked the ticket)
router.put('/cancel-ticket/:ticketId', authUser, cancelTicket);

export { router as ticketRouter };
