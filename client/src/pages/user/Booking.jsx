// BookingPage.js

import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Button, DatePicker, Select, InputNumber, Row, Col } from "antd";

export const BookingPage = () => {
  const { id } = useParams();  // Movie ID
  const [movieDetails, isLoading, error] = useFetch(`/movie/moviesDetails/${id}`);
  
  const [theatre, setTheatre] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Assume these data come from the server
  const theatres = ["Theatre 1", "Theatre 2", "Theatre 3"];
  const showTimes = ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        return prevSelectedSeats.filter(seat => seat !== seatNumber);
      } else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

  useEffect(() => {
    // Calculate the total price based on selected seats and movie details
    const pricePerTicket = movieDetails?.ticketPrice || 150;
    setTotalAmount(pricePerTicket * selectedSeats.length);
  }, [selectedSeats, movieDetails]);

  return (
    <div style={{ padding: "20px" }}>
      <h3>Booking for: {movieDetails?.title}</h3>

      {/* Select Theatre */}
      <Select 
        placeholder="Select Theatre" 
        value={theatre}
        onChange={setTheatre} 
        style={{ width: 200, marginBottom: "20px" }}
      >
        {theatres.map((theatre) => (
          <Select.Option key={theatre} value={theatre}>{theatre}</Select.Option>
        ))}
      </Select>

      {/* Select Date */}
      <DatePicker 
        onChange={(date, dateString) => setDate(dateString)} 
        style={{ marginBottom: "20px" }} 
      />

      {/* Select Time */}
      <Select 
        placeholder="Select Show Time" 
        value={time}
        onChange={setTime} 
        style={{ width: 200, marginBottom: "20px" }}
      >
        {showTimes.map((showTime, index) => (
          <Select.Option key={index} value={showTime}>{showTime}</Select.Option>
        ))}
      </Select>

      {/* Select Seats */}
      <Row gutter={16}>
        {[...Array(10)].map((_, index) => (
          <Col span={3} key={index}>
            <Button 
              style={{ 
                backgroundColor: selectedSeats.includes(index + 1) ? "green" : "gray", 
                color: "white" 
              }} 
              onClick={() => handleSeatSelection(index + 1)}
            >
              {index + 1}
            </Button>
          </Col>
        ))}
      </Row>

      {/* Seats & Total Amount */}
      <div style={{ marginTop: "20px" }}>
        <p>Selected Seats: {selectedSeats.join(", ")}</p>
        <p>Total Price: ${totalAmount}</p>
      </div>

      <Button type="primary" onClick={() => alert('Booking confirmed!')}>Confirm Booking</Button>
    </div>
  );
};

export default BookingPage;
