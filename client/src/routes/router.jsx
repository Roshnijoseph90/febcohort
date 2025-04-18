import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import Home from '../pages/user/Home';
import LoginPage from '../pages/Shared/LoginPage';
import SignUpPage from '../pages/Shared/SignUpPage';
import Booking from '../pages/user/Booking';
import Payment from '../pages/user/Payment'
import Profile from '../pages/user/Profile';
import ProfileAdmin from '../pages/admin/ProfileAdmin';
import ProfileOwner from '../pages/owner/ProfileOwner';
import ErrorPage from '../pages/Shared/ErrorPage';
import ProtectRoute from './ProtectRoute';
import RootLayout from '../layout/RootLayout';
import Movies from '../pages/user/Movies';
import Logout from '../pages/user/Logout';
import MoviesDetails from '../pages/user/MoviesDetails';
import Showtimes from '../pages/user/Showtimes';
import OwnerLayout from '../layout/ownerLayout';
import Review from '../pages/user/Review'
import AdminLayout from '../layout/AdminLayout';
import AddMovies from '../pages/admin/AddMovies';
import ForgotPassword from '../pages/user/ForgotPassword';
export const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,  // The Home Page
      },
      {
        path: "/login",
        element: <LoginPage />,  
      },
      {
        path: "/logout",
        element: <Logout />,  
      },
      {
        path: "/signup",
        element: <SignUpPage />,  
      },
      {
        path: "/moviesDetails/:id/review",  
        element: <Review /> 
      },
      {
        path: "movies",
        element: <Movies />,  
      },
      {
        path: "/moviesDetails/:id",
        element: <MoviesDetails />,
      },
      
      {
        path: "/showtimes/:movieId",
        element: <Showtimes />,
      },
      
      // Protecting Routes
      {
        path: "user",
        element: <ProtectRoute />, 
        children: [
          {
            path: "profile",
            element: <Profile />, 
          },
          {
            path: "booking/:id",  
            element: <Booking />,  
          },
          {
            path:"payment/:bookingId",
            element:<Payment/>
          },
         
         {
            path:"payment/sucess",
            element:<h1>payment success</h1>
          },
          {
            path:"payment/cancel",
            element:<h1>payment success</h1>
          }
        ],
      },
      
      {
        path: "/forgot-password",  
        element: <ForgotPassword />,  
      },
      
      {
        path: "*",
        element: <ErrorPage home='/' />, 
      },
    ],
  },
  {
    path: "owner",
    element: <OwnerLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage role="owner" />,
      },
      {
        path: "signup",
        element: <SignUpPage role="owner"/>,
      },
      {
        path: "profile",
        element: <ProfileOwner />,
      },
      {
        path: "logout",  
        element: <Logout />,  
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage role="admin" />,
      },
      {
        path: "signup",
        element: <SignUpPage role="admin"/>,
      },
      {
        path: "profile",
        element: <ProfileAdmin />,
      },
      {
        path:'addmovies',
        element:<AddMovies/>
      },
      {
        path: "logout",  // Corrected to relative path
        element: <Logout  />,  // Logout Page
      },
    ],
  },
]);
