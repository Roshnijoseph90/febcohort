import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

const Review = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="));
  const isUserAuth = !!token;

  const [allReviews, setAllReviews] = useState([]);
  const [form, setForm] = useState({ rating: "", reviewText: "" });

  const fetchAllReviews = async () => {
    try {
      const res = await axiosInstance.get(`/review/get-movie-review/${id}`);
      setAllReviews(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch reviews");
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
      setForm({ rating: "", reviewText: "" });
      fetchAllReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Review submission failed.");
    }
  };

  return (
    <div
      className="position-relative w-100 min-vh-100"
      style={{
        backgroundColor: '#0D1B2A',
        padding: '40px',
        color: 'white',
      }}
    >
      <div className="container bg-dark bg-opacity-75 p-4 rounded shadow-lg">
        <h2 className="mb-4 text-warning">Write a Review</h2>

        {isUserAuth ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white-50">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="form-control bg-dark text-white border-secondary"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-white-50">Review</label>
              <textarea
                rows="4"
                value={form.reviewText}
                onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                className="form-control bg-dark text-white border-secondary"
                required
              />
            </div>

            <button type="submit" className="btn btn-warning w-100">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-warning">Please log in to submit a review.</p>
        )}

        <hr className="text-white my-5" />

        <h3 className="text-warning">All Reviews</h3>
        {allReviews.length === 0 ? (
          <p className="text-white-50">No reviews yet for this movie.</p>
        ) : (
          allReviews.map((rev) => (
            <div
              key={rev._id}
              className="border-bottom border-secondary py-3"
            >
              <p className="mb-1">
                <strong className="text-warning">{rev.userId?.name || "Anonymous"}</strong>
              </p>
              <p className="mb-1">⭐ {rev.rating}</p>
              <p className="text-white-50">{rev.reviewText}</p>
            </div>
          ))
        )}

        <button
          onClick={() => navigate(`/moviesDetails/${id}`)}
          className="btn btn-outline-light mt-4"
        >
          ← Back to Movie
        </button>
      </div>
    </div>
  );
};

export default Review;
