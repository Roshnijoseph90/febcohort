import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const MoviesDetails = () => {
  const {id}= useParams() // Correctly extract the 'id' from the URL
  const [moviesDetails, isLoading, error] = useFetch(`/movie/moviesDetails/${id}`);
  const navigate = useNavigate();
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {/* Movie Poster Section */}
        <div style={{ marginRight: "20px" }}>
          <img
            src={moviesDetails?.poster}
            alt="movie poster"
            style={{ width: "200px", height: "auto" }}
          />
        </div>

        {/* Movie Title, Language, and Genre Section */}
        <div>
          <h2>{moviesDetails?.title}</h2>
          <p><strong>Language:</strong> {moviesDetails?.language}</p>
          <p><strong>Genre:</strong> {moviesDetails?.genre}</p>
          
          {/* Review Button */}
          <button
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/moviesDetails/${id}/review`)} // Navigate to review page
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Movie Description Section */}
      <div>
        <h3>Description</h3>
        <p>{moviesDetails?.description}</p>
      </div>
    </div>
  );
};

export default MoviesDetails;
