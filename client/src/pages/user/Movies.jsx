import React from 'react'
import MovieCard from '../../components/ui/MovieCard'
import MovieCardSkeletons from '../../components/user/MovieCardSkeltons';
import useFetch from '../../hooks/useFetch'
import '../../styles/movies.css'
const Movies = () => {
  const [getAllMovies,isLoading,error]= useFetch("/movie/getAllMovies")
  // While loading, show skeleton components
  if (isLoading) {
    return (
      <div >
        
        {/* Display skeleton placeholders for the movie cards */}
        <div className="movie-cards-container">
          {[...Array(6)].map((_, index) => (
            <MovieCardSkeletons key={index} /> // Display skeleton for 6 items
          ))}
        </div>
      </div>
    );
  }

  // Once the movies are loaded, show the actual movie cards
  return (
    <div >
     
      <div className="movie-cards-container">
        {getAllMovies?.map((movie) => (
          <MovieCard movie={movie} key={movie?.id} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
