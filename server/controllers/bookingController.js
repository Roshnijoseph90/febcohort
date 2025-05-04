
import express from 'express';
import  {Booking} from '../models/bookingModel.js';
import { Show } from '../models/showsModel.js';
import { User } from '../models/usersModel.js';
import Movie from '../models/movieModel.js'
import { Theater } from '../models/theaterModel.js';
const router = express.Router();

const calculateBookingAmount = (seatType, isPremium, seatsBooked) => {
  let basePrice = 0;

  // Set base price based on ticket type
  switch (seatType) {
    case 'VIP':
      basePrice = 300;
      break;
    case '3D':
      basePrice = 250;
      break;
    case 'IMAX':
      basePrice = 200;
      break;
      case 'standard':
    default:
      basePrice = 150; // Default to standard if no valid ticket type is provided
  }

  // If the user chose a premium seat, apply a surcharge
  const premiumSurcharge = isPremium === "true"? 5:0;
  const pricePerTicket = basePrice + premiumSurcharge; 
  const totalAmount = pricePerTicket * seatsBooked;

  return { pricePerTicket, totalAmount };
};
// Controller to create a booking
export const createBooking = async (req, res) => {
  try {
    const { userId,showId, selectedSeats, theaterId, date,timeSlot, isPremium, status } = req.body;

    if (!userId || !showId || !selectedSeats||!Array.isArray(selectedSeats) || selectedSeats.length === 0 ||  !theaterId || !date||!timeSlot) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // Check if user, show, movie, and theater exist
    if (
      !userId ||
      !showId ||
      !Array.isArray(selectedSeats) ||
      selectedSeats.length === 0 ||
      !theaterId ||
      !date||
      !timeSlot
    ) {
      return res.status(400).json({ message: 'Missing or invalid booking fields' });
    }
    // Validate seat types
    const seatTypes = [...new Set(selectedSeats.map(seat => seat.seatType))];
    if (seatTypes.length > 1) {
      return res.status(400).json({ message: 'All selected seats must be of the same seat type' });
    }

    const seatType = seatTypes[0];
    const bookedSeatsCount = selectedSeats.length;

    // Calculate amount
    const { pricePerTicket, totalAmount } = calculateBookingAmount(seatType, isPremium, bookedSeatsCount);

    // Create the booking
    const booking = new Booking({
      userId,
     
      showId,
      theaterId,
      selectedSeats,
      bookedSeatsCount, 
      totalAmount,
      date,
      timeSlot,
      status: status || 'confirmed',
    });

    await booking.save();

    res.status(201).json({booking, message: 'Booking created successfully',});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not create booking' });
  }
};


  
// Controller to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId').populate('showId');
    res.status(200).json({data:bookings,message:"get all booking sucessfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
};

// Controller to get bookings by a specific user
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate('showId');
    res.status(200).json({data:bookings,message:"sucessfully get booking user by Id"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving bookings for this user' });
 
  }
}
// ✅ Controller to get booking by bookingId
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    /*const bookingWithMovie = {
      ...booking.toObject(),
      movieName: booking.movieId?.title || 'Unknown Movie',
      
    };*/
    res.status(200).json({data:booking,message:"sucessfully get booking by bookindId"});
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Controller to cancel a booking
export const cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      // Find the booking by ID and set its status to "cancelled"
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { bookingStatus: 'cancelled' },
        { new: true } 
      );
  
     if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
   res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error cancelling booking' });
    }
  };
  
// Controller to update a booking
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { seatsBooked, seatType, isPremium } = req.body;

   if (!seatsBooked || !seatType) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // Ensure ticketType is an array and take the first element if it is
    const seatTypeToCheck = Array.isArray(seatType) ? seatType[0] : seatType;

    // Validate that the new ticketType is one of the allowed types
    const allowedSeatTypes = ['standard', 'VIP', '3D', 'IMAX'];
    if (!allowedSeatTypes.includes(seatTypeToCheck)) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const calculateBookingAmount = (seatType, isPremium, seatsBooked) => {
      let basePrice = 0;

      // Set base price based on ticket type
      switch (ticketType) {
        case 'VIP':
          basePrice = 300;
          break;
        case '3D':
          basePrice = 250;
          break;
        case 'IMAX':
          basePrice = 200;
          break;
        case 'standard':
          basePrice = 150;
          break;
        default:
          basePrice = 150; // Default to standard if no valid ticket type is provided
      }

     const totalPrice = (basePrice + premiumSurcharge) * seatsBooked;

      return totalPrice;
    };

    // Calculate the new total amount after update
    const totalAmount = calculateBookingAmount(ticketTypeToCheck, isPremium, seatsBooked);

    // Update the booking with new values
    booking.seatsBooked = seatsBooked;
    booking.ticketType = ticketType;
    booking.isPremium = isPremium;
    booking.price = totalAmount / seatsBooked;  

    // Default the status to "pending" if not provided
    booking.bookingStatus = 'confirmed'; 
     await booking.save();

    // Respond with the updated booking details
    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};
