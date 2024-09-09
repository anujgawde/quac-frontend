import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="border-t-4 border-purple-600 animate-spin rounded-full h-12 w-12"></div>
    </div>
  );
};

export default Loader;
