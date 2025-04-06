import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
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
       
        const response = await axiosInstance({
          method: 'GET', 
        });

        // Dispatch clear user data from Redux store
        dispatch(clearuser());
 // Redirect to the login page after logging out
 navigate(`/login`);
} catch (error) {
  console.error("Error during logout:", error);
  setLogoutError('An error occurred while logging out. Please try again.');
}
};

logout();
}, [dispatch, navigate, userRole]);
  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
      <p>Please wait while we log you out.</p>
    </div>
  );
};

export default Logout;
