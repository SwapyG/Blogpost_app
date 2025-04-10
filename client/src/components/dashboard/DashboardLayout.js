import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  FiHome,
  FiFileText,
  FiMessageSquare,
  FiTag,
  FiFolder,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { logout } from "../../redux/features/auth/authSlice";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user && user.role === "admin";
  const isEditor = user && (user.role === "admin" || user.role === "editor");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FiHome size={20} />,
      access: "all",
    },
    {
      name: "My Posts",
      path: "/dashboard/posts",
      icon: <FiFileText size={20} />,
      access: "all",
    },
    {
      name: "Comments",
      path: "/dashboard/comments",
      icon: <FiMessageSquare size={20} />,
      access: "all",
    },
    {
      name: "Categories",
      path: "/dashboard/categories",
      icon: <FiFolder size={20} />,
      access: "admin",
    },
    {
      name: "Tags",
      path: "/dashboard/tags",
      icon: <FiTag size={20} />,
      access: "admin",
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <FiUsers size={20} />,
      access: "admin",
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <FiSettings size={20} />,
      access: "all",
    },
  ];

  // Filter based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (item.access === "all") return true;
    if (item.access === "admin" && isAdmin) return true;
    if (item.access === "editor" && isEditor) return true;
    return false;
  });

  return (
    <>
      <Helmet>
        <title>Dashboard - BlogApp</title>
      </Helmet>

      <div className="flex h-[calc(100vh-64px)] mt-16">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* User info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <img
                  src={user?.avatar || "https://via.placeholder.com/40"}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-medium text-dark-800">{user?.name}</h3>
                  <p className="text-sm text-dark-500">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow py-4 overflow-y-auto">
              <ul className="space-y-1">
                {filteredNavItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 text-dark-700 hover:bg-primary-50 hover:text-primary-600
                        ${
                          isActive
                            ? "bg-primary-50 text-primary-600 border-r-4 border-primary-600"
                            : ""
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-dark-700 hover:bg-red-50 hover:text-red-600 rounded-md"
              >
                <FiLogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow overflow-y-auto bg-gray-50 p-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <button
              className="text-dark-700 hover:text-primary-600 focus:outline-none"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <button
              onClick={() => navigate("/dashboard/posts/create")}
              className="btn btn-primary"
            >
              New Post
            </button>
          </div>

          {/* Dashboard content */}
          <div className="overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
