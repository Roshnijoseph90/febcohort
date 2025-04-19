import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { axiosInstance } from "../../config/axiosInstance";
import { clearuser, saveuser } from '../../redux/features/userSlice';
import { toast } from 'react-hot-toast';

const SignUpPage = ({ role }) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUpError, setSignUpError] = useState(null);

  let user = {
    role: "user",
    signUpAPI: "/user/signup",
    loginRoute: "/login",
    profileRoute: "/user/profile"
  };

  if (role === "owner") {
    user = {
      role: "owner",
      signUpAPI: "/owner/signup",
      profileRoute: "/owner/profile",
      loginRoute: "/owner/login"
    };
  } else if (role === "admin") {
    user = {
      role: "admin",
      signUpAPI: "/admin/signup",
      profileRoute: "/admin/profile",
      loginRoute: "/admin/login"
    };
  }

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(user.signUpAPI, data);
      dispatch(saveuser(response?.data?.data));
      toast.success("Signup successful!");
      navigate(user.loginRoute, { state: { email: data.email } });
    } catch (error) {
      dispatch(clearuser());
      setSignUpError('An error occurred during signup. Please try again.');
      toast.error("Signup failed. Please try again.");
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
          <h3 className="mt-3">Create Your {user.role} Account</h3>
          <p className="text-white-50 mb-4">Fill in your details to sign up</p>

          {signUpError && <p className="text-danger">{signUpError}</p>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <p className="text-white-50 mb-4">
            Enter your Name
          </p>
            <div className="mb-3 text-start">
              <input
                type="text"
                placeholder="Name"
                {...register('name', { required: 'Name is required' })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.name && <p className="text-danger mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <p className="text-white-50 mb-4">
            Enter your Email
          </p>
            <div className="mb-3 text-start">
              <input
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format',
                  },
                })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
            </div>

            {/* Mobile */}
            <p className="text-white-50 mb-4">
            Enter your Mobile
          </p>
            <div className="mb-3 text-start">
              <input
                type="text"
                placeholder="Mobile Number"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.mobile && <p className="text-danger mt-1">{errors.mobile.message}</p>}
            </div>

            {/* Location */}
            <p className="text-white-50 mb-4">
            Enter your location
          </p>
            <div className="mb-3 text-start">
              <input
                type="text"
                placeholder="Location"
                {...register('location', { required: 'Location is required' })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.location && <p className="text-danger mt-1">{errors.location.message}</p>}
            </div>

            {/* Password */}
            <p className="text-white-50 mb-4">
            Enter your Password
          </p>
            <div className="mb-3 text-start">
              <input
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long',
                  },
                })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <p className="text-white-50 mb-4">
           Confrom Password</p>
            <div className="mb-3 text-start">
              <input
                type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: value => value === getValues('password') || 'Passwords do not match',
                })}
                className="form-control bg-dark text-white border-secondary"
              />
              {errors.confirmPassword && <p className="text-danger mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-warning w-100">
              Sign Up
            </button>
          </form>

          <p className="text-white mt-3">
            Already have an account?{' '}
            <Link to={user.loginRoute} className="text-warning fw-bold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
