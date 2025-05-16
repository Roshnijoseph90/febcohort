import { Ticket } from '../models/ticketModel.js';
import { Booking } from '../models/bookingModel.js';

// Create a ticket for a booking
/*export const createTicket = async (req, res) => {
  try {
    const { bookingId, seatNumber, ticketType, price } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create a new ticket
    const ticket = new Ticket({
      bookingId,
      showId: booking.showId,
      seatNumber,
      ticketType,
      price,
    });

    await ticket.save();
    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error creating ticket', error: err.message });
  }
};*/
export const createTicket = async (req, res) => {
  try {
    const ticketsInput = req.body;

    // Check if it's an array or a single object
    const ticketRequests = Array.isArray(ticketsInput) ? ticketsInput : [ticketsInput];

    const createdTickets = [];

    for (const ticketData of ticketRequests) {
      const { bookingId, seatNumber, ticketType, price } = ticketData;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: `Booking not found for ID: ${bookingId}` });
      }

      const ticket = new Ticket({
        bookingId,
        showId: booking.showId,
        seatNumber,
        ticketType,
        price,
      });

      await ticket.save();
      createdTickets.push(ticket);
    }

    res.status(201).json({
      message: 'Tickets created successfully',
      tickets: createdTickets,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating ticket(s)', error: err.message });
  }
};


// Get all tickets for a specific booking
export const getTicketsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const tickets = await Ticket.find({ bookingId });
    if (!tickets) {
      return res.status(404).json({ message: 'No tickets found for this booking' });
    }

    res.status(200).json({data:tickets,messgage:"sucessfully get ticket by booing id"});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err.message });
  }
};

// Mark a ticket as used (when user enters the theater)
export const markTicketAsUsed = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.isUsed) {
      return res.status(400).json({ message: 'Ticket is already used' });
    }

    ticket.isUsed = true;
    ticket.ticketStatus = 'used';  // Update the status to 'used'
    await ticket.save();

    res.status(200).json({ message: 'Ticket marked as used', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error marking ticket as used', error: err.message });
  }
};

// Cancel a ticket (either admin or the user who booked it)
export const cancelTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.ticketStatus = 'cancelled';
    await ticket.save();

    res.status(200).json({ message: 'Ticket cancelled successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling ticket', error: err.message });
  }
};
