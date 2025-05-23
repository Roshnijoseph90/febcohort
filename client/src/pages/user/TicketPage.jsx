import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Card, Button } from "react-bootstrap";
import { axiosInstance } from "../../config/axiosInstance";

const TicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const [bookingData, setBookingData] = useState(null);
  const [theaterName, setTheaterName] = useState("Theater Name");
  const [tickets, setTickets] = useState([]);
  const [movieTitle, setMovieTitle] = useState("Movie Title");
  const [language, setLanguage] = useState("Language");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { data: booking } } =
          await axiosInstance.get(`/booking/get-booking-by-bookingId/${id}`);
        setBookingData(booking);

        if (booking.movieId) {
          const { data: { data: movieData } } =
            await axiosInstance.get(`/movie/moviesDetails/${booking.movieId}`);
          
          console.log("movieData →", movieData); // Optional debug
          setMovieTitle(movieData?.title ?? "Movie Title");
          setLanguage(movieData?.language ?? "Language");
        }

        const { data: { data: ticketList = [] } } =
          await axiosInstance.get(`/ticket/get-tickets/${id}`);
        setTickets(ticketList);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAll();
  }, [id]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `ticket_${bookingData._id}.png`;
      link.click();
      setTimeout(() => navigate("/movies"), 2000);
    } catch (err) {
      console.error("Error generating ticket image:", err);
    }
  };

  if (!bookingData) {
    return <p className="text-white text-center">Loading...</p>;
  }

  const qrCodeBase64 = bookingData.qrCode;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <Card className="p-3 rounded shadow-lg position-relative" style={{ maxWidth: 600, width: "100%" }}>
        <Button
          variant="outline-secondary"
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          onClick={() => navigate("/movies")}
        >
          Back to Home
        </Button>

        <div ref={ticketRef} className="bg-white p-4 rounded">
          {/* Movie Title & Info */}
          <h5>{movieTitle}</h5>
          <p className="text-muted">{language}</p>

          {/* Date & Time */}
          <p>
            {new Date(bookingData.date).toLocaleDateString()} &nbsp;|&nbsp;
            {bookingData.timeSlot}
          </p>

          {/* Theater */}
          <p className="fw-bold">{theaterName}</p>

          {/* Seats */}
          <h6>🎟 {bookingData.selectedSeats.length} Tickets</h6>
          <p>
            {bookingData.selectedSeats.length > 0
              ? bookingData.selectedSeats.map((s) => s.seatLabel).join(", ")
              : "No seats selected"}
          </p>

          {/* QR Code */}
          <div className="text-center my-3">
            {qrCodeBase64 ? (
              <img src={qrCodeBase64} alt="QR Code" style={{ maxWidth: 150 }} />
            ) : (
              <p className="text-muted">QR code not available</p>
            )}
          </div>

          {/* Booking ID */}
          <p className="fw-bold">Booking ID: {bookingData._id}</p>

          {/* Cancellation Note */}
          <p className="text-danger" style={{ fontSize: 12 }}>
            Cancellation unavailable: cut-off time of 5 hrs before showtime has passed
          </p>
        </div>

        <Button variant="primary" className="w-100 mt-3" onClick={handleDownload}>
          Download Ticket
        </Button>
      </Card>
    </div>
  );
};

export default TicketPage;
