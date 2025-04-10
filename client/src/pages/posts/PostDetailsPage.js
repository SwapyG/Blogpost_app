import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  FiCalendar,
  FiClock,
  FiEye,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiHeart,
  FiEdit,
  FiArrowLeft,
} from "react-icons/fi";

import Spinner from "../../components/common/Spinner";
import { getPostBySlug, resetPost } from "../../redux/features/posts/postSlice";

const PostDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { post, isLoading, isError, message } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth);

  // State for social sharing modal
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    dispatch(getPostBySlug(slug));

    // Cleanup on unmount
    return () => {
      dispatch(resetPost());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate("/posts");
    }
  }, [isError, message, navigate]);

  if (isLoading || !post) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const {
    title,
    content,
    coverImage,
    author,
    categories,
    tags,
    createdAt,
    readTime,
    viewCount,
  } = post;

  // Check if current user is the author
  const isAuthor = user && author && user._id === author._id;

  // Share post functions
  const shareUrl = window.location.href;
  const shareTitle = title;

  const handleShare = (platform) => {
    let shareLink = "";

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareTitle
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast.success("Link copied to clipboard!");
        });
        setShowShareModal(false);
        return;
    }

    window.open(shareLink, "_blank", "noopener,noreferrer");
    setShowShareModal(false);
  };

  return (
    <>
      <Helmet>
        <title>{title} - BlogApp</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <article className="max-w-4xl mx-auto mt-20 mb-16">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-dark-500 hover:text-primary-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="text-sm font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            {title}
          </h1>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center text-dark-500 text-sm gap-y-2">
            {/* Author */}
            <div className="flex items-center mr-6">
              {author && (
                <>
                  <img
                    src={author.avatar || "https://via.placeholder.com/40"}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover mr-2"
                  />
                  <div>
                    <Link
                      to={`/author/${author._id}`}
                      className="font-medium text-dark-700 hover:text-primary-600 transition-colors"
                    >
                      {author.name}
                    </Link>
                    <p className="text-xs text-dark-500">
                      {author.bio
                        ? author.bio.substring(0, 60) + "..."
                        : "Author"}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-4">
              {/* Date */}
              <div className="flex items-center">
                <FiCalendar className="mr-1" />
                <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
              </div>

              {/* Read Time */}
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>{readTime} min read</span>
              </div>

              {/* View Count */}
              <div className="flex items-center">
                <FiEye className="mr-1" />
                <span>{viewCount} views</span>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {coverImage && (
          <div className="mb-8">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* Edit Button (for author) */}
        {isAuthor && (
          <div className="mb-8">
            <Link
              to={`/dashboard/posts/edit/${post._id}`}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <FiEdit className="mr-2" /> Edit Post
            </Link>
          </div>
        )}

        {/* Post Content */}
        <div
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag._id}
                  to={`/tag/${tag.slug}`}
                  className="px-3 py-1 text-sm text-dark-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t border-b border-gray-200 py-4 mb-8">
          <div className="flex space-x-4">
            <button className="flex items-center text-dark-600 hover:text-red-600 transition-colors">
              <FiHeart className="mr-1" /> Like
            </button>
            <button className="flex items-center text-dark-600 hover:text-primary-600 transition-colors">
              <FiBookmark className="mr-1" /> Save
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center text-dark-600 hover:text-primary-600 transition-colors"
            >
              <FiShare2 className="mr-1" /> Share
            </button>
          </div>

          <Link
            to="#comments"
            className="flex items-center text-dark-600 hover:text-primary-600 transition-colors"
          >
            <FiMessageSquare className="mr-1" /> Comments
          </Link>
        </div>

        {/* Author Bio */}
        {author && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={author.avatar || "https://via.placeholder.com/80"}
                alt={author.name}
                className="w-20 h-20 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
              />
              <div>
                <h3 className="text-xl font-bold mb-2">{author.name}</h3>
                <p className="text-dark-600 mb-4">
                  {author.bio || "Author at BlogApp"}
                </p>
                <div className="flex space-x-4">
                  {author.socialLinks &&
                    Object.values(author.socialLinks).some((link) => link) &&
                    Object.entries(author.socialLinks).map(
                      ([platform, link]) => {
                        if (!link) return null;
                        return (
                          <a
                            key={platform}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-dark-500 hover:text-primary-600 transition-colors"
                          >
                            {platform}
                          </a>
                        );
                      }
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div id="comments" className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Comments</h3>

          {/* Comments will be added here in a separate component */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-dark-600 mb-4">
              Comments feature is coming soon.
            </p>
            <button className="btn btn-primary">
              <FiMessageSquare className="mr-2" /> Be the first to comment
            </button>
          </div>
        </div>
      </article>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-dark-900 bg-opacity-75 transition-opacity"
              onClick={() => setShowShareModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-dark-900 mb-4">
                  Share this post
                </h3>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-dark-700 hover:bg-gray-50"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-dark-700 hover:bg-gray-50"
                  >
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-dark-700 hover:bg-gray-50"
                  >
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-dark-700 hover:bg-gray-50"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-dark-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailsPage;
