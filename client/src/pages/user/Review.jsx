import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
//import { useSelector } from "react-redux";
import {toast} from "react-hot-toast"
import  {axiosInstance}  from "../../config/axiosInstance"
const Review = () => {
  const { id } = useParams(); // movieId from route
  
  const navigate = useNavigate();

  const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
  //const isUserAuth = token ? true : false; // If token
  const isUserAuth = !!token;
  
  const [allReviews, setAllReviews] = useState([]);
  const [form, setForm] = useState({ rating: "", reviewText: "" });

  // Fetch all reviews for the movie
  const fetchAllReviews = async () => {
    try {
      const res = await axiosInstance.get(`/review/get-movie-review/${id}`);
      setAllReviews(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch all reviews", err);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    try {
      await axiosInstance.post(
        `/review/add-review`,
        {
          movieId: id,
         
          rating: form.rating,
          reviewText: form.reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Review submitted!");
      setForm({ rating: "", reviewText: "" }); // Reset form
      fetchAllReviews(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Review submission failed.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Write a Review</h2>

      {/* Display form only if user is authenticated */}
      {isUserAuth ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
          <label>
            Rating (1-5):
            <input
              type="number"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              min="1"
              max="5"
              required
              style={{ marginLeft: "10px", marginBottom: "10px" }}
            />
          </label>
          <br />
          <label>
            Review:
            <br />
            <textarea
              value={form.reviewText}
              onChange={(e) =>
                setForm({ ...form, reviewText: e.target.value })
              }
              rows={4}
              cols={50}
              required
              style={{ marginTop: "5px" }}
            />
          </label>
          <br />
          <button type="submit" style={{ marginTop: "10px" }}>
            Submit Review
          </button>
        </form>
      ) : (
        <p>Please log in to submit a review.</p>
      )}

      <h3>All Reviews</h3>
      {allReviews.length === 0 ? (
        <p>No reviews yet for this movie.</p>
      ) : (
        allReviews.map((rev) => (
          <div
            key={rev._id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{rev.userId?.name || "Anonymous"}</strong>
            </p>
            <p>⭐ {rev.rating}</p>
            <p>{rev.reviewText}</p>
          </div>
        ))
      )}

      <button
      onClick={() => navigate(`/moviesDetails/${id}`)}
        //onClick={() => navigate(`/moviesDetails/${id}/review`)}>
        style={{ marginTop: "30px" }}
      >
        ← Back to Movie
      </button>
    </div>
  );
};

export default Review;


