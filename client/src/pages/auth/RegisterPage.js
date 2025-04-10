import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import { register, reset } from "../../redux/features/auth/authSlice";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { name, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isSuccess, isError, message, isAuthenticated } =
    useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if already registered and logged in
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

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      errors.terms = "You must accept the terms and conditions";
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
      name,
      email,
      password,
    };

    dispatch(register(userData));
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
        <title>Register - BlogApp</title>
      </Helmet>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 mt-16">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark-800">
              Create Your Account
            </h1>
            <p className="text-dark-500 mt-2">
              Join our community and start sharing your stories with the world.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Enter your name"
                  className={`form-input pl-10 ${
                    formErrors.name
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
              </div>
              {formErrors.name && (
                <p className="form-error">{formErrors.name}</p>
              )}
            </div>

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
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm your password"
                  className={`form-input pl-10 ${
                    formErrors.confirmPassword
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="form-error">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-dark-600">
                    I agree to the{" "}
                    <Link
                      to="/terms-of-service"
                      className="text-primary-600 hover:text-primary-800"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-primary-600 hover:text-primary-800"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              {formErrors.terms && (
                <p className="form-error mt-1">{formErrors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full btn btn-primary">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
