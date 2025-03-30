
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ home }) => {
  const navigate = useNavigate(); // Get the navigate function

  const navigateToHome = home || '/'; // Use the provided 'home' prop or default to '/'

  return (
    <div>
      <h1>404 - Page Not Found!</h1>
      <button className="btn btn-acent" onClick={() => navigate(navigateToHome)}>
        Navigate to Home
      </button>
    </div>
  );
};

export default ErrorPage;
