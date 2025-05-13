import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { useSelector } from 'react-redux';

const BookingSummary = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`/booking/get-booking-byId/${userId}`)
        .then((res) => {
          const bookingData = res.data?.data;
          const bookingsArray = Array.isArray(bookingData) ? bookingData : [bookingData];
          setBookings(bookingsArray);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching bookings:', err);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <h2 className="text-center mt-10">⏳ Loading your bookings...</h2>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">🎟️ Your Booking Summary</h1>

      {bookings.length === 0 ? (
        <p className="text-center">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <li key={booking._id} className="border p-4 rounded-lg shadow-md">
               <p><strong>Showtime:</strong> {new Date(booking.date).toDateString()} at {booking.timeSlot}</p>
              <p><strong>Seats:</strong> {booking.selectedSeats.map(seat => seat.seatLabel).join(', ')}</p>
               <p><strong>Seat Type:</strong> {booking.selectedSeats[0]?.seatType || 'N/A'}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Total Paid:</strong> ₹{booking.totalAmount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingSummary;
