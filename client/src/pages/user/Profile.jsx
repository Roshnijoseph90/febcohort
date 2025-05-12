import React, { useEffect, useState } from 'react';
import useFetch from "../../hooks/useFetch";
import { axiosInstance } from '../../config/axiosInstance';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import

const Profile = () => {
  const [userProfile, isLoading, error] = useFetch("/user/profile");
  const navigate = useNavigate(); // ✅ Initialize navigate
  const user = useSelector((state) => state.user.user);

  return (
    <div>
      <div className='flex gap-8'>
        <button className='btn btn-primary'>Edit Profile</button>
        <button className='btn btn-secondary' onClick={() => navigate('/bookings-summary')}>Your Bookings</button>
        <button className='btn btn-info'>Change Password</button>
        {/* <button className='btn btn-neutral'>Logout</button> */}
      </div>

      <h5>Welcome: {userProfile?.name}</h5>
      <h5>Email ID:  {userProfile?.email}</h5>
      <h5>Location: {userProfile?.location}</h5>
      <h5>Mobile: {userProfile?.mobile}</h5>
    </div>
  );
};

export default Profile;
