import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PostDetailsPage from "./pages/posts/PostDetailsPage";

// Dashboard Components
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";

// Protected Route Component
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Redux Actions
import { loadUser } from "./redux/features/auth/authSlice";

// Placeholder for missing components
const NotFoundPage = () => <div>Page Not Found</div>;
const ProfilePage = () => <div>Profile Page - Under Construction</div>;
const PostListPage = () => <div>Post List Page - Under Construction</div>;
const CategoryPostsPage = () => (
  <div>Category Posts Page - Under Construction</div>
);
const TagPostsPage = () => <div>Tag Posts Page - Under Construction</div>;
const AuthorPostsPage = () => <div>Author Posts Page - Under Construction</div>;
const SearchResultsPage = () => (
  <div>Search Results Page - Under Construction</div>
);
const DashboardPosts = () => <div>Dashboard Posts - Under Construction</div>;
const DashboardCreatePost = () => <div>Create Post - Under Construction</div>;
const DashboardEditPost = () => <div>Edit Post - Under Construction</div>;
const DashboardCategories = () => (
  <div>Dashboard Categories - Under Construction</div>
);
const DashboardTags = () => <div>Dashboard Tags - Under Construction</div>;
const DashboardComments = () => (
  <div>Dashboard Comments - Under Construction</div>
);
const DashboardUsers = () => <div>Dashboard Users - Under Construction</div>;
const DashboardSettings = () => (
  <div>Dashboard Settings - Under Construction</div>
);

function App() {
  const dispatch = useDispatch();

  // Check if user is authenticated on app startup
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/:slug" element={<PostDetailsPage />} />
          <Route path="/category/:slug" element={<CategoryPostsPage />} />
          <Route path="/tag/:slug" element={<TagPostsPage />} />
          <Route path="/author/:id" element={<AuthorPostsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="posts" element={<DashboardPosts />} />
            <Route path="posts/create" element={<DashboardCreatePost />} />
            <Route path="posts/edit/:id" element={<DashboardEditPost />} />
            <Route path="comments" element={<DashboardComments />} />
            <Route path="settings" element={<DashboardSettings />} />

            {/* Admin Only Routes */}
            <Route
              path="categories"
              element={
                <AdminRoute>
                  <DashboardCategories />
                </AdminRoute>
              }
            />
            <Route
              path="tags"
              element={
                <AdminRoute>
                  <DashboardTags />
                </AdminRoute>
              }
            />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <DashboardUsers />
                </AdminRoute>
              }
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
