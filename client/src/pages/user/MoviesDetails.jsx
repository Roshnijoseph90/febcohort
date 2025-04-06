import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Button } from "antd"; 
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
export const MoviesDetails = () => {
  //const params = useParams();
  const { id } = useParams(); 
  //console.log(id,"===prams")
  const [moviesDetails,isLoading,error]=useFetch(`/movie/moviesDetails/${id}`)
  //const navigate = useNavigate();
  const handleBookingClick = async()=>{
    try{
      const response = await axiosInstance({method:"POST",data:{movieId:moviesDetails?._id},url:"/booking/create-booking"})
      console.log(response)
      toast.success("book ticket sucessfully")

    }catch(error){
      console.log(error)
      toast.error(error?.response?.data?.message || "unable to book ticket")
    }
    
  }

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

      <Button type="primary" onClick={handleBookingClick}>Book Ticket</Button>
    </div>
  );
};


export default MoviesDetails