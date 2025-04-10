import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiCalendar, FiClock, FiEye } from "react-icons/fi";

const PostCard = ({ post }) => {
  const {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    author,
    categories,
    tags,
    createdAt,
    readTime,
    viewCount,
  } = post;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Cover Image */}
      <Link to={`/posts/${slug}`} className="block">
        <img
          src={
            coverImage || "https://via.placeholder.com/800x400?text=No+Image"
          }
          alt={title}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {categories.slice(0, 2).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          <Link to={`/posts/${slug}`}>{title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-dark-600 mb-4 line-clamp-3">{excerpt}</p>

        {/* Post Meta */}
        <div className="flex items-center text-dark-500 text-sm">
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
                  className="font-medium text-dark-700 hover:text-primary-600 transition-colors"
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

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag._id}
                to={`/tag/${tag.slug}`}
                className="text-xs text-dark-500 hover:text-primary-600 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
