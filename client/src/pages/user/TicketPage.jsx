import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { axiosInstance } from "../../config/axiosInstance";
import html2canvas from "html2canvas";

const TicketPage = () => {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);
  const ticketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingAndTicket = async () => {
      try {
        const bookingRes = await axiosInstance.get(`/booking/get-booking-by-bookingId/${id}`);
        const booking = bookingRes.data.data;
        setBookingData(booking);

        // Fetch movie details
        if (booking?.show?.movieId) {
          const movieRes = await axiosInstance.get(`/movie/${booking.show.movieId}`);
          setMovie(movieRes.data.data);
        }

        // Fetch theater details
        if (booking?.show?.theaterId) {
          const theaterRes = await axiosInstance.get(`/theater/${booking.show.theaterId}`);
          setTheater(theaterRes.data.data);
        }

        // Fetch ticket data
        const ticketRes = await axiosInstance.get(`/ticket/get-tickets/${id}`);
        setTickets(ticketRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBookingAndTicket();
  }, [id]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current);
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `ticket_${bookingData._id}.png`;
      link.click();

      setTimeout(() => {
        navigate("/movies");
      }, 2000);
    } catch (error) {
      console.error("Error generating ticket image:", error);
    }
  };

  if (!bookingData) {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <Card
        className="p-3 rounded shadow-lg position-relative"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <Button
          variant="outline-secondary"
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          onClick={() => navigate("/movies")}
        >
          Back to Home
        </Button>

        <div
          ref={ticketRef}
          className="row g-3 align-items-center bg-white p-3 rounded"
        >
          {/* Movie Poster */}
          <div className="col-12 col-md-5 text-center">
            <img
              src={movie?.poster || "/default-poster.jpg"}
              alt="Movie Poster"
              className="img-fluid rounded"
              style={{
                width: "100%",
                maxHeight: "250px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Ticket Details */}
          <div className="col-12 col-md-7">
            <h5>{movie?.title || "Movie Title"}</h5>
            <p className="text-muted">{movie?.language || "Language"}</p>

            <p>
              {bookingData?.show?.showTime
                ? new Date(bookingData.show.showTime).toLocaleDateString()
                : "Date not available"}{" "}
              &nbsp; | &nbsp;
              {bookingData?.show?.showTime
                ? new Date(bookingData.show.showTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Time not available"}
            </p>

            <p className="fw-bold">{theater?.name || "Theater Name"}</p>

            <h6>🎟 {tickets.length} Tickets</h6>
            <p>
              {tickets.length > 0
                ? `${tickets[0].ticketType} - ${tickets
                    .map((ticket) => ticket.seatNumber)
                    .join(", ")}`
                : "No seats selected"}
            </p>

            {/* QR Code */}
            <div className="text-center">
              <img
                src={`data:image/png;base64,${bookingData?.qrCode}`}
                alt="QR Code"
                className="qr-code"
                style={{ maxWidth: "150px" }}
              />
            </div>

            <p className="fw-bold">Booking ID: {bookingData._id}</p>
            <p className="text-danger" style={{ fontSize: "12px" }}>
              Cancellation unavailable: cut-off time of 5 hrs before showtime
              has passed
            </p>
          </div>
        </div>

        {/* Download Button */}
        <Button
          variant="primary"
          className="w-100 mt-3"
          onClick={handleDownload}
        >
          Download Ticket
        </Button>
      </Card>
    </div>
  );
};

export default TicketPage;
