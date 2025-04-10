import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../common/Spinner";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
