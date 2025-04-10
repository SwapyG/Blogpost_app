import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

// Import Redux actions
import {
  updateProfile,
  resetPassword,
} from "../../redux/features/auth/authSlice";

// Import components
import Spinner from "../../components/common/Spinner";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    website: "",
    twitter: "",
    facebook: "",
    instagram: "",
    profileImage: null,
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [profilePreview, setProfilePreview] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        website: user.website || "",
        twitter: user.twitter || "",
        facebook: user.facebook || "",
        instagram: user.instagram || "",
        profileImage: null,
      });

      if (user.profileImage) {
        setProfilePreview(user.profileImage);
      }
    }
  }, [user]);

  // Handle success/error messages
  useEffect(() => {
    if (isError) {
      toast.error(message);
      setProfileSubmitting(false);
      setPasswordSubmitting(false);
    }

    if (isSuccess) {
      if (profileSubmitting) {
        toast.success("Profile updated successfully");
        setProfileSubmitting(false);
      }

      if (passwordSubmitting) {
        toast.success("Password changed successfully");
        setPasswordSubmitting(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    }
  }, [isError, isSuccess, message, profileSubmitting, passwordSubmitting]);

  // Handle profile form input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle password form input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profileImage: file });

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Website validation (if provided)
    if (
      profileData.website &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+/.test(
        profileData.website
      )
    ) {
      newErrors.website = "Website URL is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("bio", profileData.bio);
    formData.append("website", profileData.website);
    formData.append("twitter", profileData.twitter);
    formData.append("facebook", profileData.facebook);
    formData.append("instagram", profileData.instagram);

    if (profileData.profileImage) {
      formData.append("profileImage", profileData.profileImage);
    }

    setProfileSubmitting(true);
    dispatch(updateProfile(formData));
  };

  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setPasswordSubmitting(true);
    dispatch(resetPassword(passwordData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>My Profile | BlogApp</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "password"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      {/* Profile Information Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-6">
              <div className="flex items-center">
                <div className="mr-6">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <svg
                        className="h-12 w-12"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="profileImage"
                    className="btn btn-outline text-sm"
                  >
                    Change Picture
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 1MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="form-label">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className={`form-input ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`form-input ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={profileData.bio}
                onChange={handleProfileChange}
                className="form-input"
                placeholder="Tell us a little about yourself"
              ></textarea>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Social Profiles
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="website" className="form-label">
                    Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                    className={`form-input ${
                      errors.website ? "border-red-500" : ""
                    }`}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website && (
                    <p className="form-error">{errors.website}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="twitter" className="form-label">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label htmlFor="facebook" className="form-label">
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={profileData.facebook}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="username or profile URL"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="form-label">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={profileData.instagram}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={profileSubmitting}
              >
                {profileSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <label htmlFor="currentPassword" className="form-label">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`form-input ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
              />
              {errors.currentPassword && (
                <p className="form-error">{errors.currentPassword}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="newPassword" className="form-label">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`form-input ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
              />
              {errors.newPassword && (
                <p className="form-error">{errors.newPassword}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`form-input ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={passwordSubmitting}
              >
                {passwordSubmitting ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
