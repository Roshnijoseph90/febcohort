import React, { useEffect, useState } from 'react';

const Home = () => {
  
  return (
    <div>
      <div style={{ width: "100%", height: "70vh", margin: "auto", marginTop: "2rem" }}>
        <img 
          src="movieposter.jpg" 
          alt="Movie Poster" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>
    </div>
  )
}
export default Home;
