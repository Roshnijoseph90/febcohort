/*import React from 'react'
import useFetch from '../../hooks/useFetch'
import { loadStripe } from '@stripe/stripe-js';  // Corrected the case

import axios from 'axios'
import MoviesDetails from './MoviesDetails'
//import { Session } from 'node:inspector'

const BookingPage = () => {
  
  const [BookingData, isLoading, error] = useFetch("/booking/create-booking")
  const errorMessage = error?.response?.data?.message || "Unable to book ticket"
  const makePayment = async()=>{
    try{
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_publishable_key)
      const session = await axios({
        url:"/payment/create-checkout-session",
        method:"POST",
        data:{products:BookingData?.movies},
      })
      console.log(session,"====session")
      const result = stripe.redirectToCheckout({
         sessionId:session.data.sessionId,
      })
    }catch(error){
      console.log(error)
    }
  }

  
  // Log data for debugging purposes
  console.log("==== BookingData", BookingData)
  console.log("Error Message:", errorMessage)
  
  
  if (error) return <p>{errorMessage}</p>
  
  // Render booking data (if available)*/
  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Theater from '../../components/user/Theatre';
import ShowtimeDetails from '../../components/user/ShowtimeDetails';
import Seat from '../../components/user/Seat'
import Tickets from '../../pages/user/Tickets';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from 'antd';

const BookingPage = ({ movieId, theaterId }) => {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(2); // Example: Number of seats to book
  const [ticketType, setTicketType] = useState('VIP'); // Example: Ticket type selection
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const errorMessage = error?.response?.data?.message || "Unable to fetch showtime data.";

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get(`/api/shows?movieId=${movieId}&theaterId=${theaterId}`);
        setShowtimes(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId, theaterId]);

  useEffect(() => {
    if (!selectedShowtime) return;
    const fetchShowtimeDetails = async () => {
      try {
        const response = await axios.get(`/api/shows/${selectedShowtime}`);
        setShowtimeDetails(response.data);
      } catch (err) {
        setError(err);
      }
    };
    fetchShowtimeDetails();
  }, [selectedShowtime]);

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_publishable_key);
      const session = await axios.post("/payment/create-checkout-session", {
        products: [{
          userId,  // Send userId here
          movieId,
          showtimeId: selectedShowtime,
          seatsBooked,
          ticketType,
          isPremium,
        }],
      });

      const result = await stripe.redirectToCheckout({
        sessionId: session.data.sessionId,
      });

      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.log("Payment Error:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{errorMessage}</p>;

  return (
    <div>
      <h1>Booking Page</h1>

      {/* Theater Selection */}
      <TheaterSelection showtimes={showtimes} onSelectShowtime={setSelectedShowtime} />

      {/* Showtime Details */}
      {showtimeDetails && (
        <>
          <ShowtimeDetails 
            showtimeDetails={showtimeDetails}
            seatsBooked={seatsBooked}
            setSeatsBooked={setSeatsBooked}
            ticketType={ticketType}
            setTicketType={setTicketType}
          />
          <Seat
            availableSeats={showtimeDetails.availableSeats}
            seatsBooked={seatsBooked} 
            setSeatsBooked={setSeatsBooked} 
          />
          <Tickets
            ticketTypes={showtimeDetails.ticketTypes} 
            ticketType={ticketType} 
            setTicketType={setTicketType} 
          />
          
          {/* Payment Button */}
          <div className='w-4/12 flex text-center bg-secondary'>
            <h2>Payment Details</h2>
          </div>
          <Button type="primary" onClick={makePayment} className='btn btn-success'>
            Check Out
          </Button>
        </>
      )}
    </div>
  );
};

export default BookingPage;
