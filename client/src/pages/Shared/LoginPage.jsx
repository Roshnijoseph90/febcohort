import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearuser, saveuser } from '../../redux/features/userSlice';
import { axiosInstance } from '../../config/axiosInstance';
import { toast } from 'react-hot-toast';

const LoginPage = ({ role }) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState(null);

  const user = {
    role: "user",
    loginAPI: "/user/login",
    profileRoute: "/user/profile",
    signupRoute: "/signup"
  };

  if (role === "owner") {
    user.role = "owner";
    user.loginAPI = "/owner/login";
    user.profileRoute = "/owner/profile";
    user.signupRoute = "/owner/signup";
  } else if (role === "admin") {
    user.role = "admin";
    user.loginAPI = "/admin/login";
    user.profileRoute = "/admin/profile";
    user.signupRoute = "/admin/signup";
  }

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put(user.loginAPI, data);
      dispatch(saveuser(response?.data?.data));
     
     toast.success("Login successful! Welcome back.");
      navigate(user.profileRoute);
    } catch (error) {
      dispatch(clearuser());
      setLoginError('Login failed. Please check your credentials.');
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="position-relative w-100 vh-100"
      style={{
        backgroundColor: '#0D1B2A',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <div
          className="bg-dark bg-opacity-75 p-4 text-white"
          style={{ maxWidth: "500px", borderRadius: "10px", width: "100%" }}
        >
          <h3 className="mt-3">Login to Your {user.role} Account</h3>
          <p className="text-white-50 mb-4">Please enter your credentials</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <p className="text-white-50 mb-4">
           Enter your Email</p>
            <div className="mb-3 text-start"></div>
            <div className="mb-3 text-start">
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format"
                  }
                })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.email && (
                <p className="text-danger mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <p className="text-white-50 mb-4">
           Password</p>
            <div className="mb-3 text-start"></div>
            <div className="mb-3 text-start">
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.password && (
                <p className="text-danger mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <p className="text-white-50 mb-4">
           Confrom Password</p>
            <div className="mb-3 text-start"></div>
            <div className="mb-3 text-start">
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: value => value === getValues('password') || "Passwords do not match",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.confirmPassword && (
                <p className="text-danger mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-warning w-100">
              Login
            </button>

            {/* Error Message */}
            {loginError && <p className="text-danger mt-3">{loginError}</p>}

            {/* Links */}
            <p className="text-white mt-3 mb-1">
              <Link to="/forgot-password" className="text-warning fw-bold">
                Forgot Password?
              </Link>
            </p>
            <p className="text-white">
              New here?{" "}
              <Link to={user.signupRoute} className="text-warning fw-bold">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
