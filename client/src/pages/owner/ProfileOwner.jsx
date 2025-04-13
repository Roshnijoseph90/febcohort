import React, { useState } from 'react';
import useFetch from "../../hooks/useFetch";

const ProfileOwner = () => {
  // Initialize state for profile data
  const [ownerProfile, isLoading, error] = useFetch("/owner/profile");
  const [showOrders, setShowOrders] = useState(false);

  
  return (
    <div>
      <div className='flex gap-8'>
        <button className='btn btn-primary'>Edit Profile</button>
       
        <button className='btn btn-info'>Change Password</button>
        <button className='btn btn-neutral'>Logout</button>
      </div>
      
      <h5>Welcome: {ownerProfile?.name}</h5>
      <h5>Email ID:  {ownerProfile?.email}</h5>
      <h5>Mobile: {ownerProfile?.mobile}</h5>
      
      
      {/* Show orders if state is true */}
      
    </div>
  );
};

export default ProfileOwner;
