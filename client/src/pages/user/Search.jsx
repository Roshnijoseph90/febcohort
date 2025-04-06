// src/pages/user/Search.js

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    title: '',
    genre: ''
  });

  const navigate = useNavigate();  // Initialize the useNavigate hook to handle navigation

  // Function to handle the search request
  const handleSearch = async () => {
    try {
      const response = await axios.get("/movie/search", {
        params: searchQuery // Use searchQuery object directly
      });
      setMovies(response.data.data); // Assuming the response contains an array of movies
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Handle changes in the search input fields
  const handleChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value // Dynamically set the title and genre
    });
  };

  // Navigate to the movie details page on click
  const handleMovieClick = (movieId) => {
    navigate(`/moviesDetails/${movieId}`);  // Navigate to the movie details page using movieId
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Movies</h2>
      <input
        type="text"
        name="title"
        value={searchQuery.title}
        onChange={handleChange}
        placeholder="Search by title"
        style={{ marginBottom: '10px', padding: '10px' }}
      />
      <input
        type="text"
        name="genre"
        value={searchQuery.genre}
        onChange={handleChange}
        placeholder="Search by genre"
        style={{ marginBottom: '10px', padding: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff' }}>
        Search
      </button>

      <div>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div 
              key={movie._id} 
              onClick={() => handleMovieClick(movie._id)} 
              style={{ cursor: 'pointer', border: '1px solid #ccc', margin: '10px', padding: '10px', borderRadius: '5px' }}
            >
              <h3>{movie.title}</h3>
              <p>{movie.genre}</p>
              {/* Add more movie details if needed */}
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
