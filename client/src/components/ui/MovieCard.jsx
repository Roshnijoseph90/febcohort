import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../config/axiosInstance';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { title, language, poster, _id } = movie;

  const handleClick = () => {
    navigate(`/moviesDetails/${_id}`);
  };

  const handleBook = () => {
    navigate(`/user/booking/${_id}`);
  };

  return (
    <div className="card bg-base-100 shadow-xl w-96">
      <figure>
        <img
          src={poster}
          alt={title}
          onClick={handleClick}
          className="cursor-pointer"
        />
      </figure>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="movie-language">Language: {language}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleBook}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
