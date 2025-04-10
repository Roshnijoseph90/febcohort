// Booking.js

/*import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  movieDetails  from './MoviesDetails';  
import { Typography, Row, Col } from "antd";

const { Title } = Typography;

const Booking = () => {
  const { id } = useParams();  // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);  // Default state is null
  const [error, setError] = useState(null);  // Add error state
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    // Fetch movie details when the component mounts
    setLoading(true);
    setError(null);  // Reset error state
    movieDetails(id)
      .then((res) => {
        console.log("response=",res)
        setMovie(res.movie);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch movie details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;  // Show loading message

  if (error) return <div>{error}</div>;  // Show error message

  if (!movie) return <div>Movie not found</div>;  // Movie not found

  return (
    <div>
      <Title level={3} style={{ textAlign: "center" }}>
        Book Tickets for Movie: {movie?.title}
      </Title>

      <Row justify="center" style={{ paddingTop: "3rem" }}>
        <Col>
          <img
            src={movie.poster}
            alt="movie poster"
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Booking;*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Theater from '../../components/user/Theatre';
import ShowtimeDetails from '../../components/user/ShowtimeDetails';
import Seat from '../../components/user/Seat'
import Ticket from '../../pages/user/Ticket'
import { loadStripe } from '@stripe/stripe-js';
import { Button } from 'antd';

const Booking = ({ movieId, theaterId }) => {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(2); // Example: Number of seats to book
  const [ticketType, setTicketType] = useState('VIP'); // Example: Ticket type selection
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
const [isPremium, setIsPremium] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date()); // or get from showtime

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
          userId,
          movieId,
          seatNumber: selectedSeats,
          date: selectedDate,
          showId: selectedShowtime,
          theaterId,
          seatsBooked: selectedSeats.length,
          ticketType: [ticketType],
          isPremium: isPremium.toString(),
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
      <Theater showtimes={showtimes} onSelectShowtime={setSelectedShowtime} />

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
          <Ticket
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

export default Booking