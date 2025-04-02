import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectRoute = () => {
  const { isUserAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAuth) {
      // Redirect to login page if user is not authenticated
      navigate('/login');
    }
  }, [isUserAuth,navigate]);

  return (
    <div>
    <Outlet/>
    </div>
  )
}
export default ProtectRoute;
