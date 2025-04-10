import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiEdit,
  FiFileText,
  FiMessageSquare,
  FiEye,
  FiBarChart2,
} from "react-icons/fi";

import Spinner from "../../components/common/Spinner";
import { getUserPosts } from "../../redux/features/posts/postSlice";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userPosts, isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getUserPosts({ limit: 5 }));
  }, [dispatch]);

  // Calculate some stats
  const totalPosts = userPosts.length;
  const publishedPosts = userPosts.filter(
    (post) => post.status === "published"
  ).length;
  const draftPosts = userPosts.filter((post) => post.status === "draft").length;
  const totalViews = userPosts.reduce((sum, post) => sum + post.viewCount, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-dark-800">Dashboard</h1>
        <Link to="/dashboard/posts/create" className="btn btn-primary">
          <FiEdit className="mr-2" /> New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
              <FiFileText size={24} />
            </div>
            <div>
              <p className="text-sm text-dark-500 font-medium">Total Posts</p>
              <h3 className="text-2xl font-bold text-dark-800">{totalPosts}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiFileText size={24} />
            </div>
            <div>
              <p className="text-sm text-dark-500 font-medium">Published</p>
              <h3 className="text-2xl font-bold text-dark-800">
                {publishedPosts}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiFileText size={24} />
            </div>
            <div>
              <p className="text-sm text-dark-500 font-medium">Drafts</p>
              <h3 className="text-2xl font-bold text-dark-800">{draftPosts}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiEye size={24} />
            </div>
            <div>
              <p className="text-sm text-dark-500 font-medium">Total Views</p>
              <h3 className="text-2xl font-bold text-dark-800">{totalViews}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-dark-800">Recent Posts</h2>
        </div>
        <div className="p-6">
          {userPosts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-dark-500 mb-4">
                You haven't created any posts yet.
              </p>
              <Link to="/dashboard/posts/create" className="btn btn-primary">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userPosts.map((post) => (
                    <tr key={post._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={
                                post.coverImage ||
                                "https://via.placeholder.com/40?text=Post"
                              }
                              alt={post.title}
                              className="h-10 w-10 rounded object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-dark-800 line-clamp-1">
                              {post.title}
                            </div>
                            <div className="text-sm text-dark-500 line-clamp-1">
                              {post.excerpt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : post.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          `}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                        {post.viewCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/dashboard/posts/edit/${post._id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/posts/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {userPosts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to="/dashboard/posts"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-dark-800">Quick Links</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/posts/create"
              className="flex items-center justify-center p-4 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 transition-colors"
            >
              <FiEdit className="mr-2" /> Create New Post
            </Link>
            <Link
              to="/dashboard/posts"
              className="flex items-center justify-center p-4 bg-gray-50 text-dark-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiFileText className="mr-2" /> Manage Posts
            </Link>
            <Link
              to="/dashboard/comments"
              className="flex items-center justify-center p-4 bg-gray-50 text-dark-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiMessageSquare className="mr-2" /> Manage Comments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
