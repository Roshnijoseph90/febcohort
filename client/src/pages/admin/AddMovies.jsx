import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../config/axiosInstance";
import{toast} from "react-hot-toast"
const AddMovie = () => {
  const navigate = useNavigate();
  const posterInputRef = useRef(null);
  const admin = useSelector((state) => state.user.userData);

const adminId = admin?.id||admin?._id;;

  const [files, setFiles] = useState({ poster: null });

  const [movie, setMovie] = useState({
    title: "",
    genre: "",
    duration: "",
    releaseDate: "",
    rating: "",
    description: "",
    language: "",
  });

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleMultiValueChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value.split(",") });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*if (!adminId) {
      alert("Admin not logged in");
      return;
    }*/

    const formData = new FormData();

    
    formData.append("title", movie.title);
    formData.append("genre", movie.genre);
    formData.append("duration", movie.duration);
    formData.append("releaseDate", movie.releaseDate);
    formData.append("rating", movie.rating);
    formData.append("description", movie.description);
    formData.append("language", movie.language);
 
    // Append banner & poster images as files
  
    if (files.poster) formData.append("poster", files.poster);
   //  console.log("FormData before sending:", [...formData.entries()]);

    

    // Add admin ID
    formData.append("admin", adminId);
    console.log("Admin ID being sent:", adminId);


    try {
      await axiosInstance.post("/movie/create-movie", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Movie added successfully!");

      // Reset form
      setMovie({
        title: "",
        genre: "",
        duration: "",
        releaseDate: "",
        rating: "",
        description: "",
        language: "",
      });

      setFiles({ poster: null });
      if (posterInputRef.current) posterInputRef.current.value = "";
      navigate("/movies");
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Failed to add movie!");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Add New Movie 🎬</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Movie Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={movie.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Genre (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={Array.isArray(movie.genre) ? movie.genre.join(",") : movie.genre}
                onChange={handleMultiValueChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={movie.duration}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                name="releaseDate"
                value={movie.releaseDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Rating (1–5)</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={movie.rating}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Language (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="language"
                value={Array.isArray(movie.language) ? movie.language.join(",") : movie.language}
                onChange={handleMultiValueChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={movie.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Poster Image</Form.Label>
          <Form.Control
            type="file"
            name="poster"
            accept="image/*"
            ref={posterInputRef}
            onChange={handleFileChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Add Movie
        </Button>
      </Form>
    </Container>
  );
};

export default AddMovie;
