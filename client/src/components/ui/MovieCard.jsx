
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="movie-card bg-base-100 shadow-xl rounded-lg overflow-hidden flex flex-col">
      {/* Image container */}
      <div className="aspect-[4/3] w-full cursor-pointer" onClick={handleClick}>
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">Language: {language}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-primary" onClick={handleBook}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

