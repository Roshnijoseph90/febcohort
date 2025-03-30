import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';  // Import Link for navigation
import { axiosInstance } from '../../config/axiosInstance';  // Make sure the path is correct
import { useDispatch } from 'react-redux';
import {clearuser,saveuser} from "../../redux/features/userSlice"
const LoginPage = ({role}) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [loginError, setLoginError] = useState(null);  // Reintroduce loginError state

  const user = {
    role: "user",
    loginAPI: "/user/login",
    profileRoute: "/user/profile",
    signupRoute: "/signup"
  };
  if(role=="owner"){
    user.role="owner";
    user.loginAPI="/owner/login";
    user.profileRoute="/owner/profile";
    user.signupRoute="/owner/signup"
}
if(role=="admin"){
  user.role="admin";
  user.loginAPI="/admin/login";
  user.profileRoute="/admin/profile";
  user.signupRoute="/admin/signup"
}

  const onSubmit = async (data) => {
    
   try {
      const response = await axiosInstance({
        method: "PUT",
        url: user.loginAPI,  // Keeping PUT as per your backend setup
        data: data,
      });
      console.log("response====", response);
      dispatch(saveuser(response?.data?.data))
      navigate(user.profileRoute);
    } catch (error) {
      dispatch(clearuser());
      console.error("Error during login:", error);
      setLoginError('An error occurred during login. Please try again.');  // Set error message
    }
  };

  return (
    <div className="login-container">
      <div className="card-body">
        <h2 className="text 5xl font-bold">Login now!{user.role}</h2>

        
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
            <button type="submit">Login</button>
          </div>
        </form>

        {/* Forgot Password and New User Links */}
        <div className="links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <Link to={user.signupRoute}>New User? Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
