// src/pages/user/BookTicket.js
import React, { useState } from 'react';

const Booking = () => {
  const [tickets, setTickets] = useState(1);

  const handleTicketChange = (e) => {
    setTickets(e.target.value);
  };

  const handleBooking = () => {
    // Handle the booking process (e.g., save to the database)
    alert(`Booked ${tickets} ticket(s)`);
  };

  return (
    <div>
      <h2>Book Your Ticket</h2>
      <label>Number of Tickets:</label>
      <input
        type="number"
        value={tickets}
        onChange={handleTicketChange}
        min="1"
      />
      <br />
      <button onClick={handleBooking}>Book Ticket</button>
    </div>
  );
};

export default Booking;
