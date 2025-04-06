import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import Home from '../pages/user/Home';
import LoginPage from '../pages/Shared/LoginPage';
import SignUpPage from '../pages/Shared/SignUpPage';
import BookingPage from '../pages/user/BookingPage';
import Profile from '../pages/user/Profile';
import ErrorPage from '../pages/Shared/ErrorPage';
import ProtectRoute from './ProtectRoute';
import RootLayout from '../layout/RootLayout';
import Movies from '../pages/user/Movies';
import Logout from '../pages/user/Logout';
import Search from '../pages/user/Search';
import MoviesDetails from '../pages/user/MoviesDetails';
import Showtimes from '../pages/user/Showtimes';
import OwnerLayout from '../layout/OwnerLayout';
import AdminLayout from '../layout/AdminLayout';

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
        element: <LoginPage />,  // Login Page
      },
      {
        path: "/logout",
        element: <Logout role="user"/>,  // Logout Page
      },
      {
        path: "/signup",
        element: <SignUpPage />,  // Signup Page
      },
      {
        path: "movies",
        element: <Movies />,  // Movies Page
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
        element: <ProtectRoute />,  // ProtectRoute for authentication check
        children: [
          {
            path: "profile",
            element: <Profile />,  // Profile Page
          },
          {
            path: "booking/:id",  // Fixed to be relative
            element: <BookingPage />,  // Book Ticket Page
          },
          {
            path: "payment",
            element: <h1>Payment </h1>,  // Payment Page (Placeholder)
          },
          {
            path:"payment/sucess",
            element:<h1>payment sucess</h1>
          },
          {
            path:"payment/cancel",
            element:<h1>payment sucess</h1>
          }
        ],
      },
      
      {
        path: "/search",  // Route for the Search page
        element: <Search />,  // Search Page
      },
      {
        path: "*",
        element: <ErrorPage home='/' />,  // A 404 page or some error message
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
        element: <Profile />,
      },
      {
        path: "logout",  // Corrected to relative path
        element: <Logout />,  // Logout Page
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
        element: <Profile />,
      },
      {
        path: "logout",  // Corrected to relative path
        element: <Logout />,  // Logout Page
      },
    ],
  },
]);
