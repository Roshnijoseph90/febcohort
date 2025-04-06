import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from "../../config/axiosInstance";
import { useDispatch } from 'react-redux';
import { clearuser, saveuser } from '../../redux/features/userSlice';
import { Link } from 'react-router-dom';
import '../../styles/signUpPage.css';

const SignUpPage = ({ role }) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUpError, setSignUpError] = useState(null);  // State for sign-up errors

  const user = {
    role: "user",
    signUpAPI: "/user/signup",
    loginRoute: "/login",
    profileRoute: "/profile",
  };

  if (role === "owner") {
    user.role = "owner";
    user.signUpAPI = "/owner/signup";
    user.profileRoute = "/owner/profile";
    user.loginRoute = "login";
  }
  if (role === "admin") {
    user.role = "admin";
    user.signUpAPI = "/admin/signup";
    user.profileRoute = "/admin/profile";
    user.loginRoute = "/admin/login";
  }

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance({
        method: "POST",
        url: user.signUpAPI,
        data: data,
      });
      dispatch(saveuser(response?.data?.data));  // Save user data to Redux
      navigate(user.loginRoute, { state: { email: data.email } }); 
    } catch (error) {
      dispatch(clearuser());  // Clear user data on error
      console.error("Error during signup:", error);
      setSignUpError('An error occurred during signup. Please try again.');  
    }
  };

  return (
    <div className="signup-container">
      <div className="card-body">
        <h2>Sign Up Now! {user.role}</h2>

        {/* Display sign-up error if any */}
        {signUpError && <p className="signup-error">{signUpError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          {/* Name Field */}
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          {/* Mobile Field */}
          <div>
            <label htmlFor="mobile">Mobile</label>
            <input
              type="text"
              id="mobile"
              placeholder="Enter your mobile number"
              {...register('mobile', { required: 'Mobile number is required' })}
            />
            {errors.mobile && <p>{errors.mobile.message}</p>}
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter your location"
              {...register('location', { required: 'Location is required' })}
            />
            {errors.location && <p>{errors.location.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                }
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: value => value === getValues('password') || 'Passwords do not match',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                }
              })}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit">Sign Up</button>
          </div>
        </form>

        {/* Existing user login link */}
        <div className="links"  >
          <Link to={user.loginRoute}>Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
