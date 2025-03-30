import React from 'react'
import MovieCard from '../../components/ui/MovieCards'
import MovieCardSkeleton from '../../components/user/MovieCardSkeltons';
import useFetch from '../../hooks/useFetch'

const Movies = () => {
  const [getAllMovies,isLoading,error]= useFetch("/movie/getAllMovies")
  // While loading, show skeleton components
  if (isLoading) {
    return (
      <div>
        <h1>Movie Listing Page</h1>
        {/* Display skeleton placeholders for the movie cards */}
        <div className="movie-cards-container">
          {[...Array(6)].map((_, index) => (
            <MovieCardSkeleton key={index} /> // Display skeleton for 6 items
          ))}
        </div>
      </div>
    );
  }

  // Once the movies are loaded, show the actual movie cards
  return (
    <div>
      <h5>Movie Listing Page</h5>
      <div className="movie-cards-container">
        {getAllMovies?.map((movie) => (
          <MovieCard movie={movie} key={movie?.id} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
