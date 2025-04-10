import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import { login, reset } from "../../redux/features/auth/authSlice";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isSuccess, isError, message, isAuthenticated } =
    useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }

    // Check for error
    if (isError) {
      toast.error(message);
    }

    // Reset auth state
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    // Clear error for this field when user types
    if (formErrors[e.target.name]) {
      setFormErrors((prevState) => ({
        ...prevState,
        [e.target.name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login - BlogApp</title>
      </Helmet>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 mt-16">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark-800">
              Login to Your Account
            </h1>
            <p className="text-dark-500 mt-2">
              Welcome back! Sign in to access your account and manage your blog.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  className={`form-input pl-10 ${
                    formErrors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="form-error">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <div className="flex justify-between">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className={`form-input pl-10 ${
                    formErrors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="form-error">{formErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full btn btn-primary">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
