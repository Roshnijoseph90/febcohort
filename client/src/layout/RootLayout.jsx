import React, { useEffect, useState } from 'react';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import UserHeader from '../components/user/UserHeader';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from "../config/axiosInstance";
import { saveuser, clearuser } from '../redux/features/userSlice';

export const RootLayout = () => {
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
      console.log(response,"===checkuser response")
     //dispatch(saveuser())  
     setIsLoading(false)
    }catch(error) {
      console.log("Error:", error);
     // dispatch(clearuser());
      setIsLoading(false)
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
      {user.isUserAuth ? <UserHeader /> : <Header />}
     
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
