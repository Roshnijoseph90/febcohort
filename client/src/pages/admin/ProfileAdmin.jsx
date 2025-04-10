import React, { useState } from 'react';
import useFetch from "../../hooks/useFetch";

const ProfileAdmin = () => {
  // Initialize state for profile data
  const [adminProfile, isLoading, error] = useFetch("/admin/profile");
  const [showOrders, setShowOrders] = useState(false);

  
  return (
    <div>
      <div className='flex gap-8'>
        <button className='btn btn-primary'>Edit Profile</button>
       
        <button className='btn btn-info'>Change Password</button>
        <button className='btn btn-neutral'>Logout</button>
      </div>
      
      <h5>Welcome: {adminProfile?.name}</h5>
      <h5>Email ID:  {adminProfile?.email}</h5>
      <h5>Location: {adminProfile?.location}</h5>
      <h5>Mobile: {adminProfile?.mobile}</h5>
      
      
      {/* Show orders if state is true */}
      
    </div>
  );
};

export default ProfileAdmin;
