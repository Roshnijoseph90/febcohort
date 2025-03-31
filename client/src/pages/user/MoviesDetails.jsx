import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Button } from "antd"; 

export const MoviesDetails = () => {
  //const params = useParams();
  const { id } = useParams(); 
  console.log(id,"===prams")
  const [moviesDetails,isLoading,error]=useFetch(`/movie/moviesDetails/${id}`)

return (
  <div style={{ padding: "20px" }}>
    
    <div style={{ display: "flex", marginBottom: "20px" }}>
      {/* Movie Poster */}
      <div style={{ marginRight: "20px" }}>
        <img src={moviesDetails?.poster} alt="movie poster" style={{ width: "200px", height: "auto" }} />
      </div>

      {/* Movie Details */}
      <div>
        <h3>{moviesDetails?.title}</h3>
        <p><strong>Language:</strong> {moviesDetails?.language}</p>
        <p><strong>Genre:</strong> {moviesDetails?.genre}</p>
      </div>
    </div>
 {/* Movie Description */}
 <div>
        <h3>Description</h3>
        <p>{moviesDetails?.description}</p>
      </div>

      <Button type="primary">Book Ticket</Button>
    </div>
  );
};


export default MoviesDetails