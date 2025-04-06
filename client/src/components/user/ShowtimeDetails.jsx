import React from 'react';

const ShowtimeDetails = ({ showtimeDetails, seatsBooked, setSeatsBooked, ticketType, setTicketType }) => {
  return (
    <div>
      <h3>Showtime Details</h3>
      <p>Theater: {showtimeDetails.theaterName}</p>
      <p>Movie: {showtimeDetails.movieTitle}</p>
      <p>Showtime: {showtimeDetails.showTime}</p>
      <p>Available Seats: {showtimeDetails.availableSeats}</p>
      <p>Price: ${showtimeDetails.price}</p>

      <div>
        <label>
          Seats to Book:
          <input
            type="number"
            value={seatsBooked}
            onChange={(e) => setSeatsBooked(e.target.value)}
            max={showtimeDetails.availableSeats}
          />
        </label>
      </div>

      <div>
        <label>
          Ticket Type:
          <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
            {showtimeDetails.ticketTypes.map((ticket) => (
              <option key={ticket.type} value={ticket.type}>
                {ticket.type} - ${ticket.basePrice} (Premium: ${ticket.premiumPrice})
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default ShowtimeDetails;
