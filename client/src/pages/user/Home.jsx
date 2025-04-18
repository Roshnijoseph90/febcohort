import React, { useEffect, useState } from 'react';

const Home = () => {
 
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      backgroundImage: `url('movieposter.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat"
    }}>
      <div style={{ width: "100%", height: "100vh", margin: "auto", marginTop: "2rem" }}>
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
