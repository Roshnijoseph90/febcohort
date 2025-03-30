import React from 'react'
import { useNavigate } from 'react-router-dom';




const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const { title, language, poster,_id } = movie;
 
  const handleClick = () => {
    //console.log("Navigating to movie ID:", movieId); 
    navigate(`/moviesDetails/${movie?._id}`);
  };
  return (
    <div className="card bg-base-100 shadow-xl w-96">
      <figure>
        {/* Assuming the movie object has an imageUrl property */}
        <img src={poster} alt={title} onClick={handleClick}/>
      </figure>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {/* Movie language */}
        <p className="movie-language">Language: {language}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

