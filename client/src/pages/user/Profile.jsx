import React from 'react';
import useFetch from "../../hooks/useFetch";

const Profile = () => {
  // Initialize state for profile data
  const [userProfile, isLoading, error] = useFetch("/user/profile");

  // If loading, display loading message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If there is an error, display the error message
  if (error) {
    return <div>Error loading profile data.</div>;
  }

  // If data is successfully fetched, display the profile
  return (
    <div>
      <h5>Welcome: {userProfile?.name}</h5>
      <h5>Email ID:  {userProfile?.email}</h5>
      <h5>Location: {userProfile?.location}</h5>
      <h5>Mobile: {userProfile?.mobile}</h5>
      <img src={userProfile?.profile_pic} alt="profie pic"/>
      
    </div>
  );
};

export default Profile;
