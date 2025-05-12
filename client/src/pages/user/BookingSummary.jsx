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
        .get(`/booking/user/${userId}`)
        .then((res) => {
          setBookings(res.data);
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
              <p><strong>Movie:</strong> {booking.movieTitle}</p>
              <p><strong>Theater:</strong> {booking.theaterName}</p>
              <p><strong>Showtime:</strong> {booking.date} at {booking.timeSlot}</p>
              <p><strong>Seats:</strong> {booking.selectedSeats?.join(', ')}</p>
              <p><strong>Ticket Type:</strong> {booking.ticketType}</p>
              <p><strong>Premium:</strong> {booking.isPremium ? 'Yes' : 'No'}</p>
              <p><strong>Total Paid:</strong> ₹{booking.totalAmount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingSummary;
