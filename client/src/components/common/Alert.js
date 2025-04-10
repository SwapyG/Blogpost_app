import React from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

const Alert = ({ type = "info", message, onClose, className }) => {
  // Type classes
  const typeClasses = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  // Icon components
  const icons = {
    info: <FiInfo className="w-5 h-5 text-blue-500" />,
    success: <FiCheckCircle className="w-5 h-5 text-green-500" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <div
      className={`rounded-md border p-4 flex ${typeClasses[type]} ${className}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 flex-grow">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <div className="pl-3">
          <button
            type="button"
            className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Alert;
