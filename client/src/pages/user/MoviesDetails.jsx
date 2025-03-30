import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Button } from "antd"; // Import Button from Ant Design

export const MoviesDetails = () => {
  //const params = useParams();
  const { id } = useParams(); 
  console.log(id,"===prams")
  const [moviesDetails,isLoading,error]=useFetch(`/movie/moviesDetails/${id}`)

  /*return (
    <div>
      <h4>Movie Details page</h4>
      <div>
        <img src ={moviesDetails?.poster} alt="movie img"/>
        </div>
        <div>
          <h2>{moviesDetails?.title}</h2>
          <h4>{moviesDetails?.language}</h4>
          <p> {moviesDetails?.duration}</p>
          <h5>{moviesDetails?.genre}</h5>
          </div>
          <div>
            <h2>About the movie</h2>
          <p>{moviesDetails?.description}</p>
      </div>
      
    </div>
  );
};*/
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

      {/* You can add additional actions like a "Book Ticket" button */}
      <Button type="primary">Book Ticket</Button>
    </div>
  );
};


export default MoviesDetails