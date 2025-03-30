// src/pages/user/Search.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      // Mocked API call (replace this with an actual search API)
      const mockResults = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
        { id: 3, title: 'Movie 3' }
      ];
      setResults(mockResults.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase())));
    }
  }, [query]);

  return (
    <div>
      <h2>Search Movies</h2>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        <h3>Results:</h3>
        <ul>
          {results.map((movie) => (
            <li key={movie.id}>
              <a href={`/movie/${movie.id}`}>{movie.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
