import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearuser } from '../../redux/features/userSlice';
import { axiosInstance } from '../../config/axiosInstance';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.role);
  const [logoutError, setLogoutError] = useState(null);

  useEffect(() => {
    const logout = async () => {
      try {
        // Dynamically set the logout API endpoint based on the user's role
        const apiUrl = userRole === 'admin' ? '/admin/logout' :
                       userRole === 'owner' ? '/owner/logout' :
                       '/user/logout';

        // Make the API request to log the user out
        const response = await axiosInstance({
          method: 'GET',
          url: apiUrl,  // Use the dynamic URL here
        });

        if (response?.status === 200) {
          // Dispatch clear user data from Redux store
          dispatch(clearuser());
          if (userRole === 'admin') {
            navigate('/admin/login');
          } else if (userRole === 'owner') {
            navigate('/owner/login');
          } else {
            navigate('/login');
          }
          
           
         
        } else {
          setLogoutError('An error occurred during logout. Please try again.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        setLogoutError('An error occurred while logging out. Please try again.');
      }
    };

    logout();  // Trigger the logout function
  }, [dispatch, navigate, userRole]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
      <p>Please wait while we log you out.</p>

      {/* Display logout error if any */}
      {logoutError && <p className="error">{logoutError}</p>}
    </div>
  );
};

export default Logout;
