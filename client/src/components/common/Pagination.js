import React from "react";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers array
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle previous and next buttons
  const handlePrevious = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  // Handle showing limited page numbers with ellipsis
  const getPageNumbers = () => {
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have less pages than max, show all pages
      return pageNumbers;
    }

    // Always show first and last page
    // Show current page and one page before and after it
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    const pages = [];

    // Always add page 1
    pages.push(1);

    // Add ellipsis if needed
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always add last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex justify-center">
      <ul className="flex items-center space-x-1">
        {/* Previous button */}
        <li>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((number, index) => (
          <li key={index}>
            {number === "..." ? (
              <span className="px-4 py-2 text-gray-700">...</span>
            ) : (
              <button
                onClick={() => paginate(number)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === number
                    ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {number}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
