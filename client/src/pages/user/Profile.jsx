import React, { useState } from 'react';
import useFetch from "../../hooks/useFetch";

const Profile = () => {
  // Initialize state for profile data
  const [userProfile, isLoading, error] = useFetch("/user/profile");
  const [showOrders, setShowOrders] = useState(false);

  // If data is successfully fetched, display the profile
  return (
    <div>
      <div className='flex gap-8'>
        <button className='btn btn-primary'>Edit Profile</button>
        <button className='btn btn-secondary' onClick={() => setShowOrders(!showOrders)}>Your Orders</button>
        <button className='btn btn-info'>Change Password</button>
        <button className='btn btn-neutral'>Logout</button>
      </div>
      
      <h5>Welcome: {userProfile?.name}</h5>
      <h5>Email ID:  {userProfile?.email}</h5>
      <h5>Location: {userProfile?.location}</h5>
      <h5>Mobile: {userProfile?.mobile}</h5>
      <img src={userProfile?.profile_pic} alt="profile pic" />
      
      {/* Show orders if state is true */}
      {showOrders && <p>This is your use orders</p>}
    </div>
  );
};

export default Profile;
