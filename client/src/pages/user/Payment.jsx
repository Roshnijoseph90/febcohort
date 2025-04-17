import React, { useEffect, useState } from "react";
import {axiosInstance} from "../../config/axiosInstance";
import { useParams } from "react-router";
import { Card, Button } from "react-bootstrap"; // Import Bootstrap Components
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // Load Stripe
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        setBooking(response.data.booking);
      } catch (error) {
        alert("Failed to fetch booking details!");
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const createOrder = async () => {
    if (!booking) {
      alert("Booking details not found!");
      return;
    }

    try {
      setLoading(true);
      const stripe = await stripePromise;

      // Send booking details to backend to create the Stripe Checkout session
      const { data } = await axiosInstance.post("/payment/create-checkout-session", {
        products: [
          {
            movieId: booking.movieId,
            price: booking.totalAmount,
            showId: booking.showId,
            theaterId: booking.theaterId,
            selectedSeats: booking.selectedSeats,
            date: booking.date,
            timeSlot: booking.timeSlot,
            userId: booking.userId,
          },
        ],
      });

      // Check if sessionId was returned
      if (data.sessionId) {
        // Redirect to Stripe Checkout
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert("Failed to create Stripe session");
      }

      setLoading(false);
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card className="p-4 rounded shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">💳 Payment Page</h2>

          <Card className="text-center p-3 mb-4 shadow-sm border-success">
            <Card.Body>
              <h5 className="text-success fw-bold">🎉 Your seat selection was successful!</h5>
              <p className="mb-0">Please confirm your booking by proceeding to the payment page.</p>
            </Card.Body>
          </Card>

          <div className="text-center">
            <Button
              onClick={createOrder}
              disabled={loading}
              variant="success"
              size="lg"
              className="w-100"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Payment;
