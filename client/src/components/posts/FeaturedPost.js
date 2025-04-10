import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiCalendar, FiClock, FiEye } from "react-icons/fi";

const FeaturedPost = ({ post }) => {
  const {
    title,
    slug,
    excerpt,
    coverImage,
    author,
    categories,
    createdAt,
    readTime,
    viewCount,
  } = post;

  return (
    <div className="relative bg-gradient-to-b from-dark-900/70 to-dark-900/90 rounded-xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={
            coverImage ||
            "https://via.placeholder.com/1200x600?text=Featured+Post"
          }
          alt={title}
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col h-full min-h-[400px] justify-end">
        {/* Featured Badge */}
        <div className="inline-flex mb-3 items-center bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full w-fit">
          Featured
        </div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="text-xs font-medium px-2 py-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white hover:text-primary-300 transition-colors">
          <Link to={`/posts/${slug}`}>{title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-white/80 mb-4 md:text-lg line-clamp-2 md:line-clamp-3">
          {excerpt}
        </p>

        {/* Post Meta */}
        <div className="flex items-center text-white/70 text-sm flex-wrap gap-y-2">
          {/* Author */}
          <div className="flex items-center">
            {author && (
              <>
                <img
                  src={author.avatar || "https://via.placeholder.com/40"}
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <Link
                  to={`/author/${author._id}`}
                  className="font-medium text-white hover:text-primary-300 transition-colors"
                >
                  {author.name}
                </Link>
              </>
            )}
          </div>

          <span className="mx-2">•</span>

          {/* Date */}
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
          </div>

          <span className="mx-2">•</span>

          {/* Read Time */}
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{readTime} min read</span>
          </div>

          {viewCount > 0 && (
            <>
              <span className="mx-2">•</span>
              {/* View Count */}
              <div className="flex items-center">
                <FiEye className="mr-1" />
                <span>{viewCount} views</span>
              </div>
            </>
          )}
        </div>

        {/* Read More */}
        <Link
          to={`/posts/${slug}`}
          className="mt-5 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors w-fit"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPost;
