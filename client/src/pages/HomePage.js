import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { FiChevronRight } from "react-icons/fi";

import Spinner from "../components/common/Spinner";
import PostCard from "../components/posts/PostCard";
import FeaturedPost from "../components/posts/FeaturedPost";
import { getPosts } from "../redux/features/posts/postSlice";
import {
  getCategories,
  getFeaturedCategories,
} from "../redux/features/categories/categorySlice";

const HomePage = () => {
  const dispatch = useDispatch();

  const { posts, isLoading: postsLoading } = useSelector(
    (state) => state.posts
  );
  const {
    categories,
    featuredCategories,
    isLoading: categoriesLoading,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    // Fetch posts with featured first
    dispatch(getPosts({ limit: 7, sortBy: "createdAt", sortOrder: "desc" }));

    // Fetch categories
    dispatch(getCategories());
    dispatch(getFeaturedCategories());
  }, [dispatch]);

  // Separate featured post from regular posts
  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured).slice(0, 6);

  const isLoading = postsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BlogApp - Share Your Stories</title>
        <meta
          name="description"
          content="A professional blog platform with all the features you need to share your stories with the world."
        />
      </Helmet>

      <section className="mt-16 md:mt-24">
        {/* Hero Section */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            Welcome to BlogApp
          </h1>
          <p className="text-lg md:text-xl text-dark-600 max-w-2xl mx-auto mb-8">
            A professional blog platform with all the features you need to share
            your stories with the world.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/posts" className="btn btn-primary">
              Explore Posts
            </Link>
            <Link to="/register" className="btn btn-outline">
              Start Writing
            </Link>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* Featured Categories */}
        {featuredCategories && featuredCategories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark-800">
                Featured Categories
              </h2>
              <Link
                to="/posts"
                className="text-primary-600 hover:text-primary-700 flex items-center"
              >
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="block group"
                >
                  <div
                    className="relative h-32 rounded-lg overflow-hidden"
                    style={{ backgroundColor: category.color || "#3498db" }}
                  >
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-xl font-bold drop-shadow-md">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Latest Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-800">Latest Posts</h2>
            <Link
              to="/posts"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary-50 py-12 px-4 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-800 mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto mb-8">
            Join our community of writers and start sharing your unique
            perspective with readers around the world.
          </p>
          <Link to="/register" className="btn btn-primary">
            Get Started Now
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
