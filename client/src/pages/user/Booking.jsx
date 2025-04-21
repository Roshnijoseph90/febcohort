
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux"
import {
  Container,
  Button,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  Spinner,
} from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { toast } from "react-hot-toast";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [price, setPrice] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchShowDetails = async () => {
      if (!id) return;
      try {
        const response = await axiosInstance.get(`shows/get-shows-bymovie/${id}`);
        if (response.data.shows.length > 0) {
          setShows(response.data.shows);
          const today = new Date().toISOString().split("T")[0];
          setSelectedDate(today + "T00:00:00.000Z");
        }
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };
    fetchShowDetails();
  }, [id]);

  useEffect(() => {
    if (!selectedDate) return;
    const filtered = shows.filter((show) => {
      const showDate = new Date(show.showTime).toISOString().split("T")[0];
      return showDate === selectedDate.split("T")[0];
    });
    setFilteredShows(filtered);
    setSelectedShow(null);
    setSelectedTime(null);
    setSelectedSeats([]);
    setPrice([]);
  }, [selectedDate, shows]);

  const availableTimes = [
    ...new Set(
      filteredShows
        .filter((show) =>
          selectedLocation ? show.theaterId.location === selectedLocation : true
        )
        .map((show) => {
          const time = new Date(show.showTime);
          return time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
}),
    ),
  ];

  const handleTimeClick = (timeStr) => {
    setSelectedTime(timeStr);
    const matchingShow = filteredShows.find((show) => {
      const showTime = new Date(show.showTime);
      //return showTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); 
      const formatted = showTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return formatted === timeStr && (selectedLocation ? show.theaterId.location === selectedLocation : true);
    });

    setSelectedShow(matchingShow || null);
    setSelectedSeats([]);
    setPrice([]);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setSelectedTime(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setPrice([]);
  };

  const toggleSeatSelection = (seatId, seatLabel, seatType, selectedTime, seatPrice) => {
    setSelectedTime(selectedTime);
    setSelectedSeats((prevSeats) => {
      const isAlreadySelected = prevSeats.some((s) => s.seatId === seatId);
      if (isAlreadySelected) {
        setPrice((prevPrices) =>
          prevPrices.filter(
            (_, index) =>
              index !== prevSeats.findIndex((s) => s.seatId === seatId)
          )
        );
        return prevSeats.filter((s) => s.seatId !== seatId);
      } else {
        setPrice((prevPrices) => [...prevPrices, seatPrice]);
        return [...prevSeats, { seatId, seatLabel, seatType, price: seatPrice }];
      }
    });
  }
  

  const handleBooking = async () => {
    if (!selectedShow || selectedSeats.length === 0) {
      toast.error("Please select seats before booking.");
      return;
    }

    const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const formattedDate = selectedDate;
    const seatDetails = selectedSeats.map((s) => ({
      seatId: s.seatId,
      seatLabel: s.seatLabel,
      seatType: s.seatType,
    }));

    try {
      setIsBooking(true);
      console.log("User from Redux:", user); 
      if (!user || !user._id) {
        toast.error("User not logged in. Please log in to book.");
        return;
      }
      
      const response = await axiosInstance.post("/booking/create-booking", {
        userId: user._id,
        showId: selectedShow._id,
        theaterId: selectedShow.theaterId._id,
        bookedSeatsCount: selectedSeats.length,
        totalAmount,
        selectedSeats: seatDetails,
        date: selectedDate.split("T")[0],
        timeSlot: selectedTime.length === 5 ? selectedTime + ":00" : selectedTime,
        isPremium: selectedShow.isPremium || false,
       status: "confirmed"
      });

      if (response.data) {
        toast.success("Redirecting to payment...");
        setTimeout(() => {
          navigate(`/user/payment/${id}`);
          console.log
        }, 2000);
      }
      console.log("booking failed error",err)
      toast.error(err?.response?.data?.message || "Booking failed.");
      
    } finally {
      setIsBooking(false);
    }
  }


  const totalAmount = price.reduce((sum, p) => sum + p, 0);

  return (
    <div className="position-relative w-100 h-100 bg-dark">
      <Container className="seating-booking-container">
        {filteredShows.length > 1 && (
          <FormGroup className="mb-3">
            <FormLabel className="text-light mt-5">Select Location</FormLabel>
            <FormControl
              as="select"
              value={selectedLocation}
              onChange={handleLocationChange}>
              <option value="">All Locations</option>
              {[...new Set(filteredShows.map((s) => s.theaterId.location))].map(
                (loc, i) => (
                  <option value={loc} key={i}>
                    {loc}
                  </option>
                )
              )}
            </FormControl>
          </FormGroup>
        )}

        <Swiper
          slidesPerView={4}
          spaceBetween={2}
          freeMode={true}
          modules={[FreeMode]}
          className="date-swiper half-width">
          {[...Array(7)].map((_, index) => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + index);
            const formatted = currentDate.toISOString().split("T")[0];
            return (
              <SwiperSlide key={index}>
                <Button
                  variant={
                    selectedDate === formatted + "T00:00:00.000Z"
                      ? "warning"
                      : "outline-light"
                  }
                  onClick={() =>
                    setSelectedDate(formatted + "T00:00:00.000Z")
                  }>
                  <strong>
                    {currentDate.toLocaleString("en-US", { weekday: "short" })}
                  </strong>
                  <br />
                  {currentDate.toLocaleString("en-US", { month: "short" })}{" "}
                  {currentDate.getDate()}
                </Button>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="time-slots my-3">
          {availableTimes.map((time, i) => (
            <Button
              key={i}
              variant={selectedTime === time ? "warning" : "outline-warning"}
              onClick={() => handleTimeClick(time)}>
              {time}
            </Button>
          ))}
        </div>

        {selectedShow && (
          <>
            <div className="movie-banner">
              <div className="overlay">
                <h2 className="movie-title">{selectedShow.movie?.title || "Movie"}</h2>
                <h4 className="text-light">
                  {selectedShow.theaterId.name} - {selectedShow.theaterId.location}
                </h4>
              </div>
            </div>

            <div className="seat-color-icons text-white d-flex justify-content-around align-items-center">
              <p><span className="bg-warning me-2" style={{ width: 15, height: 15, display: "inline-block" }}></span>Selected</p>
              <p><span className="bg-success me-2" style={{ width: 15, height: 15, display: "inline-block" }}></span>Available</p>
              <p><span className="bg-secondary me-2" style={{ width: 15, height: 15, display: "inline-block" }}></span>Booked</p>
            </div>

            <div className="seat-layout mt-4">
              {selectedShow?.seats?.length > 0 ? (
                <Row className="justify-content-center">
                  {selectedShow.seats.map((seat) => (
                    <Col xs="auto" key={seat.seatId}>
                      <Button
                        className={`seat-button ${
                          selectedSeats.some((s) => s.seatId === seat.seatId)
                            ? "btn-warning"
                            : seat.isBooked
                            ? "btn-secondary"
                            : "btn-success"
                        }`}
                        disabled={seat.isBooked}
                        onClick={() =>
                          toggleSeatSelection(
                            seat.seatId,
                            seat.seatLabel,
                            seat.seatType,
                            selectedTime,
                            seat.basePrice
                          )
                        }
                      >
                        {seat.seatLabel}
                      </Button>
                    </Col>
                  ))}
                </Row>
              ) : selectedShow?.seatTypes?.length > 0 ? (
                selectedShow.seatTypes.map((type) => (
                  <div key={type._id} className="mb-3">
                    <h5 className="text-white">{type.seatType}</h5>
                    {type.rows.map((row) => (
                      <Row key={row._id} className="justify-content-center mb-2">
                        {row.seats.map((seat) => (
                          <Col xs="auto" key={seat.seatId}>
                            <Button
                              className={`seat-button ${
                                selectedSeats.some((s) => s.seatId === seat.seatId)
                                  ? "btn-warning"
                                  : seat.isBooked
                                  ? "btn-secondary"
                                  : "btn-success"
                              }`}
                              disabled={seat.isBooked}
                              onClick={() =>
                                toggleSeatSelection(
                                  seat.seatId,
                                  seat.seatLabel,
                                  type.seatType,
                                  selectedTime,
                                  seat.price
                                )
                              }
                            >
                              {seat.seatLabel}
                            </Button>
                          </Col>
                        ))}
                      </Row>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-white text-center mt-4">No seat layout available for this show.</p>
              )}
            </div>
          </>
        )}
      </Container>

      <div
        className="d-flex justify-content-around align-items-center mt-5"
        style={{ backgroundColor: "rgba(254, 197, 26, 0.96)" }}
      >
        <div>
          <h4 className="text-dark mt-3 p-3 bg-light rounded">
            Total Amount ={" "}
            <span className="text-success" style={{ fontSize: "45px" }}>
              ₹{totalAmount}
            </span>
          </h4>
        </div>
        <div>
          <Button
            variant="success"
            disabled={isBooking || selectedSeats.length === 0}
            onClick={handleBooking}
            className="mt-4"
          >
            {isBooking ? <Spinner animation="border" /> : "Proceed to Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};



export default Booking;