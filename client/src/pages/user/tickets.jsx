import React from 'react';

const Tickets = ({ ticketTypes, ticketType, setTicketType }) => {
  return (
    <div>
      <label>
        Ticket Type:
        <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
          {ticketTypes.map((ticket) => (
            <option key={ticket.type} value={ticket.type}>
              {ticket.type} - ${ticket.basePrice} (Premium: ${ticket.premiumPrice})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Tickets;
