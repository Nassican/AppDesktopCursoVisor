import React from "react";

const Loader = ({ size = "medium", color = "blue" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  const colorClasses = {
    blue: "border-blue-100 border-t-blue-500",
    gray: "border-gray-100 border-t-gray-500",
    white: "border-white/30 border-t-white",
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`
          rounded-full border-4 animate-spin shadow-lg
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
      />
    </div>
  );
};

export default Loader;
