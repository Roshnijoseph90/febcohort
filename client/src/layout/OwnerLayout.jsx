
import React, { useEffect, useState } from 'react';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import OwnerHeader from '../components/user/OwnerHeader';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from "../config/axiosInstance";
import { saveuser, clearuser } from '../redux/features/userSlice';

 export const OwnerLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);
 // console.log(user, "==user");
  const dispatch = useDispatch();
  const location = useLocation();

  const checkUser = async () => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: "/user/checkuser",
       
      });

      // If the user is authorized, save their data
      if (response.data.message === "user authorized") {
        dispatch(saveuser(response.data.data));  
      } else {
        dispatch(clearuser());  // Clear user data if not authorized
      }
    } catch (error) {
      console.log("Error:", error);
      // Handle errors gracefully
      dispatch(clearuser());
    } finally {
      // Set loading to false after the check is completed
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  if (isLoading) {
    return null; // or return a loading spinner
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {user.isUserAuth ? <OwnerHeader /> : <Header />}
     
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default OwnerLayout;
